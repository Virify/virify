# Database Layer

## Overview
The database layer handles data persistence and access using Prisma ORM with PostgreSQL. It provides the database schema, migrations, API endpoints, and type-safe database operations for the Virify platform.

## Features
- 📊 PostgreSQL database with Prisma ORM
- 🔄 Automated database migrations
- 🌱 Seeding functionality with test data
- 🔍 Type-safe database queries
- 🔒 Secure database access patterns
- 🗃️ RESTful API endpoints for all entities
- 💬 Real-time messaging integration
- 🔗 WebSocket notification support

## Directory Structure
- `server/`: Server-side database operations and API endpoints
  - `api/`: RESTful API endpoints
    - `account/`: User account management
    - `conversation/`: Messaging functionality  
    - `listing/`: Property listings
    - `location/`: Location and address data
    - `note/`: Property notes
    - `property/`: Property management
  - `database/prisma/`: Prisma configuration
    - `schema.prisma`: Database schema
    - `migrations/`: Database migrations
    - `seed.ts`: Database seeding script
- `tests/`: Database integration tests

## Setup

### Prerequisites
- PostgreSQL
- Node.js
- pnpm (package manager)

### Database Configuration
1. Set up your database URL in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/virify"
```

2. Initialize the database:
```bash
# Generate Prisma client
pnpm pgen

# Run migrations
pnpm prisma migrate dev

# Seed the database
pnpm seed
```

## Available Scripts
- `pnpm pgen`: Generate Prisma client
- `pnpm db-push`: Push schema changes to database
- `pnpm seed`: Run database seeding
- `pnpm prisma migrate dev`: Create and apply migrations
- `pnpm prisma migrate deploy`: Apply existing migrations

## Database Schema
The schema includes models for:
- **Properties and listings**: Property details, media, status
- **User accounts**: Authentication, profiles, preferences
- **Messaging system**: Conversations and messages between users
- **Property notes and favorites**: User-specific property annotations
- **Location and address data**: Geographic and address information
- **Property media**: Images, documents, and attachments

## API Endpoints

### Account Management
- `GET    /api/account/` — Get user account details
- `PUT    /api/account/` — Update user account

### Conversations & Messaging
- `GET    /api/conversation/` — List user conversations
- `POST   /api/conversation/create/` — Create new conversation
- `POST   /api/conversation/reply/` — Send message reply
- `POST   /api/conversation/mark-read/` — Mark conversation as read
- `GET    /api/conversation/sent/` — List sent conversations

### Listings
- `GET    /api/listing/` — List/search property listings
- `POST   /api/listing/` — Create new listing
- `POST   /api/listing/create-bulk/` — Bulk create listings
- `POST   /api/listing/publish/` — Publish a listing
- `GET    /api/listing/[id]/` — Get specific listing by ID

### Properties
- `GET    /api/property/` — List user properties
- `POST   /api/property/` — Create new property
- `GET    /api/property/[id]/` — Get property by ID
- `PUT    /api/property/[id]/` — Update property by ID

### Draft Listings
- `POST   /api/draft-listings/create/` — Create draft listing
- `GET    /api/draft-listings/[id]/` — Get draft listing by ID
- `PATCH  /api/draft-listings/[id]/` — Update draft listing by ID

### Notes
- `GET    /api/note/` — Get property notes
- `POST   /api/note/` — Create property note
- `DELETE /api/note/[id]/` — Delete property note by ID

### Location & Address
- `GET    /api/location/search/` — Search locations
- `POST   /api/location/validate/` — Validate address
- `GET    /api/address/auto-complete/` — Address autocomplete

### Price & Price Paid
- `GET    /api/price/` — Get price data
- `GET    /api/price/graph/` — Get price graph data
- `POST   /api/price-paid/` — Submit price paid data
- `POST   /api/price-paid/[id]/` — Update price paid record by ID

### Property Type
- `GET    /api/property-type/` — List property types

### Media
- `POST   /api/media/` — Upload media

### Notifications
- `GET    /api/notifications/aggregates/` — Get notification aggregates

### Waiting List
- `POST   /api/waiting-list/` — Join waiting list
- `GET    /api/waiting-list/count/` — Get waiting list count

### User
- `DELETE /api/user/my-listings/[id]/` — Delete user listing by ID
- `POST   /api/user/my-listings/[id]/` — Update user listing by ID
- `PATCH  /api/user/locations/` — Update user locations

### Search
- `POST   /api/search/listings/` — Search listings (advanced)

---

> **Note:** Dynamic segments like `[id]` should be replaced with the actual resource ID. Some endpoints may require authentication or specific permissions.

## Best Practices
- Use transactions for related operations
- Keep migrations and schema changes versioned
- Follow the repository pattern for data access
- Maintain type safety with Prisma generated types
- Document schema changes in migration files
- Test database operations and API endpoints thoroughly
- Use appropriate indexes for query performance
- Handle database errors gracefully with proper HTTP status codes
- Integrate WebSocket notifications for real-time updates
- Validate input data before database operations
- Use server-side session validation for protected endpoints
