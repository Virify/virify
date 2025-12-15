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
1. Calls the `/auth/update-admin-password` endpoint
2. Authenticates using Cloudflare Service Token headers
3. Triggers the password hash update task

#### Cloudflare Access Protection

The endpoint is protected by **Cloudflare Access** with a **Service Auth** policy:

**Access Policy Configuration:**
- **Include**: Service Token named "railway" OR Team member emails
- **Action**: Service Auth (bypasses identity provider login for service tokens)

**Required Environment Variables:**
```bash
CF_SERVICE_TOKEN_ID=<client-id>.access
CF_SERVICE_TOKEN_SECRET=<client-secret>
```

**Security:**
- Cloudflare Access validates service token headers at the edge
- Application validates tokens again for defense in depth
- Only requests with valid tokens reach the endpoint
- Tokens are unguessable cryptographic values

**Creating Service Tokens:**
1. Go to Cloudflare Zero Trust → Access → Service Auth → Service Tokens
2. Create new token named "railway"
3. Copy Client ID and Client Secret (shown only once)
4. Add to Railway environment variables
5. Configure Access policy to include the service token with "Service Auth" action

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

# Cloudflare Service Token (for remote password updates)
CF_SERVICE_TOKEN_ID=<client-id>.access
CF_SERVICE_TOKEN_SECRET=<client-secret>

# OpenAI (for mortgage rates)
OPENAI_API_KEY=sk-...

# Railway detection
RAILWAY_ENVIRONMENT=staging|production
```

## Security Notes

- **Service Tokens**: Keep `CF_SERVICE_TOKEN_ID` and `CF_SERVICE_TOKEN_SECRET` secret
- **Never commit**: Service token values should only be in Railway environment variables
- **Admin Password**: The `ADMIN_PASSWORD` env var is automatically hashed by the server
- **Production Seeds**: Always use `db:setup:prod` for production - never seed demo data
- **Defense in Depth**: Both Cloudflare Access and application-level validation protect endpoints
