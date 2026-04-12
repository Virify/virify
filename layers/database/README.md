# Database Layer

## Overview

The database layer is the central data access layer for Virify. It manages three separate PostgreSQL databases via Prisma ORM, exposes 100+ server API endpoints, implements a multi-tier caching strategy, and provides 25+ server utilities consumed by all other layers.

## Table of Contents

- [Architecture: Three Databases](#architecture-three-databases)
- [Directory Structure](#directory-structure)
- [Prisma Schema](#prisma-schema)
- [Server Utilities](#server-utilities)
- [Caching Strategy](#caching-strategy)
- [API Endpoints](#api-endpoints)
- [Scripts Reference](#scripts-reference)
- [Environment Variables](#environment-variables)
- [Key Patterns](#key-patterns)

## Architecture: Three Databases

Virify uses three separate PostgreSQL databases, each with its own Prisma config, schema, client, and migration history:

| Database | Env Var | Purpose | Migrations |
|----------|---------|---------|-----------|
| **Main** | `DATABASE_URL` | All primary data: users, listings, properties, messages, viewings, analytics | 33 |
| **PPD** | `PPD_DATABASE_URL` | UK Land Registry price-paid data | 4 |
| **Waiting List** | `WAITING_LIST_DATABASE_URL` | Waiting list sign-ups | 2 |

**Client access** uses lazy-initialized singleton proxies (`prisma`, `ppdPrisma`, `waitingListPrisma`) defined in `server/utils/prisma-client.ts`. This prevents connection pool exhaustion and handles Nitro's async runtime config resolution.

## Directory Structure

```
layers/database/
├── nuxt.config.ts                       # Runtime config (database URLs, admin creds, OpenAI key)
├── server/
│   ├── api/                             # 17 top-level API directories (100+ endpoints)
│   │   ├── address/                     # Address autocomplete
│   │   ├── conversation/                # Messaging (create, reply, mark-read, sent, by ID)
│   │   ├── draft-listings/              # Draft CRUD + media upload/delete
│   │   ├── edit-listing/                # Step-based listing editor (steps/eight/)
│   │   ├── listing/                     # Single listing (publish, restore, by ID)
│   │   ├── listings/                    # Listing index + featured + update
│   │   ├── mortgage/                    # Calculator, rate fetch, admin
│   │   ├── notifications/               # Aggregates, counts, dismiss, mark-read
│   │   ├── ppd/                         # Price-paid database test endpoint
│   │   ├── price/                       # Price graph, min/max
│   │   ├── price-paid/                  # Create + update price-paid records
│   │   ├── property/                    # Property by ID
│   │   ├── search/                      # RAG (AI) search + traditional search
│   │   ├── user/                        # Nested user endpoints (see below)
│   │   ├── viewing/                     # Viewing requests (create, list, by ID)
│   │   └── waiting-list/                # Join + count
│   ├── database/
│   │   ├── prisma/                      # Main database: schema, migrations (33), config
│   │   ├── prisma-ppd/                  # PPD database: schema, migrations (4), config
│   │   └── prisma-waiting-list/         # Waiting list: schema, migrations (2), config
│   ├── utils/                           # 25+ server utility modules
│   └── tasks/                           # Cache busting Nitro tasks
```

### User API (`server/api/user/`) — full hierarchy

```
user/
├── profile/              GET / PATCH / POST
├── my-listings/          GET (index) + [id]/ (POST update, DELETE, availability/)
├── draft-listings/       GET
├── favourites/          [id]/ (POST add, DELETE remove) + all/ (full/, recent/, lookups/)
├── hidden-listings/     [id]/ (POST add, DELETE remove) + all/ (full/, lookups/)
├── notes/               [id]/ (GET, POST, DELETE) + all/ (full/, lookups/) + recent/
├── locations/            PATCH
├── notifications/        GET
├── viewed/               GET/POST viewed listings
└── security/             Password change
```

The `full/`, `recent/`, `lookups/` subdirectory pattern optimises for different access depths:
- `full/` — paginated full records (all fields)
- `recent/` — limited recent items (dashboard cards)
- `lookups/` — IDs only (existence checks, badge counts)

## Prisma Schema

The main schema is modularised across 14 subdirectories under `server/database/prisma/`:

```
prisma/
├── schema.prisma              # Generator + datasource config only
├── address/                   # Address (PostGIS geographic data)
├── analytics/                 # 7 models: ListingView, ListingClick, ListingShare,
│                              #   ListingImpression, DailyListingStats, DailyUserStats, TrackSearch
├── communication/             # Conversation, Message, Viewing
├── draft-listing/             # DraftListing (with step tracking)
├── estate-agent/              # EstateAgent, Agent
├── listing/                   # Listing, RentalListing, SaleListing
│                              #   Tier enum: BASIC | PREMIUM | FEATURED
├── media/                     # Media, UserMedia
├── membership/                # Membership
├── mortgage/                  # MortgageRate, MortgageCalculation
├── property/                  # Property + 14 feature models (Bedroom, Bathroom,
│   │                          #   Kitchen, Reception, OtherRoom, Parking, Amenities,
│   │                          #   Security, Storage, Utility, EnergyAndUtilities,
│   │                          #   RunningCosts, AdditionalFeatures, Accessibility)
│   └── outdoor-space/         # OutdoorSpace, Yard, Garden, Land
├── user/                      # 13 models: User, UserFavouriteListing, UserNote,
│                              #   UserPreferences, HiddenListing, UserLocation,
│                              #   SavedSearch, UserNotification, ListingPriceHistory
├── verification/              # Verification (email/phone)
└── migrations/                # 33 timestamped migration folders
```

**Key models:**

| Model | Purpose |
|-------|---------|
| `User` | Accounts with intent (buyer/seller/renter/landlord), verification status, notification prefs, memberships |
| `Listing` | Published property listings with tier and listing type |
| `DraftListing` | In-progress listing creation with per-step completion tracking |
| `Property` | Full property detail with 14 feature sub-models |
| `Conversation` / `Message` | Bidirectional enquiry messaging between buyers and sellers |
| `Viewing` | Viewing requests with proposed dates/times and state machine |
| `UserNotification` | In-app notification records (10 notification types) |
| `Address` | PostGIS `geography` field for spatial queries |
| `TrackSearch` | Search event log (bbox, filters, results count) |

## Server Utilities

All utilities in `server/utils/` are auto-imported by Nitro and used across all API endpoints:

### Core

| File | Exports | Purpose |
|------|---------|---------|
| `prisma-client.ts` | `prisma`, `ppdPrisma`, `waitingListPrisma` | Lazy singleton proxy clients for all 3 databases |
| `cache.ts` | `invalidateListingCache()`, `invalidateAggregates()`, etc. | Cache invalidation functions for all collection types |
| `errors/prisma-error-handler.ts` | `handlePrismaError()` | Parses P2002 (unique constraint) and P2003 (foreign key) Prisma errors into user-friendly messages |
| `pagination.ts` | `calculatePagination()` | Shared pagination helper used by paginated endpoints |

### Entity Utilities

| File | Key Exports | Purpose |
|------|-------------|---------|
| `user.ts` | `findUser()`, `findUserForProfileUpdate()`, `getFullUserById()` | User lookup helpers |
| `listing.ts` | `getListingById()`, `getFullListingById()`, `getListingByIdForEdit()` | Listing fetching with varying include depth |
| `property.ts` | `propertyInclude` | Prisma include object for deep property queries with all 14 feature models |
| `viewing.ts` | Viewing CRUD | Viewing request lifecycle queries |
| `conversation.ts` | Message/conversation creation | Conversation and reply management |
| `draft-listing.ts` | Draft CRUD | Draft listing stepwise queries |
| `user-favourite-listing.ts` | Favourites with pagination | CRUD and paginated listing of user favourites |
| `user-note.ts` | Notes with lookups | Notes with sorting and lookup queries |
| `user-hidden-listing.ts` | Hidden listings | Hidden listing tracking |
| `user-saved-location.ts` | Saved locations | Saved search location queries |
| `user-owned-listings.ts` | Published listings | User's live listing queries |
| `notification.ts` | `createNotification()` | Creates in-app notification records |
| `analytics.ts` | Event tracking | Listing view/click/impression recording |
| `location.ts` | PostGIS helpers | `ST_Distance`, `ST_MakePoint`, polygon-based searches |
| `address.ts` | `addressAutoComplete()` | PostgreSQL full-text search (`to_tsvector`) for address lookup |
| `price.ts` | `getCachedMinMaxPrice()` | Cached min/max price for listings |
| `price-paid.ts` | PPD queries | Land Registry price-paid data operations |
| `ai-search.ts` | RAG search helpers | Vector-based AI search utilities |
| `db-fields.ts` | `mapFilters()` | Maps UI filter options to Prisma where clauses |

## Caching Strategy

Caching is implemented via Nitro's `useStorage("cache")` and `useStorage("cache:listing")` stores.

**Cache TTL tiers:**

| Data Type | TTL | Invalidated By |
|-----------|-----|----------------|
| Individual listings | 24 hours | Any mutation to that listing |
| Paginated listing collections | 2–5 minutes | Add/remove/update in collection |
| Aggregate counts (navbar badges) | 5–30 minutes | Mutations to the count's source data |
| Recent items (dashboard cards) | Short TTL | New item added/removed |
| Min/max price | 1 hour | `defineCachedFunction()` wrapper |
| Waiting list count | Short TTL | New sign-up |

**Cache invalidation** is centralised in `server/utils/cache.ts`. Each mutation endpoint calls the appropriate invalidation function rather than setting TTLs reactively. This prevents stale data across pagination variants.

## API Endpoints

### Address
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/address/auto-complete` | Full-text address autocomplete (PostgreSQL `tsvector`) |

### Conversations
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/conversation/[id]` | Get single conversation with messages |
| `POST` | `/api/conversation/create` | Create new conversation (enquiry) |
| `POST` | `/api/conversation/reply` | Send a reply message |
| `POST` | `/api/conversation/mark-read` | Mark conversation as read |
| `GET` | `/api/conversation/sent` | List conversations initiated by user |

### Draft Listings
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/draft-listings/create` | Create new draft listing |
| `GET` | `/api/draft-listings/[id]` | Get draft listing |
| `PATCH` | `/api/draft-listings/[id]` | Update draft listing steps |
| `DELETE` | `/api/draft-listings/[id]` | Delete draft listing |
| `POST` | `/api/draft-listings/[id]/media` | Upload media to draft |
| `DELETE` | `/api/draft-listings/[id]/media` | Remove media from draft |

### Listings
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/listings` | Search/filter listings (main public endpoint) |
| `GET` | `/api/listings/featured` | Featured listings for homepage |
| `POST` | `/api/listings/update` | Update listing details |
| `GET` | `/api/listings/[id]` | Get single listing by ID |
| `GET` | `/api/listing/[id]` | Get listing (alternative route) |
| `POST` | `/api/listing/publish` | Publish a draft listing |
| `POST` | `/api/listing/restore` | Restore archived listing |

### Mortgage
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/mortgage/calculate` | Run mortgage calculation |
| `GET` | `/api/mortgage/rates` | Get current mortgage rates |
| `POST` | `/api/mortgage/admin` | Admin mortgage rate management |

### Notifications
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/notifications` | List user notifications |
| `GET` | `/api/notifications/aggregates` | Get notification badge counts |
| `GET` | `/api/notifications/counts` | Per-type notification counts |
| `POST` | `/api/notifications/dismiss` | Dismiss notification(s) |
| `POST` | `/api/notifications/mark-read` | Mark notification(s) read |

### Price & Price Paid
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/price` | Price data for listing |
| `GET` | `/api/price/graph` | Price history graph data |
| `GET` | `/api/price/min-max` | Min/max prices for current filter |
| `POST` | `/api/price-paid` | Submit price-paid record |
| `POST` | `/api/price-paid/[id]` | Update price-paid record |

### Property
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/property/[id]` | Get full property with all features |

### Search
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/search/traditional` | Standard filter-based property search |
| `POST` | `/api/search/rag` | AI/RAG-powered natural language search |

### User — Profile & Security
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/user/profile` | Get user profile |
| `PATCH` | `/api/user/profile` | Update profile fields |
| `POST` | `/api/user/profile` | Create/complete profile |
| `PATCH` | `/api/user/security` | Change password |

### User — Listings
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/user/my-listings` | Get user's published listings |
| `POST` | `/api/user/my-listings/[id]` | Update listing (pause, archive) |
| `DELETE` | `/api/user/my-listings/[id]` | Delete listing |
| `POST` | `/api/user/my-listings/[id]/availability` | Update listing availability |
| `GET` | `/api/user/draft-listings` | Get user's draft listings |

### User — Saved Items
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/user/favourites/all/full` | Paginated full favourites list |
| `GET` | `/api/user/favourites/all/recent` | Recent favourites (dashboard card) |
| `GET` | `/api/user/favourites/all/lookups` | Favourite IDs only (for existence checks) |
| `POST` | `/api/user/favourites/[id]` | Add to favourites |
| `DELETE` | `/api/user/favourites/[id]` | Remove from favourites |
| `GET` | `/api/user/hidden-listings/all/full` | Paginated hidden listings |
| `GET` | `/api/user/hidden-listings/all/lookups` | Hidden listing IDs only |
| `POST` | `/api/user/hidden-listings/[id]` | Hide a listing |
| `DELETE` | `/api/user/hidden-listings/[id]` | Unhide a listing |
| `GET` | `/api/user/notes/all/full` | Paginated notes list |
| `GET` | `/api/user/notes/all/lookups` | Note IDs only |
| `GET` | `/api/user/notes/recent` | Recent notes (dashboard card) |
| `GET` | `/api/user/notes/[id]` | Get single note |
| `POST` | `/api/user/notes/[id]` | Create/update note |
| `DELETE` | `/api/user/notes/[id]` | Delete note |
| `PATCH` | `/api/user/locations` | Update saved search locations |
| `GET` | `/api/user/notifications` | Get user notifications |
| `GET/POST` | `/api/user/viewed` | Get / record viewed listings |

### Viewings
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/viewing` | List viewings for current user (by role + status) |
| `POST` | `/api/viewing/create` | Create viewing request |
| `GET/PATCH` | `/api/viewing/[id]` | Get / update viewing (accept, decline, counter, reschedule) |

### Waiting List
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/waiting-list` | Join waiting list |
| `GET` | `/api/waiting-list/count` | Get total waiting list count |

## Scripts Reference

All scripts run from the workspace root with `pnpm`.

### Prisma Client Generation

Must run after any schema change before type-checking or building:

```bash
pnpm pgen                    # Main database
pnpm pgen:ppd                # PPD (price-paid) database
pnpm pgen:waiting-list       # Waiting list database
```

### Migrations

```bash
# Development (creates migration files)
pnpm db:migrate-dev          # Main database
pnpm db:migrate-dev:ppd      # PPD database
pnpm migrate-dev:waiting-list  # Waiting list database

# Production (applies existing migrations, no prompts)
pnpm db:migrate-deploy       # Main database

# Reset (destructive — dev only)
pnpm migrate-reset           # Main database
pnpm migrate-reset:ppd       # PPD database
pnpm migrate-reset:waiting-list  # Waiting list

# Schema push (skips migration history — use with care)
pnpm db-push                 # Main database
pnpm db-push:ppd             # PPD database

# Validate schema syntax
pnpm prisma-validate
```

### Database Inspection

```bash
pnpm db-studio               # Open Prisma Studio — main DB (localhost:5555)
pnpm db-studio:ppd           # Open Prisma Studio — PPD database
pnpm db-studio:waiting-list  # Open Prisma Studio — waiting list database
```

## Environment Variables

Declared in `nuxt.config.ts` `runtimeConfig`:

```bash
# Database connections (required)
DATABASE_URL=postgresql://user:password@host:5432/virify
PPD_DATABASE_URL=postgresql://user:password@host:5432/virify_ppd
WAITING_LIST_DATABASE_URL=postgresql://user:password@host:5432/virify_wl

# Admin account (used by seed layer)
ADMIN_EMAIL=admin@virify.co.uk
ADMIN_PASSWORD=your-secure-password
ADMIN_USERNAME=Virify

# AI search
OPENAI_API_KEY=sk-...
```

## Key Patterns

### Lazy Singleton Proxy Clients

```ts
// server/utils/prisma-client.ts
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const config = useRuntimeConfig()
    // instantiate on first access, reuse thereafter
  }
})
```

This defers instantiation until the first actual DB call, which is necessary because Nitro's runtime config (database URL) is not available at module load time.

### Authentication in Endpoints

```ts
// All protected endpoints use requireUserSession()
const { user } = await requireUserSession(event)
// Throws 401 automatically if not authenticated — no manual check needed
```

### Response Format

Endpoints return data directly (not wrapped in `{ success, data }`). Errors use `errorResponse()` which delegates to `handlePrismaError()` for DB-specific messages or returns a generic HTTP error.

### Zod Validation

```ts
// Query params validated with getValidatedQuery()
const { role, status, sort } = await getValidatedQuery(event, ViewingQuerySchema.parse)

// Body validated with readValidatedBody()
const body = await readValidatedBody(event, CreateViewingSchema.parse)
```

### Cache Key Conventions

Cache keys include user ID to prevent data leaking between sessions:
```
cache:listing:{id}
cache:aggregates:{userId}
cache:favourites:{userId}:{page}
```

