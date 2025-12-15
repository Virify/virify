# Seed Layer

This layer handles database seeding, migrations, and scheduled tasks.

## Scripts (Standalone)

Run these directly via pnpm - they work without the Nuxt server:

```bash
pnpm db:seed        # Seed database with initial data
pnpm db:reset       # Reset database (⚠️ destructive - drops all data)
pnpm db:migrate     # Run pending migrations (prisma migrate deploy)
pnpm fetch-rates    # Fetch latest mortgage rates from OpenAI
```

## Nitro Tasks (Scheduled)

These run inside the Nitro server context:

- `mortgage:fetch-rates` - Cron task to fetch mortgage rates monthly

## Railway Pre-Deploy

The `railway.toml` configures pre-deploy commands. By default, migrations run on every deploy:

```toml
preDeployCommand = "pnpm migrate-deploy"
```

## Triggering Tasks on Deploy

Add task directives to your commit message to run additional tasks during Railway pre-deploy:

### Staging (branches other than main)

```bash
git commit -m "feat: new feature [task: seed]"
git commit -m "fix: schema change [task: reset, seed]"
git commit -m "chore: update rates [task: fetch-rates]"
```

### Production (main branch)

Requires explicit `task:prod:` prefix for safety:

```bash
git commit -m "feat: release [task:prod: seed]"
```

### Available Tasks

| Task | Command | Description |
|------|---------|-------------|
| `seed` | `pnpm db:seed` | Seed database with initial data |
| `reset` | `pnpm db:reset` | Reset database (⚠️ destructive) |
| `fetch-rates` | `pnpm fetch-rates` | Fetch mortgage rates |

## How It Works

1. Push to `staging` or `main`
2. GitHub Action (`.github/workflows/run-db-task.yml`) parses commit for `[task: ...]`
3. Updates `railway.toml` with the additional pre-deploy commands
4. Railway runs the pre-deploy command before starting the app

## File Structure

```
layers/seed/
├── scripts/                    # Standalone CLI scripts
│   ├── seed.ts                # Database seeding
│   ├── reset.ts               # Database reset
│   ├── migrate.ts             # Run migrations
│   └── fetch-rates.ts         # Fetch mortgage rates
├── server/
│   ├── tasks/
│   │   └── mortgage/
│   │       └── fetch-rates.ts # Nitro cron task
│   └── utils/                 # Seed utilities (fakers, etc.)
└── nuxt.config.ts
```
