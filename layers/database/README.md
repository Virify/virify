# Database Layer

## Overview
The database layer handles data persistence and access using Prisma ORM with PostgreSQL. It provides the database schema, migrations, and type-safe database operations for the Virify platform.

## Features
- 📊 PostgreSQL database with Prisma ORM
- 🔄 Automated database migrations
- 🌱 Seeding functionality with test data
- 🔍 Type-safe database queries
- 🔒 Secure database access patterns

## Directory Structure
- `server/`: Server-side database operations
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
- Properties and listings
- User accounts and authentication
- Property notes and favorites
- Location and address data
- Property media and attachments

## Best Practices
- Use transactions for related operations
- Keep migrations and schema changes versioned
- Follow the repository pattern
- Maintain type safety with Prisma
- Document schema changes
- Test database operations thoroughly
- Use appropriate indexes for performance
- Handle database errors gracefully
