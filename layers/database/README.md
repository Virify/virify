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
- `GET /api/account/` - Get user account details
- `PUT /api/account/` - Update user account

### Conversations & Messaging  
- `GET /api/conversation/` - List user conversations
- `POST /api/conversation/create/` - Create new conversation
- `POST /api/conversation/reply/` - Send message reply

### Property Listings
- `GET /api/listing/` - Search and filter listings
- `POST /api/listing/` - Create new listing
- `GET /api/listing/[id]/` - Get specific listing

### Property Management
- `GET /api/property/` - List user properties
- `POST /api/property/` - Create new property
- `PUT /api/property/[id]/` - Update property

### Property Notes
- `GET /api/note/` - Get property notes
- `POST /api/note/` - Create property note
- `DELETE /api/note/[id]/` - Delete property note

### Location Services
- `GET /api/location/search/` - Search locations
- `POST /api/location/validate/` - Validate address

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
