# Dashboard Layer

The `layers/dashboard` layer contains all authenticated user dashboard pages, composables, components, and server utilities. It sits on top of `layers/database` and `layers/websocket`.

**All routes under `/dashboard/*` require the `authenticated` middleware.**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Caching Strategy](#caching-strategy)
3. [Aggregates System](#aggregates-system)
4. [WebSocket Events](#websocket-events)
5. [Navigation Badges](#how-navigation-badges-work)
6. [Feature: Enquiries / Chat](#feature-enquiries--chat)
7. [Feature: Viewings](#feature-viewings)
8. [Feature: Create Listing](#feature-create-listing)
9. [Feature: My Listings](#feature-my-listings)
10. [Feature: Draft Listings](#feature-draft-listings)
11. [Feature: Favourites](#feature-favourites)
12. [Feature: Notes](#feature-notes)
13. [Feature: Hidden Listings](#feature-hidden-listings)
14. [Feature: Saved Locations](#feature-saved-locations)
15. [Feature: Viewed Listings](#feature-viewed-listings)
16. [Feature: Analytics](#feature-analytics)
17. [Feature: Profile & Settings](#feature-profile--settings)
18. [Feature: Tiers & Pricing](#feature-tiers--pricing)
19. [Feature: Notifications](#feature-notifications)
20. [Filtering System](#filtering-system)
21. [Step-by-Step: Adding a New Feature](#step-by-step-adding-a-new-feature)
22. [Key Composables](#key-composables)

---

## Architecture Overview

```
User Action (UI)
     │
     ▼
Server API Endpoint  ──►  Database (Prisma)
     │
     ├──► Bust server-side cache (useStorage / cache utils)
     │
     └──► WebSocket broadcast (createAggregateUpdateMessage)
                │
                ▼
        websocket.client.ts plugin
                │
                ▼
        useNotifications  ──►  Optimistic update to aggregates ref
                │
                ▼
        useDashboardNavigation  ──►  Reactive sidebar badges auto-update
```

---

## Caching Strategy

### Two layers of cache

| Layer | Tool | Where |
|---|---|---|
| Server-side (nitro) | `useStorage('cache')` | API route handlers |
| Client-side (reactive) | Shared composable refs + `useAsyncData` | Vue composables |

### Server-side cache keys

All keys follow a consistent namespace pattern:

```
// Aggregates (badge counts)
aggregates:user:{userId}                                 TTL: 5 min

// Favourites
favs:lookups:{userId}                                    TTL: varies
favs:recent:{userId}                                     TTL: 30 min
favs:full:{userId}:{filter}:{sort}:{page}:{limit}        TTL: 60 min

// Notes
notes:full:{userId}:{filter}:{sort}:{page}:{limit}       TTL: 60 min

// My / Draft / Archived listings
my-listings:{userId}:{filter}:{sort}:{page}:{limit}      TTL: 60 min
draft-listings:{userId}:{filter}:{sort}:{page}:{limit}   TTL: 60 min

// Other user-scoped lists
hidden:full:{userId}:...                                 TTL: 60 min
viewings:{userId}:{role}:{status}:{sort}                 TTL: 5 min

// Shared / non-user
listing:{listingId}                                      TTL: 15 min
property:{propertyId}                                    TTL: varies
```

### Cache busting utilities

All invalidation helpers live in:
```
layers/database/server/utils/cache.ts
```

**Aggregate invalidation** (call whenever badge counts change):
```ts
await invalidateAggregatesCache(userId)
```

**Paginated list invalidation** (prefix-sweep — clears every page/filter/sort combo):
```ts
await invalidateFavouritesFullCache(userId)
await invalidateNotesFullCache(userId)
await invalidateMyListingsCache(userId)
await invalidateDraftListingsCache(userId)
await invalidateHiddenListingsFullCache(userId)
await invalidateViewingsCache(userId)
```

**Single-key invalidation:**
```ts
await invalidateFavouritesRecentCache(userId)
await invalidateLocationsCache(userId)
await invalidateRecentViewedCache(userId)
await invalidateConversationSentCache(userId)
```

---

## Aggregates System

`UserItemsAggregates` is the single object that drives all sidebar badge counts. It lives in `useNotifications` (singleton via `createSharedComposable`).

### The type (shared/types/notifications.ts)

```ts
interface UserItemsAggregates {
  favourites: number
  notes: number
  hiddenListings: number
  viewedListings: number
  enquiries: number
  locations: number
  listings: number              // active live listings
  draftListings: number
  archivedListings: number
  messages: number
  unreadMessages: number
  unreadConversations: number
  sentEnquiries: number
  sentUnreadEnquiries: number
  receivedEnquiries: number
  receivedUnreadEnquiries: number
  viewings: number              // PENDING + ACCEPTED + RESCHEDULED
}
```

### How aggregates update

Updates come from two paths and are **always additive/subtractive** (never a full re-fetch):

**Path 1 — WebSocket (immediate, optimistic):**
```
Server sends aggregate_update { aggregateType: "favourites", operation: "add" }
  → websocket.client.ts receives it
  → calls handleAggregateUpdate()
  → aggregates.value.favourites += 1
  → useDashboardNavigation recomputes badge instantly
```

**Path 2 — TTL safety net (5 min):**
If a WebSocket message is missed (network blip, reconnect), the next call to
`fetchUserItemsAggregates()` hits `/api/notifications/aggregates` which re-queries
the DB and refreshes the cached value.

---

## Notification Types

Defined in `shared/types/notifications.ts`:

```ts
type NotificationType =
  | "NEW_MESSAGE"           // Incoming chat message
  | "NEW_ENQUIRY"           // Someone enquired on your listing
  | "ENQUIRY_REPLY"         // Reply to your enquiry
  | "LISTING_UPDATE"        // A saved listing changed
  | "SYSTEM"                // Platform announcement
  | "VIEWING_REQUEST"       // Someone requested a viewing on your listing
  | "VIEWING_ACCEPTED"      // Owner accepted your viewing request
  | "VIEWING_REJECTED"      // Owner rejected your viewing request
  | "VIEWING_RESCHEDULED"   // Owner proposed a new time
  | "VIEWING_CANCELLED"     // A viewing was cancelled
```

### Notification shape (`UserNotification`)

```ts
interface UserNotification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  senderUsername: string | null
  senderAvatar: string | null
  conversationId: number | null
  listingId: number | null
  isRead: boolean
  isDismissed: boolean
  createdAt: Date
  readAt: Date | null
  // Denormalised listing snapshot (for display without extra queries)
  listingPrice: number | null
  listingAddress: string | null
  listingImage: string | null
  listingIsRental: boolean | null
}
```

---

## WebSocket Events

The `websocket.client.ts` plugin is the **single entry point** for all real-time data.

### Event map

| Event | What it does |
|---|---|
| `aggregate_update` | Optimistic +1/-1 on one aggregate key |
| `new_conversation` | Adds conversation to `useEnquiries` + bumps 3 aggregate keys |
| `new_message` | Updates conversation unread state + fetches notification counts |
| `notification_new` | Adds to notification list + shows toast. If VIEWING_*, also fully re-fetches viewings and aggregates |
| `message_read` | Updates read state in `useEnquiries` only |

### Viewing-specific WS behaviour

Viewing notifications (`VIEWING_*`) trigger a **full re-fetch** of both
`fetchViewings()` and `fetchUserItemsAggregates(true)` — not just optimistic
updates. This ensures status, dates and counters stay accurate after multi-step
viewing workflows (request → accept/reject → reschedule).

---

## How Navigation Badges Work

`useDashboardNavigation` is a computed-only composable:

```ts
export const useDashboardNavigation = createSharedComposable(() => {
  const { aggregates } = useNotifications()

  const items = computed(() => [
    { label: 'Viewings', badge: aggregates.value.viewings > 0 ? String(aggregates.value.viewings) : undefined },
    { label: 'Enquiries', badge: aggregates.value.unreadConversations || undefined },
    // ... etc
  ])

  return { items }
})
```

No fetching, no side effects — badges are entirely derived from `aggregates`. The
moment `aggregates` updates (via WS), every badge in the nav recomputes automatically.

---

## Feature: Enquiries / Chat

**Routes:** `/dashboard/enquiries` (list), `/dashboard/enquiries/[id]` (per-listing conversation view)

**Composables:** `useEnquiries` (singleton), `useEnquiryModal`

### Overview

The enquiries system is a full bidirectional messaging system between buyers/tenants and sellers/landlords. Each **conversation** belongs to a listing. A listing can have multiple conversations (one per buyer). Messages within a conversation are ordered chronologically.

### Data model

```
Listing
  └── Conversation (one per buyer/tenant, linked to enquiry)
        └── Message[]
              ├── text content
              ├── optional media (Cloudflare R2 URL)
              └── isRead, createdAt, sender
```

### Pages

**`/dashboard/enquiries` (index)**
- Lists all conversations with sort, filter, and direction controls
- Sort: Newest / Oldest / By Listing (groups conversations under their listing)
- Filter: All/Unread tabs, Sale/Rent toggle, Sent/Received direction
- View toggle: Grid cards or list layout
- Each card shows: other party's avatar/username, listing address + price, last message preview, unread badge, timestamp

**`/dashboard/enquiries/[id]` (per-listing)**
- Left panel: listing card (sticky on desktop) with address, price, images
- Right panel: all conversations for that listing, each showing last message
- Clicking a conversation opens the chat modal

### Chat modal (`OrganismsDashboardEnquiryModal`)

- Full message thread with avatars and timestamps
- Compose area with emoji picker and media upload (Cloudflare R2)
- Auto-scroll to latest message on open
- Marks messages as read on open (optimistic + server)
- Typing indicator shown to the other party
- Listing availability status change (AVAILABLE / UNDER_OFFER / SOLD / LET / etc.)
- Viewing request flow embedded via `OrganismsDashboardEnquiryViewingPopover`

### Viewing popover in chat

The `OrganismsDashboardEnquiryViewingPopover` lives inside the chat footer. It shows:
- A list of all viewings associated with this conversation
- Quick accept-counter button for RESCHEDULED viewings
- "Manage" link → opens the full viewing management flow
- A new viewing request form (multi-date calendar + time preferences)

### `useEnquiries` (singleton)

```ts
const {
  enquiries,             // All conversations
  activeEnquiry,         // Currently open conversation
  loading,
  fetchEnquiries,
  sendMessage,
  startConversation,
  markAsRead,
  getConversationViewings,
} = useEnquiries()
```

Handles:
- WebSocket events: `new_conversation`, `new_message`, `message_read`
- Deduplication of incoming real-time messages
- Hydrating listing data on demand (lazy, not pre-fetched)
- Tracking which listings have been contacted (for UI state)

### `useEnquiryModal`

Handles the presentational logic of the chat modal:
- Opens/closes the modal and loads the conversation
- Sends messages (text or media)
- Manages emoji picker open state
- Auto-scrolls the message container
- Handles listing status updates

### API endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/conversation` | List user's conversations (with filter/sort/pagination) |
| `POST` | `/api/conversation/create` | Start a new conversation |
| `GET` | `/api/conversation/{id}/messages` | Get messages for a conversation |
| `POST` | `/api/conversation/{id}/messages` | Send a message |
| `PATCH` | `/api/conversation/{id}/read` | Mark messages as read |

---

## Feature: Viewings

**Route:** `/dashboard/viewings`

**Composables:** `useViewings` (singleton), `useViewingRequest`

### Status lifecycle

```
                    ┌──────────────────────────────────────┐
                    │                                      │
PENDING ──accept──► ACCEPTED ──cancel──► CANCELLED        │
  │                    │                                   │
  ├──reject──► REJECTED│                                   │
  │                    └──reschedule──► RESCHEDULED ───────┘
  │                                        │   ▲
  │                                 accept │   │ counter-propose (requester)
  │                                        ▼   │
  │                                     ACCEPTED
  └──cancel──► CANCELLED
```

| Status | Color | Label |
|---|---|---|
| `PENDING` | warning | Pending |
| `ACCEPTED` | success | Confirmed |
| `REJECTED` | error | Declined |
| `RESCHEDULED` | info | Time proposed |
| `CANCELLED` | error | Cancelled |

Status → UI helpers in `app/utils/viewing.ts`: `VIEWING_STATUS_COLOR`, `VIEWING_STATUS_LABEL`.

### The two negotiation modals

#### `OrganismsDashboardViewingRescheduleModal` — Owner's tool

| Mode | Triggered by | What it does | API call |
|---|---|---|---|
| `accept` | PENDING → "Confirm time" | Owner picks one date from requester's list + sets a time | `PATCH /api/viewing/{id}/respond` with `response: 'accept'` |
| `reschedule` | Any → "Reschedule" | Owner proposes entirely new dates | `PATCH /api/viewing/{id}/respond` with `response: 'reschedule'` |

Accept mode: calendar restricted to requester's proposed dates only. Time quick-picks derived from requester's preferences.

Reschedule mode: free multi-date calendar + multi-select time preferences.

#### `OrganismsDashboardViewingCounterProposeModal` — Requester's tool

Used when the owner has rescheduled and the requester can't make the owner's proposed time.

- Shows the owner's currently proposed time as context (success badge)
- Requester picks new set of dates/times to send back
- Calls `PATCH /api/viewing/{id}/propose` → resets status to `PENDING`
- Also used when requester wants to reschedule a confirmed (`ACCEPTED`) viewing

### Action buttons by status

`MoleculesDashboardViewingCardActions` renders buttons based on `isOwner` + `status`:

| Status | Owner sees | Requester sees |
|---|---|---|
| `PENDING` | Confirm time · Decline · Reschedule | Cancel |
| `ACCEPTED` | Reschedule · Cancel | Reschedule · Cancel |
| `RESCHEDULED` | Reschedule · Cancel | Accept time · Suggest new times · Cancel |

### Viewing utils (`app/utils/viewing.ts`)

Auto-imported across the app:

| Export | Purpose |
|---|---|
| `VIEWING_TIME_OPTIONS` | `["Mornings", "Afternoons", "Evenings", "Any time", "Other..."]` |
| `VIEWING_STATUS_COLOR` | Maps status → Nuxt UI color |
| `VIEWING_STATUS_LABEL` | Maps status → display string |
| `formatProposedDate(iso)` | `"Mon 23 Apr"` |
| `formatViewingDate(iso)` | `"23 Apr 2026"` |
| `formatViewingDateTime(iso)` | `"Mon 23 Apr 2026, 14:00"` |
| `getAllowedDateStrings(dates)` | `Set<string>` for UCalendar restrictions |
| `isViewingDateUnavailable(date, allowed)` | Boolean — passed as `:is-date-unavailable` |
| `getTimeRangeButtons(preferredTimes)` | Quick-pick button array |
| `resolveFinalTimes(selected, otherTime)` | Merges selected + freeform "Other..." |

Calendar export helpers: `app/utils/viewing-calendar.ts` — Google Calendar URL, Outlook URL, `.ics` download.

### API endpoints

| Method | Path | Who | Description |
|---|---|---|---|
| `GET` | `/api/viewing` | Both | Fetch viewings (role/status/sort, 5 min cache) |
| `POST` | `/api/viewing/create` | Requester | Create new viewing request |
| `PATCH` | `/api/viewing/{id}/respond` | Owner | Accept / reject / reschedule |
| `PATCH` | `/api/viewing/{id}/propose` | Either | Propose new dates |
| `DELETE` | `/api/viewing/{id}/cancel` | Either | Cancel |

All mutations: bust both parties' cache, create notification, WS push (or email if offline), aggregate update.

### Component tree

```
OrganismsDashboardEnquiryViewingPopover
  └── MoleculesDashboardViewingPopoverRow       (per viewing)
  └── MoleculesDashboardViewingRequestForm      (new request form)
        └── MoleculesDashboardViewingAvailabilityForm

OrganismsDashboardViewingCard
  └── MoleculesDashboardViewingCardActions
        └── AtomsViewingCalendarMenu            (ACCEPTED only)

OrganismsDashboardViewingRescheduleModal        (owner)
  ├── MoleculesDashboardViewingContextPanel     (accept mode only)
  ├── MoleculesDashboardViewingAcceptForm       (accept mode)
  └── MoleculesDashboardViewingAvailabilityForm (reschedule mode)

OrganismsDashboardViewingCounterProposeModal    (requester)
  ├── MoleculesDashboardViewingContextPanel     (shows owner's proposed time)
  └── MoleculesDashboardViewingAvailabilityForm
```

---

## Feature: Create Listing

**Route:** `/dashboard/create-listing`

**Composable:** `useCreateListingSteps`

### Overview

A 10-step wizard (steps 1–9 with step 3–8 being room type sub-steps) that walks a user through creating a full property listing. Progress is persisted as a draft through the API so the user can resume at any point.

Steps are rendered inside `OrganismsDashboardCreateListingStepWrapper` which enforces the ordering and locks future steps until prior ones are complete.

### Step overview

| Step | Content |
|---|---|
| 1 | Listing type (Sale / Rental), property classification |
| 2 | Address lookup and property details |
| 3–8 | Room types (Bedrooms, Bathrooms, Reception, Kitchen, Garden, Other) — dynamic based on classification |
| 9 | Media upload (images via Cloudflare Images with moderation) |
| 10 | Review and publish |

### Composable: `useCreateListingSteps`

Manages:
- Draft listing creation (`POST /api/draft-listings/create`)
- Saving each step individually (`PATCH /api/draft-listings/update/steps/{stepN}`)
- Step state: `completed`, `locked`, `visited`, `hasChanges`
- Form data caching and change detection (dirty checking)
- Modal open/close state per step
- Supporting both **new listings** and **editing published listings**

### Media upload: `useStep9Media`

- Cloudflare Images upload with virus/moderation check
- Drag-and-drop with file type + size validation (max 10MB per image)
- Maximum image count enforced by user's tier (e.g. free = 5, paid = 20)
- Set-as-main-image (reorders to index 0)
- Batch moderation check on all images
- API: `POST /api/draft-listings/{id}/media`

### Room forms

Each room type has two component variants:
- `OrganismsDashboardBedroomForm` — full inline form
- `OrganismsDashboardBedroomSlideForm` — slide-out panel variant

Room types: Bedroom, Bathroom, Reception, Kitchen, Garden, Yard, Land, OtherRoom.

---

## Feature: My Listings

**Route:** `/dashboard/my-listings`

Shows all of a user's **live / active** listings. Each card (`OrganismsDashboardListingCardMyListing`) shows:
- Property image, address, price
- Analytics snapshot (views, enquiries, favourites)
- Actions: Edit (re-opens create listing wizard), Pause, Unpublish, Delete
- Filter by Sale/Rent, sort Newest/Oldest

Clicking "Edit" re-enters the 10-step listing wizard pre-populated with the existing listing data.

---

## Feature: Draft Listings

**Route:** `/dashboard/draft-listings`

Shows all listings that have been started but not published. Cards provide "Resume" (re-enters wizard) and "Delete" actions.

`useDraftListings` (singleton):
- Holds draft list as a ref
- Delete draft: calls API + removes from local state + busts aggregates

---

## Feature: Favourites

**Route:** `/dashboard/favourites`

Lists all listings the user has saved as a favourite. Cards use `OrganismsDashboardListingCard`.

- Sort: Newest/Oldest
- Filter: Sale/Rent
- Pagination
- Unfavourite from the card directly (optimistic removal)

API: `GET /api/user/favourites` (60 min cache, busted on add/remove).
WS: aggregate `add`/`remove` keeps sidebar badge current.

---

## Feature: Notes

**Route:** `/dashboard/notes`

Lists all listings the user has added personal notes to. Notes are per-listing (one note per user per listing).

- Sort: Newest/Oldest
- Filter: Sale/Rent
- Pagination
- Edit / delete note inline on the card

API: `GET /api/user/notes` (60 min cache).

---

## Feature: Hidden Listings

**Route:** `/dashboard/hidden-listings`

Lists all listings the user has hidden from search results. Cards use `OrganismsDashboardListingCardHidden`.

- Sort / Filter
- Unhide from the card (optimistic removal)

API: `GET /api/user/hidden` (60 min cache).

---

## Feature: Saved Locations

**Route:** `/dashboard/saved-locations`

Lists saved search locations (area + radius combinations). Each saved location card (`OrganismsDashboardListingCardSavedLocation`) can be clicked to jump straight to that search.

- Delete a saved location from the card
- Sort/Filter
- API: `GET /api/user/locations` (busted on add/delete)

---

## Feature: Viewed Listings

**Route:** `/dashboard/viewed`

Lists property listings the current user has viewed (tracked anonymously by IP + user when logged in).

- Sort: Most Recent / Most Viewed
- Filter: Sale/Rent
- Pagination

---

## Feature: Analytics

**Route:** `/dashboard/analytics`

Shows performance analytics for all of the user's active listings.

### Components

| Component | Description |
|---|---|
| `MoleculesDashboardAnalyticsViewsChart` | Views over time (Chart.js line chart) |
| `MoleculesDashboardAnalyticsPerformanceSummary` | Total views, enquiries, favourites |
| `MoleculesDashboardAnalyticsTopListings` | Ranked listing cards by views |
| `MoleculesDashboardAnalyticsTrafficSources` | Where views came from |
| `MoleculesDashboardAnalyticsPeakHours` | Hourly view distribution |
| `MoleculesDashboardAnalyticsDeviceBreakdown` | Mobile vs Desktop split |
| `MoleculesDashboardAnalyticsConversionFunnel` | Views → enquiries → viewings funnel |

### Composable: `useAnalytics` (from `layers/analytics`)

```ts
const { analytics, aggregates, trackListingView, fetchAnalyticsAggregates } = useAnalytics()
```

Also orchestrates `useDashboardRecentItems` refresh after interactions.

---

## Feature: Profile & Settings

**Routes:** `/dashboard/profile`, `/dashboard/security`, `/dashboard/notifications`, `/dashboard/profile/setup-profile`

### Profile (`useProfileForm`)

Editable fields:
- First name, Last name, Username (moderated via bad-words check)
- Address (uses `OrganismsDashboardProfileAddressLookup` with GetAddress autocomplete)
- Phone number
- Bio textarea
- User intent: Buying / Selling / Renting / Landlord (multi-select)
- Avatar upload (`useAvatarUpload` — Cloudflare Images with moderation check)

API: `PATCH /api/user/profile`

**Setup profile flow:** First-time users are redirected to `/dashboard/profile/setup-profile` which gates access to the full dashboard until they've set a username.

### Security (`useSecurityForm`)

Three schema states based on user's verification status:
- `base` — email field only (unverified, no password set)
- `set-password` — add a new password (unverified user setting first password)
- `full` — current password + new password + confirm (verified user changing password)

API: `PATCH /api/user/security`

### Notification preferences (`useNotificationPreferences`)

- Email notifications toggle (persisted to DB)
- Push notifications toggle (persisted to DB)
- Desktop notifications toggle (uses `Notification.requestPermission()` browser API, then persisted)

API: `GET /api/user/notifications`, `PATCH /api/user/notifications`

### Avatar upload (`useAvatarUpload`)

1. Validates file type (JPEG, PNG, WebP) and size (max 2MB)
2. Uploads to Cloudflare Images
3. Runs moderation check — rejects inappropriate content
4. If replacing an existing avatar: deletes old Cloudflare image
5. Persists new image ID to user profile

---

## Feature: Tiers & Pricing

**Route:** `/dashboard/tiers`

Shows the available listing tiers and their feature limits (e.g. max images, listing duration, analytics access). Users can upgrade from the tiers page.

Components:
- `OrganismsDashboardTierTable` — comparison table
- `MoleculesDashboardPriceTier` — individual tier card

`app/utils/tiers.ts` contains tier definitions and feature limits. `maxImages` in `useStep9Media` is computed from the active tier.

---

## Feature: Notifications

**Route:** `/dashboard/notifications`

Full notification history feed showing all `UserNotification` records for the current user.

Components:
- `OrganismsDashboardNotificationButton` — bell icon in top nav with unread badge
- `OrganismsDashboardNotificationList` — dropdown or page list

Notifications are created server-side by API mutations (viewings, enquiries, etc.) and delivered in real-time via the `notification_new` WebSocket event. The `useNotifications` composable (from `layers/notifications`) manages the in-memory list and aggregate counts.

---

## Filtering System

`useDashboardListFilter` is a reusable composable used on every dashboard list page.

```ts
const {
  searchQuery,        // Debounced text search
  sort,               // 'newest' | 'oldest' | 'listing'
  categoryFilter,     // 'all' | 'sale' | 'rent'
  directionFilter,    // 'all' | 'sent' | 'received'  (enquiries only)
  activeTab,          // 'all' | 'unread'  (enquiries only)
  viewMode,           // 'grid' | 'list'
  filterUrlParams,    // Computed query params for API calls
} = useDashboardListFilter({ persistKey: 'dashboard-enquiries' })
```

State can optionally be persisted to a cookie via `persistKey` so the user's sort/filter preference survives page reloads.

The composable also provides `filterItems(items)` for client-side fuzzy search on listing address/title.

Filter UI is split into:
- `OrganismsDashboardFilter` — orchestrator
- `OrganismsDashboardFilterDesktop` — desktop layout (inline toolbar)
- `OrganismsDashboardFilterMobile` — mobile layout (slide-out panel)
- `OrganismsDashboardFilterEnquiries` — enquiry-specific filter options
- `OrganismsDashboardFilterListings` — listing-specific filter options

---

## Step-by-Step: Adding a New Feature with Caching

### 1. Database / Prisma

Add your model to `prisma/schema.prisma` and run `pnpm pgen`.

### 2. Server utility (DB query)

Create `layers/database/server/utils/my-feature.ts`:

```ts
export async function getUserMyFeature(userId: number) {
  return prisma.myFeature.findMany({ where: { userId } })
}
```

### 3. Cache invalidation helper

Add to `layers/database/server/utils/cache.ts`:

```ts
export async function invalidateMyFeatureCache(userId: number): Promise<void> {
  // For paginated lists use prefix sweep:
  await sweepPrefix(useStorage('cache'), `my-feature:${userId}:`)
  // For a single key:
  // await useStorage('cache').removeItem(`my-feature:${userId}`)
}
```

### 4. GET API endpoint (with cache)

Create `layers/database/server/api/user/my-feature/index.get.ts`:

```ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const query = getQuery(event)
  const sort = (query.sort as string) || 'newest'

  const cacheKey = `my-feature:${user.id}:${sort}`
  const storage = useStorage('cache')
  const cached = await storage.getItem(cacheKey)
  if (cached) return cached

  const data = await getUserMyFeature(user.id as number)
  storage.setItem(cacheKey, data, { ttl: 60 * 60 }).catch(() => {})
  return data
})
```

### 5. Mutation endpoint (bust cache + WS broadcast)

Create `layers/database/server/api/user/my-feature/index.post.ts`:

```ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer()

  const body = await readValidatedBody(event, mySchema.parse)

  const result = await createMyFeature(user.id as number, body)

  // 1. Bust all caches affected by this mutation
  await invalidateMyFeatureCache(user.id as number)
  await invalidateAggregatesCache(user.id as number)

  // 2. Broadcast aggregate update via WebSocket
  //    This triggers the optimistic +1 on all connected clients
  const msg = createAggregateUpdateMessage('myFeature', 'add', user.id)
  sendMessage(msg)

  return result
})
```

### 6. Add to UserItemsAggregates

In `shared/types/notifications.ts` add the key to `UserItemsAggregates`:

```ts
myFeature: number  // Count of user's active my-features
```

Update the DB query in `layers/database/server/utils/aggregates.ts` to include the count.

### 7. Add to useDashboardNavigation

In `layers/dashboard/app/composables/useDashboardNavigation.ts`:

```ts
{ label: 'My Feature', badge: aggregates.value.myFeature > 0 ? String(aggregates.value.myFeature) : undefined }
```

### 8. Client composable

Create `layers/dashboard/app/composables/useMyFeature.ts`:

```ts
export const useMyFeature = createSharedComposable(() => {
  const requestFetch = useRequestFetch()
  const { user } = useUserSession()
  const items = ref<MyFeatureItem[]>([])
  const loading = ref(false)

  async function fetchMyFeature() {
    if (!user.value?.id) return
    loading.value = true
    try {
      const data = await requestFetch<MyFeatureItem[]>('/api/user/my-feature')
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  return { items: readonly(items), loading: readonly(loading), fetchMyFeature }
})
```

### 9. Dashboard page

Create `layers/dashboard/app/pages/dashboard/my-feature/index.vue`:

```vue
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #title><MoleculesDashboardBreadcrumb /></template>
        <template #right>
          <OrganismsDashboardFilter
            :items="items"
            date-key="createdAt"
            persistence-key="dashboard-my-feature"
            @update:filtered="filtered = $event"
          />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <!-- render filtered -->
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'dashboard' })

const { items, fetchMyFeature } = useMyFeature()
onMounted(() => fetchMyFeature())

const filtered = ref([])
</script>
```

### 10. WebSocket handler

In `layers/websocket/plugins/websocket.client.ts`, the `onAggregateUpdate` handler already handles any `aggregateType` key generically — no change needed unless you need custom behaviour (like viewings does with its full re-fetch).

---

## TTL Reference

| Data | TTL | Rationale |
|---|---|---|
| Aggregates | 5 min | Safety net; WS keeps them fresh |
| Viewings | 5 min | Frequently changing status |
| Recent items | 30 min | Dashboard homepage, low staleness risk |
| Full paginated lists | 60 min | Expensive queries, busted on mutation |
| Single listing | 15 min | Shared across users |

---

## Key Composables

| Composable | Purpose |
|---|---|
| `useNotifications` | Aggregates, notification list, badge counts — **singleton** |
| `useViewings` | Viewing requests state + negotiation — **singleton** |
| `useEnquiries` | Conversations + messages — **singleton** |
| `useEnquiryModal` | Chat modal presentational logic |
| `useDraftListings` | Draft listing state — **singleton** |
| `useCreateListingSteps` | 10-step listing wizard state |
| `useStep9Media` | Image upload and moderation for listing media |
| `useDashboardNavigation` | Computed nav items from aggregates — **singleton** |
| `useDashboardRecentItems` | Recent favourites/notes for homepage — **singleton** |
| `useDashboardListFilter` | Sort/filter/search logic for any list page |
| `useProfileForm` | Profile editing form state |
| `useSecurityForm` | Password/email security form state |
| `useNotificationPreferences` | Notification settings + browser permission |
| `useAvatarUpload` | Avatar upload + moderation |
| `useViewingRequest` | Viewing request form logic (within enquiry) |

All singletons use `createSharedComposable` from `@vueuse/core`.
     │
     ├──► Bust server-side cache (useStorage / cache utils)
     │
     └──► WebSocket broadcast (createAggregateUpdateMessage)
                │
                ▼
        websocket.client.ts plugin
                │
                ▼
        useNotifications  ──►  Optimistic update to aggregates ref
                │
                ▼
        useDashboardNavigation  ──►  Reactive sidebar badges auto-update
```

---

## Caching Strategy

### Two layers of cache

| Layer | Tool | Where |
|---|---|---|
| Server-side (nitro) | `useStorage('cache')` | API route handlers |
| Client-side (reactive) | Shared composable refs + `useAsyncData` | Vue composables |

### Server-side cache keys

All keys follow a consistent namespace pattern:

```
// Aggregates (badge counts)
aggregates:user:{userId}                                 TTL: 5 min

// Favourites
favs:lookups:{userId}                                    TTL: varies
favs:recent:{userId}                                     TTL: 30 min
favs:full:{userId}:{filter}:{sort}:{page}:{limit}        TTL: 60 min

// Notes
notes:full:{userId}:{filter}:{sort}:{page}:{limit}       TTL: 60 min

// My / Draft / Archived listings
my-listings:{userId}:{filter}:{sort}:{page}:{limit}      TTL: 60 min
draft-listings:{userId}:{filter}:{sort}:{page}:{limit}   TTL: 60 min

// Other user-scoped lists
hidden:full:{userId}:...                                 TTL: 60 min
viewings:{userId}:{role}:{status}:{sort}                 TTL: 5 min

// Shared / non-user
listing:{listingId}                                      TTL: 15 min
property:{propertyId}                                    TTL: varies
```

### Cache busting utilities

All invalidation helpers live in:
```
layers/database/server/utils/cache.ts
```

**Aggregate invalidation** (call whenever badge counts change):
```ts
await invalidateAggregatesCache(userId)
```

**Paginated list invalidation** (prefix-sweep — clears every page/filter/sort combo):
```ts
await invalidateFavouritesFullCache(userId)
await invalidateNotesFullCache(userId)
await invalidateMyListingsCache(userId)
await invalidateDraftListingsCache(userId)
await invalidateHiddenListingsFullCache(userId)
await invalidateViewingsCache(userId)
```

**Single-key invalidation:**
```ts
await invalidateFavouritesRecentCache(userId)
await invalidateLocationsCache(userId)
await invalidateRecentViewedCache(userId)
await invalidateConversationSentCache(userId)
```

---

## Aggregates System

`UserItemsAggregates` is the single object that drives all sidebar badge counts. It lives in `useNotifications` (singleton via `createSharedComposable`).

### The type (shared/types/notifications.ts)

```ts
interface UserItemsAggregates {
  favourites: number
  notes: number
  hiddenListings: number
  viewedListings: number
  enquiries: number
  locations: number
  listings: number              // active live listings
  draftListings: number
  archivedListings: number
  messages: number
  unreadMessages: number
  unreadConversations: number
  sentEnquiries: number
  sentUnreadEnquiries: number
  receivedEnquiries: number
  receivedUnreadEnquiries: number
  viewings: number              // PENDING + ACCEPTED + RESCHEDULED
}
```

### How aggregates update

Updates come from two paths and are **always additive/subtractive** (never a full re-fetch):

**Path 1 — WebSocket (immediate, optimistic):**
```
Server sends aggregate_update { aggregateType: "favourites", operation: "add" }
  → websocket.client.ts receives it
  → calls handleAggregateUpdate()
  → aggregates.value.favourites += 1
  → useDashboardNavigation recomputes badge instantly
```

**Path 2 — TTL safety net (5 min):**
If a WebSocket message is missed (network blip, reconnect), the next call to
`fetchUserItemsAggregates()` hits `/api/notifications/aggregates` which re-queries
the DB and refreshes the cached value.

---

## Notification Types

Defined in `shared/types/notifications.ts`:

```ts
type NotificationType =
  | "NEW_MESSAGE"           // Incoming chat message
  | "NEW_ENQUIRY"           // Someone enquired on your listing
  | "ENQUIRY_REPLY"         // Reply to your enquiry
  | "LISTING_UPDATE"        // A saved listing changed
  | "SYSTEM"                // Platform announcement
  | "VIEWING_REQUEST"       // Someone requested a viewing on your listing
  | "VIEWING_ACCEPTED"      // Owner accepted your viewing request
  | "VIEWING_REJECTED"      // Owner rejected your viewing request
  | "VIEWING_RESCHEDULED"   // Owner proposed a new time
  | "VIEWING_CANCELLED"     // A viewing was cancelled
```

### Notification shape (`UserNotification`)

```ts
interface UserNotification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  senderUsername: string | null
  senderAvatar: string | null
  conversationId: number | null
  listingId: number | null
  isRead: boolean
  isDismissed: boolean
  createdAt: Date
  readAt: Date | null
  // Denormalised listing snapshot (for display without extra queries)
  listingPrice: number | null
  listingAddress: string | null
  listingImage: string | null
  listingIsRental: boolean | null
}
```

---

## WebSocket Events

The `websocket.client.ts` plugin is the **single entry point** for all real-time data.

### Event map

| Event | What it does |
|---|---|
| `aggregate_update` | Optimistic +1/-1 on one aggregate key |
| `new_conversation` | Adds conversation to `useEnquiries` + bumps 3 aggregate keys |
| `new_message` | Updates conversation unread state + fetches notification counts |
| `notification_new` | Adds to notification list + shows toast. If VIEWING_*, also fully re-fetches viewings and aggregates |
| `message_read` | Updates read state in `useEnquiries` only |

### Viewing-specific WS behaviour

Viewing notifications (`VIEWING_*`) trigger a **full re-fetch** of both
`fetchViewings()` and `fetchUserItemsAggregates(true)` — not just optimistic
updates. This ensures status, dates and counters stay accurate after multi-step
viewing workflows (request → accept/reject → reschedule).

---

## How Navigation Badges Work

`useDashboardNavigation` is a computed-only composable:

```ts
export const useDashboardNavigation = createSharedComposable(() => {
  const { aggregates } = useNotifications()

  const items = computed(() => [
    { label: 'Viewings', badge: aggregates.value.viewings > 0 ? String(aggregates.value.viewings) : undefined },
    { label: 'Enquiries', badge: aggregates.value.unreadConversations || undefined },
    // ... etc
  ])

  return { items }
})
```

No fetching, no side effects — badges are entirely derived from `aggregates`. The
moment `aggregates` updates (via WS), every badge in the nav recomputes automatically.

---

## Step-by-Step: Adding a New Feature with Caching

### 1. Database / Prisma

Add your model to `prisma/schema.prisma` and run `pnpm pgen`.

### 2. Server utility (DB query)

Create `layers/database/server/utils/my-feature.ts`:

```ts
export async function getUserMyFeature(userId: number) {
  return prisma.myFeature.findMany({ where: { userId } })
}
```

### 3. Cache invalidation helper

Add to `layers/database/server/utils/cache.ts`:

```ts
export async function invalidateMyFeatureCache(userId: number): Promise<void> {
  // For paginated lists use prefix sweep:
  await sweepPrefix(useStorage('cache'), `my-feature:${userId}:`)
  // For a single key:
  // await useStorage('cache').removeItem(`my-feature:${userId}`)
}
```

### 4. GET API endpoint (with cache)

Create `layers/database/server/api/user/my-feature/index.get.ts`:

```ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const query = getQuery(event)
  const sort = (query.sort as string) || 'newest'

  const cacheKey = `my-feature:${user.id}:${sort}`
  const storage = useStorage('cache')
  const cached = await storage.getItem(cacheKey)
  if (cached) return cached

  const data = await getUserMyFeature(user.id as number)
  storage.setItem(cacheKey, data, { ttl: 60 * 60 }).catch(() => {})
  return data
})
```

### 5. Mutation endpoint (bust cache + WS broadcast)

Create `layers/database/server/api/user/my-feature/index.post.ts`:

```ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer()

  const body = await readValidatedBody(event, mySchema.parse)

  const result = await createMyFeature(user.id as number, body)

  // 1. Bust all caches affected by this mutation
  await invalidateMyFeatureCache(user.id as number)
  await invalidateAggregatesCache(user.id as number)

  // 2. Broadcast aggregate update via WebSocket
  //    This triggers the optimistic +1 on all connected clients
  const msg = createAggregateUpdateMessage('myFeature', 'add', user.id)
  sendMessage(msg)

  return result
})
```

### 6. Add to UserItemsAggregates

In `shared/types/notifications.ts` add the key to `UserItemsAggregates`:

```ts
myFeature: number  // Count of user's active my-features
```

Update the DB query in `layers/database/server/utils/aggregates.ts` to include the count.

### 7. Add to useDashboardNavigation

In `layers/dashboard/app/composables/useDashboardNavigation.ts`:

```ts
{ label: 'My Feature', badge: aggregates.value.myFeature > 0 ? String(aggregates.value.myFeature) : undefined }
```

### 8. Client composable

Create `layers/dashboard/app/composables/useMyFeature.ts`:

```ts
export const useMyFeature = createSharedComposable(() => {
  const requestFetch = useRequestFetch()
  const { user } = useUserSession()
  const items = ref<MyFeatureItem[]>([])
  const loading = ref(false)

  async function fetchMyFeature() {
    if (!user.value?.id) return
    loading.value = true
    try {
      const data = await requestFetch<MyFeatureItem[]>('/api/user/my-feature')
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  return { items: readonly(items), loading: readonly(loading), fetchMyFeature }
})
```

### 9. Dashboard page

Create `layers/dashboard/app/pages/dashboard/my-feature/index.vue`:

```vue
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{ right: 'flex items-center gap-1' }">
        <template #title><MoleculesDashboardBreadcrumb /></template>
        <template #right>
          <OrganismsDashboardFilter
            :items="items"
            date-key="createdAt"
            persistence-key="dashboard-my-feature"
            @update:filtered="filtered = $event"
          />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <!-- render filtered -->
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'dashboard' })

const { items, fetchMyFeature } = useMyFeature()
onMounted(() => fetchMyFeature())

const filtered = ref([])
</script>
```

### 10. WebSocket handler

In `layers/websocket/plugins/websocket.client.ts`, the `onAggregateUpdate` handler already handles any `aggregateType` key generically — no change needed unless you need custom behaviour (like viewings does with its full re-fetch).

---

## TTL Reference

| Data | TTL | Rationale |
|---|---|---|
| Aggregates | 5 min | Safety net; WS keeps them fresh |
| Viewings | 5 min | Frequently changing status |
| Recent items | 30 min | Dashboard homepage, low staleness risk |
| Full paginated lists | 60 min | Expensive queries, busted on mutation |
| Single listing | 15 min | Shared across users |

---

## Key Composables

| Composable | Purpose |
|---|---|
| `useNotifications` | Aggregates, notification list, badge counts — **singleton** |
| `useViewings` | Viewing requests state — **singleton** |
| `useEnquiries` | Conversations + messages — **singleton** |
| `useDraftListings` | Draft listing state — **singleton** |
| `useDashboardNavigation` | Computed nav items from aggregates — **singleton** |
| `useDashboardRecentItems` | Recent favourites/notes for homepage — **singleton** |
| `useDashboardListFilter` | Sort/filter/search logic for any list page |

All singletons use `createSharedComposable` from `@vueuse/core`.

---

## Viewings Feature

A fully bi-directional negotiation system that lets a **requester** (buyer/tenant) propose viewing times and the **owner** (seller/landlord) accept, decline, or reschedule them.

---

### Status Lifecycle

```
                    ┌──────────────────────────────────────┐
                    │                                      │
PENDING ──accept──► ACCEPTED ──cancel──► CANCELLED        │
  │                    │                                   │
  ├──reject──► REJECTED│                                   │
  │                    └──reschedule──► RESCHEDULED ───────┘
  │                                        │   ▲
  │                                 accept │   │ counter-propose
  │                                        ▼   │ (requester)
  │                                     ACCEPTED
  └──cancel──► CANCELLED
```

| Status | Meaning |
|---|---|
| `PENDING` | Requester sent dates/times; waiting for owner response |
| `ACCEPTED` | Owner confirmed a specific date + time |
| `REJECTED` | Owner declined |
| `RESCHEDULED` | Owner can't make the proposed dates; proposed their own time |
| `CANCELLED` | Either party cancelled |

---

### Status → UI

Defined in `app/utils/viewing.ts` (auto-imported):

```ts
VIEWING_STATUS_COLOR  // 'warning' | 'success' | 'error' | 'info'
VIEWING_STATUS_LABEL  // 'Pending' | 'Confirmed' | 'Declined' | 'Time proposed' | 'Cancelled'
```

---

### User Roles

Every viewing has two sides. The **role** (owner vs. requester) changes which buttons appear and which modals open.

| Party | Role field | Can do |
|---|---|---|
| Buyer / Tenant | `requester` | Create request, counter-propose, accept owner's time, cancel |
| Seller / Landlord | `owner` | Confirm time, decline, reschedule, cancel |

---

### Data Model

Defined in `shared/types/viewing.ts`:

```ts
interface ViewingWithDetails {
  id: number
  status: ViewingStatus               // Current negotiation state
  proposedDates: string[]             // ISO date strings (stored UTC noon)
  preferredTimes: string[]            // e.g. 'Mornings', 'Evenings', freeform text
  counterProposedAt: string | null    // Set when owner proposes a specific datetime
  notes: string | null
  requester: { id, username, avatar }
  owner: { id, username, avatar }
  listing: { id, price, property: { address, media } }
  conversationId: number | null       // Optional link to enquiry conversation
}
```

`counterProposedAt` is the **single confirmed datetime** — it is set by the owner either when accepting a time or when proposing a new one during rescheduling.

---

### The Two Negotiation Modals

This is the key conceptual split:

#### `OrganismsDashboardViewingRescheduleModal` — Owner's tool

Used by the **owner** in two modes, toggled via the `mode` prop:

| Mode | When triggered | What the owner does | API call |
|---|---|---|---|
| `accept` | PENDING — "Confirm time" button | Picks one date from the requester's suggested list + sets a time → confirms the viewing | `PATCH /api/viewing/{id}/respond` with `response: 'accept'` + `counterProposedAt` |
| `reschedule` | PENDING/ACCEPTED/RESCHEDULED — "Reschedule" button | Proposes entirely new dates/times because the existing ones don't work | `PATCH /api/viewing/{id}/respond` with `response: 'reschedule'` + `counterProposedAt` |

**Accept mode UX:** Calendar is restricted to the requester's proposed dates only (greys out everything else). Time quick-picks are derived from the requester's preferred times.

**Reschedule mode UX:** Free multi-date calendar + time multi-select — no restrictions.

#### `OrganismsDashboardViewingCounterProposeModal` — Requester's tool

Used by the **requester** when the owner has rescheduled (status = `RESCHEDULED`) and the owner's proposed time doesn't work for them either.

- Shows the owner's currently proposed time as context (in a success badge)
- Lets the requester pick a new set of dates/times to send back
- Submits via `PATCH /api/viewing/{id}/propose` → resets status to `PENDING`
- Also used when the requester wants to reschedule an already-`ACCEPTED` viewing

**The cycle:** Owner reschedules → requester counter-proposes → status returns to PENDING → owner confirms or reschedules again — until both agree (ACCEPTED) or someone cancels.

---

### Action Buttons by Status

`MoleculesDashboardViewingCardActions` renders the correct buttons based on `isOwner` + `status`:

**Owner actions:**

| Status | Buttons |
|---|---|
| `PENDING` | Confirm time (→ RescheduleModal accept mode) · Decline · Reschedule (→ RescheduleModal reschedule mode) |
| `ACCEPTED` | Reschedule · Cancel |
| `RESCHEDULED` | Reschedule · Cancel |

**Requester actions:**

| Status | Buttons |
|---|---|
| `PENDING` | Cancel |
| `RESCHEDULED` | Accept time · Suggest new times (→ CounterProposeModal) · Cancel |
| `ACCEPTED` | Reschedule (→ CounterProposeModal) · Cancel |

---

### API Endpoints

| Method | Path | Who calls it | What it does |
|---|---|---|---|
| `GET` | `/api/viewing` | Both | Fetch viewings (role/status/sort filters, 5 min cache) |
| `POST` | `/api/viewing/create` | Requester | Create new viewing request |
| `PATCH` | `/api/viewing/{id}/respond` | Owner | Accept / reject / reschedule |
| `PATCH` | `/api/viewing/{id}/propose` | Either | Propose new dates (owner → RESCHEDULED, requester → PENDING) |
| `DELETE` | `/api/viewing/{id}/cancel` | Either | Cancel viewing |

All mutation endpoints:
1. Bust viewings cache for **both** parties
2. Create a notification for the other party
3. Send real-time WebSocket push (if online) or email (if offline)
4. Send aggregate update to refresh sidebar badge counts

---

### Notification Types

Viewing-related `NotificationType` values (defined in `shared/types/notifications.ts`):

| Type | Sent to | Triggered by |
|---|---|---|
| `VIEWING_REQUEST` | Owner | New request created |
| `VIEWING_ACCEPTED` | Requester | Owner accepts |
| `VIEWING_REJECTED` | Requester | Owner declines |
| `VIEWING_RESCHEDULED` | Requester | Owner reschedules or proposes new time |
| `VIEWING_CANCELLED` | Other party | Either party cancels |

When any `VIEWING_*` WebSocket event arrives, the client triggers a **full re-fetch** of `fetchViewings()` + `fetchUserItemsAggregates()` (not an optimistic delta) — because multi-step status transitions make optimistic updates unreliable.

---

### Viewing Utilities (`app/utils/viewing.ts`)

Auto-imported across the app. No explicit imports needed.

| Export | Type | Purpose |
|---|---|---|
| `VIEWING_TIME_OPTIONS` | `string[]` | Mornings / Afternoons / Evenings / Any time / Other... |
| `TIME_RANGE_DEFAULTS` | `Record` | Maps preference label → `{ label, time }` for quick-pick buttons |
| `VIEWING_STATUS_COLOR` | `Record` | Maps `ViewingStatus` → Nuxt UI color name |
| `VIEWING_STATUS_LABEL` | `Record` | Maps `ViewingStatus` → display string |
| `formatProposedDate(iso)` | fn | `"Mon 23 Apr"` |
| `formatViewingDate(iso)` | fn | `"23 Apr 2026"` |
| `formatViewingDateTime(iso)` | fn | `"Mon 23 Apr 2026, 14:00"` |
| `getAllowedDateStrings(dates)` | fn | `Set<string>` of YYYY-MM-DD for UCalendar restrictions |
| `isViewingDateUnavailable(date, allowed)` | fn | Boolean — passed as `:is-date-unavailable` to UCalendar |
| `getTimeRangeButtons(preferredTimes)` | fn | Quick-pick button array derived from requester's preferences |
| `resolveFinalTimes(selected, otherTime)` | fn | Merges selected + freeform "Other..." into final times array |

Calendar export helpers live in `app/utils/viewing-calendar.ts`:
- `viewingGoogleCalendarUrl()` — Google Calendar deep link
- `viewingOutlookCalendarUrl()` — Outlook deep link
- `downloadViewingICS()` — Downloads `.ics` file

---

### Component Tree

```
OrganismsDashboardEnquiryViewingPopover
  └── MoleculesDashboardViewingPopoverRow       (per viewing)
  └── MoleculesDashboardViewingRequestForm      (new request form)
        └── MoleculesDashboardViewingAvailabilityForm

OrganismsDashboardViewingCard
  └── MoleculesDashboardViewingCardActions
        └── AtomsViewingCalendarMenu            (ACCEPTED only)

OrganismsDashboardViewingRescheduleModal        (owner)
  ├── MoleculesDashboardViewingContextPanel     (accept mode only)
  ├── MoleculesDashboardViewingAcceptForm       (accept mode)
  └── MoleculesDashboardViewingAvailabilityForm (reschedule mode)

OrganismsDashboardViewingCounterProposeModal    (requester)
  ├── MoleculesDashboardViewingContextPanel     (shows owner's proposed time)
  └── MoleculesDashboardViewingAvailabilityForm
```
