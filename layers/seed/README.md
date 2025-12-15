# Seed Layer

This layer handles database seeding, migrations, and setup automation for Virify.

## Quick Commands

### Local Development

```bash
# Complete setup (reset → seed → update password → fetch rates)
pnpm db:setup         # Full setup with demo data (staging/dev)
pnpm db:setup:prod    # Production setup (minimal seed only)

# Individual operations
pnpm db:reset         # Reset database (⚠️ destructive - drops all data)
pnpm db:seed:base     # Minimal seed (admin + property types)
pnpm db:seed:full     # Full seed (base + demo properties, listings, users)
pnpm db:migrate       # Run pending migrations (prisma migrate deploy)
pnpm db:fetch-rates   # Fetch latest mortgage rates from OpenAI
```

### Railway Deployment

```bash
# Connect to Railway environment
railway link

# Run commands on Railway servers
railway run pnpm db:setup        # Staging/preview environments
railway run pnpm db:setup:prod   # Production environment
```

## Database Setup Flow

### `pnpm db:setup` (Staging/Development)

Runs the following in sequence:
1. **Reset** - Drops all tables and recreates schema
2. **Seed (Full)** - Inserts:
   - Admin user (plain text password)
   - Property types
   - Demo properties with listings
   - Fake users for testing
3. **Update Admin Password** - Hashes the admin password via Nitro plugin
4. **Fetch Rates** - Retrieves current mortgage rates

### `pnpm db:setup:prod` (Production)

Production-safe setup:
1. **Reset** - Drops all tables and recreates schema
2. **Seed (Base)** - Minimal data only:
   - Admin user (plain text password)
   - Property types
3. **Update Admin Password** - Hashes the admin password
4. **Fetch Rates** - Retrieves current mortgage rates

> **Note:** Production seed does NOT include demo data or fake users.

## Admin Password Management

### Why Two Steps?

Admin passwords are seeded in **plain text** and then hashed on server startup:

1. **Seeding**: Creates admin user with `ADMIN_PASSWORD` from env (plain text)
2. **Hashing**: Nitro plugin hashes password using `nuxt-auth-utils` on server start

This separation is necessary because:
- Standalone seed scripts run outside Nuxt runtime (can't access `hashPassword`)
- The hashing utility requires Nuxt context
- Password can be updated without re-seeding entire database

### Local Password Updates

The admin password is automatically hashed when the Nuxt server starts via the `update-admin-password` plugin.

### Remote Password Updates (Railway)

For updating passwords on deployed environments without restarting:

```bash
# Update admin password remotely
pnpm db:update-admin-password
```

This script:
1. Calls the `/auth/update-admin-password?taskSecret=<secret>` endpoint
2. Authenticates using `TASK_SECRET` query parameter
3. Includes Cloudflare Service Token headers (for staging environments with CF Access)
4. Triggers the password hash update task

#### Authentication & Security

The endpoint uses **multi-layer authentication**:

**Primary Authentication (All Environments):**
- **TASK_SECRET** query parameter validates the request
- Required for both production and staging
- Application-level security that works everywhere

**Secondary Authentication (Staging Only):**
- **Cloudflare Access** with Service Auth policy
- Validates service token headers at the edge before reaching the app
- Additional protection layer for staging environment

**Required Environment Variables:**
```bash
# Required for all environments
TASK_SECRET=<random-secret-string>

# Required for staging (Cloudflare Access protected)
CF_SERVICE_TOKEN_ID=<client-id>.access
CF_SERVICE_TOKEN_SECRET=<client-secret>
```

**Security:**
- `TASK_SECRET` must be kept secret (only in Railway env vars)
- Cloudflare Access provides edge-level protection on staging
- Service tokens validated at edge and stripped before reaching app
- Defense in depth: Both query param and CF Access on staging

**Cloudflare Service Token Setup (Staging Only):**
1. Go to Cloudflare Zero Trust → Access → Service Auth → Service Tokens
2. Create new token named "railway"
3. Copy Client ID and Client Secret (shown only once)
4. Add to Railway staging environment variables
5. Configure Access policy:
   - **Include**: Service Token "railway" OR Team member emails
   - **Action**: Service Auth (bypasses identity provider for tokens)

## Railway Pre-Deploy

Migrations run automatically on every Railway deploy via `railway.toml`:

```toml
preDeployCommand = "pnpm migrate-deploy"
```

## File Structure

```
layers/seed/
├── server/
│   ├── plugins/
│   │   └── update-admin-password.ts    # Nitro plugin (hashes password on start)
│   ├── routes/
│   │   └── auth/
│   │       └── update-admin-password.get.ts  # API endpoint for remote updates
│   ├── tasks/
│   │   └── mortgage/
│   │       └── fetch-rates.ts          # Nitro cron task
│   └── utils/
│       ├── run-setup.ts                # Unified setup orchestrator
│       ├── run-reset.ts                # Database reset
│       ├── run-seed-base.ts            # Minimal production seed
│       ├── run-seed-full.ts            # Full staging/dev seed
│       ├── run-migrate.ts              # Run migrations
│       ├── run-fetch-rates.ts          # Fetch mortgage rates
│       ├── run-admin-update.ts         # Remote password update script
│       ├── property-faker.ts           # Property generation utilities
│       ├── listing-faker.ts            # Listing generation utilities
│       ├── user-faker.ts               # User generation utilities
│       └── ...                         # Other seed utilities
└── nuxt.config.ts
```

## Environment Variables

Required for full functionality:

```bash
# Database
DATABASE_URL=postgresql://...

# Admin account
ADMIN_EMAIL=admin@virify.co.uk
ADMIN_PASSWORD=your-secure-password
ADMIN_USERNAME=Virify

# Task authentication (required for all environments)
TASK_SECRET=<random-secret-string>

# Cloudflare Service Token (required for staging with CF Access)
CF_SERVICE_TOKEN_ID=<client-id>.access
CF_SERVICE_TOKEN_SECRET=<client-secret>

# OpenAI (for mortgage rates)
OPENAI_API_KEY=sk-...

# Railway detection
RAILWAY_ENVIRONMENT=staging|production
```

## Security Notes

- **TASK_SECRET**: Keep this secret - required for all remote admin operations
- **Service Tokens**: Only needed for staging environments with Cloudflare Access
- **Never commit**: All secrets should only be in Railway environment variables
- **Admin Password**: The `ADMIN_PASSWORD` env var is automatically hashed by the server
- **Production Seeds**: Always use `db:setup:prod` for production - never seed demo data
- **Defense in Depth**: Staging has both TASK_SECRET and Cloudflare Access protection
