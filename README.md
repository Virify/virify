# Virify

The UK's first open property marketplace. AI-powered property search and verified private listings, built with Nuxt 3.

## Overview

Virify is a full-stack property platform where private sellers/landlords can list properties directly, and buyers/tenants can search, enquire, arrange viewings, and manage everything from a personal dashboard.

**Key capabilities:**
- Private property listings (sale and rental) with a 10-step creation wizard
- AI-powered and map-based property search
- Real-time messaging between buyers and sellers
- Viewing request and negotiation system
- Saved searches, favourites, notes, hidden listings
- Transactional emails via AWS SES
- Analytics dashboard for listing performance
- Waiting list and pre-paid data (PPD) databases
- Sanity CMS for guides and editorial content
- Admin panel for platform management

---

## Architecture

Built with a **modular Nuxt layer system** — each feature area is a self-contained layer that extends the root config. Layers are applied in order in `nuxt.config.ts`:

```
cloudflare → ui → email → database → auth → map → analytics
         → websocket → seed → content → sanity → dashboard → admin
```

Each layer can contribute: pages, components, composables, server API endpoints, middleware, and runtime config.

| Layer | Purpose | README |
|---|---|---|
| `cloudflare` | Cloudflare Images, R2 storage, Turnstile CAPTCHA | [→](./layers/cloudflare/README.md) |
| `ui` | Design system, SCSS, shared components | [→](./layers/ui/README.md) |
| `email` | Vue Email templates + AWS SES delivery | [→](./layers/email/README.md) |
| `database` | Prisma ORM, 3 PostgreSQL databases, all API endpoints | [→](./layers/database/README.md) |
| `auth` | Login, signup, OTP, password reset, sessions | [→](./layers/auth/README.md) |
| `map` | MapTiler SDK, markers, polygon drawing, geocoding | [→](./layers/map/README.md) |
| `analytics` | Listing view tracking, engagement metrics | [→](./layers/analytics/README.md) |
| `websocket` | Real-time messaging and event broadcasting | [→](./layers/websocket/README.md) |
| `seed` | DB migrations, seeding, admin password management | [→](./layers/seed/README.md) |
| `content` | Static content delivery (guides, pages) | [→](./layers/content/README.md) |
| `sanity` | Sanity CMS integration for editorial content | [→](./layers/sanity/README.md) |
| `dashboard` | Authenticated user dashboard (all features) | [→](./layers/dashboard/README.md) |
| `admin` | Platform admin panel | [→](./layers/admin/README.md) |
| `notifications` | Notification types, preferences, in-app alerts | [→](./layers/notifications/README.md) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL (or Docker)

### Quick start with Docker

```bash
cp .env.example .env   # configure env vars
make up                # builds and starts app + PostgreSQL containers
make exec              # enter the app container shell
pnpm db:setup          # run migrations + seed demo data
```

### Manual setup

#### Install PostgreSQL with PostGIS (macOS via Homebrew)

The main database runs locally. PPD and waiting list point directly to their production instances — just set `PPD_DATABASE_URL` and `WAITING_LIST_DATABASE_URL` in `.env` to the remote connection strings and generate the clients.

```bash
brew install postgresql@17
brew install postgis

# postgresql@17 is keg-only — add it to your PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Start PostgreSQL service
brew services start postgresql@17

# Create a PostgreSQL user with a password (replace values as needed)
psql -c "CREATE USER yourname WITH PASSWORD 'yourpassword';"
psql -c "ALTER USER yourname CREATEDB;"

# Create and configure the main database
createdb -U yourname virify
psql -U yourname -d virify -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

Then set your `DATABASE_URL` in `.env` using that username and password:

```
DATABASE_URL="postgresql://yourname:yourpassword@localhost:5432/virify"
```

#### Install dependencies and run

```bash
pnpm install

# Generate all Prisma clients (main + ppd + waiting-list)
pnpm pgen
pnpm pgen:ppd
pnpm pgen:waiting-list

# Run migrations
pnpm db:migrate-dev

# Seed the database (demo data)
pnpm db:setup

# Start dev server
pnpm dev
```

---

## Database

Virify uses **three separate PostgreSQL databases**, each with its own Prisma schema and generated client:

| Database | Script prefix | Purpose |
|---|---|---|
| Main (`prisma/`) | `pgen`, `db:migrate-dev`, `db-studio` | All platform data (users, listings, viewings, enquiries, etc.) |
| Pre-paid data (`prisma-ppd/`) | `pgen:ppd`, `db:migrate-dev:ppd`, `db-studio:ppd` | UK Land Registry price-paid property records |
| Waiting list (`prisma-waiting-list/`) | `pgen:waiting-list`, `migrate-dev:waiting-list`, `db-studio:waiting-list` | Waiting list signups |

**After any schema change**, regenerate the relevant Prisma client before running the app.

---

## Scripts Reference

### Prisma / Database

```bash
pnpm pgen                    # Generate main Prisma client
pnpm pgen:ppd                # Generate pre-paid data Prisma client
pnpm pgen:waiting-list       # Generate waiting-list Prisma client

pnpm db:migrate-dev          # Create + apply migration (main DB, dev)
pnpm db:migrate-dev:ppd      # Create + apply migration (ppd DB, dev)
pnpm migrate-dev:waiting-list # Create + apply migration (waiting-list DB, dev)

pnpm db:migrate-deploy       # Apply existing migrations (main DB, production)

pnpm db-studio               # Open Prisma Studio for main DB
pnpm db-studio:ppd           # Open Prisma Studio for ppd DB
pnpm db-studio:waiting-list  # Open Prisma Studio for waiting-list DB

pnpm db-push                 # Push schema to main DB (no migration file)
pnpm db-push:ppd             # Push schema to ppd DB (no migration file)

pnpm prisma-format           # Format main schema.prisma
pnpm prisma-validate         # Validate main schema.prisma
```

### Seeding & Setup

```bash
pnpm db:setup                # Full local setup: reset → full seed → hash admin password → fetch rates
pnpm db:setup:prod           # Production setup: reset → base seed → hash admin password → fetch rates
pnpm db:reset                # Drop all data and recreate schema (destructive)
pnpm db:seed:base            # Minimal seed: admin user + property types only
pnpm db:seed:full            # Full seed: base + demo properties, listings, fake users
pnpm db:migrate              # Run pending migrations (prisma migrate deploy)
pnpm db:fetch-rates          # Fetch latest mortgage rates via OpenAI
pnpm db:update-admin-password # Hash + update admin password on a remote instance
pnpm redis:flush             # Flush Redis/Nitro storage cache
```

### PPD (Pre-paid Data) Seeding

```bash
pnpm seed:address            # Extract and geocode addresses from PPD source
pnpm seed:upload-images      # Upload seed images to Cloudflare
pnpm seed:remove-images      # Remove seed images from Cloudflare
```

### Build & Dev

```bash
pnpm dev                     # Start Nuxt dev server (http://localhost:3000)
pnpm build                   # Build for production (generates all 3 Prisma clients first)
pnpm preview                 # Preview production build
pnpm start                   # Start compiled server (.output/server/index.mjs)
pnpm test                    # Run unit tests (Vitest)
```

### Docker (via Makefile)

```bash
make up                      # Build and start all containers
make down                    # Stop and remove containers
make start                   # Start existing containers
make stop                    # Stop containers
make exec                    # Shell into the webapp container
make exec-db                 # Shell into the database container
```

---

## Project Structure

```
├── app/                         # Root application code
│   ├── components/              # Global components (atoms, molecules, organisms)
│   ├── composables/             # Global composables (search, navigation, auth, etc.)
│   ├── layouts/                 # Page layouts (default)
│   ├── middleware/              # Route middleware (authenticated, draft-owner, etc.)
│   ├── pages/                   # Public-facing pages
│   │   ├── index.vue            # Homepage
│   │   ├── search/              # Property search
│   │   ├── listing/             # Individual listing pages
│   │   ├── price-paid/          # UK Land Registry data browser
│   │   ├── mortgage-calculator/ # Mortgage calculator tool
│   │   └── contact/ support/    # Static/support pages
│   ├── tests/                   # App-level unit tests
│   └── utils/                   # Auto-imported utilities (viewing, mortgage, etc.)
├── layers/                      # Feature layers (see table above)
├── server/                      # Root server middleware and plugins
├── shared/                      # Shared across app + server
│   ├── types/                   # TypeScript types (viewing, notifications, etc.)
│   └── utils/                   # Pure utility functions (auto-imported)
├── public/                      # Static assets
├── docs/                        # Architecture diagrams
├── nuxt.config.ts               # Root Nuxt config (layer order, modules, SEO, security)
├── vitest.config.ts             # Vitest config (jsdom environment)
├── docker-compose.yml           # Docker services
└── Makefile                     # Docker convenience commands
```

---

## Testing

Tests use **Vitest** with jsdom environment.

```bash
pnpm test           # Run all unit tests
```

- App-level tests: `app/tests/`
- Layer tests: `layers/*/tests/` and `layers/dashboard/tests/`
- Shared utils tests: `shared/tests/`
- Setup file: `tests/setup/nuxt.ts`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Main PostgreSQL connection string |
| `PPD_DATABASE_URL` | ✅ | Pre-paid data PostgreSQL connection string |
| `WAITING_LIST_DATABASE_URL` | ✅ | Waiting list PostgreSQL connection string |
| `ADMIN_EMAIL` | ✅ | Admin account email |
| `ADMIN_PASSWORD` | ✅ | Admin initial password (plain text, hashed on startup) |
| `ADMIN_USERNAME` | ✅ | Admin account username |
| `MAPTILER_API_KEY` | ✅ | MapTiler API key |
| `OPENAI_API_KEY` | ✅ | OpenAI API key (AI search + mortgage rates) |
| `SES_ACCESS_KEY_ID` | ✅ | AWS SES access key |
| `SES_SECRET_ACCESS_KEY` | ✅ | AWS SES secret key |
| `EMAIL_BASE_URL` | ✅ | Base URL used in email links |
| `INTERNAL_EMAIL` | ✅ | Internal notification recipient address |
| `CF_IMAGES_API_KEY` | ✅ | Cloudflare Images API key |
| `CF_ACCOUNT_ID` | ✅ | Cloudflare account ID |
| `CF_ACCOUNT_HASH` | ✅ | Cloudflare Images delivery hash |
| `CF_SITE_KEY` | ✅ | Cloudflare Turnstile site key (public) |
| `CF_SECRET_KEY` | ✅ | Cloudflare Turnstile secret key |
| `CF_R2_TOKEN` | ✅ | Cloudflare R2 API token |
| `CF_R2_BUCKET` | ✅ | Cloudflare R2 bucket name |
| `CF_R2_URL` | ✅ | Cloudflare R2 public base URL |
| `CF_ACCESS_KEY` | ✅ | Cloudflare R2 S3-compatible access key |
| `CF_SECRET_ACCESS_KEY` | ✅ | Cloudflare R2 S3-compatible secret key |
| `TASK_SECRET` | ✅ | Secret for scheduled/admin task endpoints |
| `DEPLOYMENT_ENV` | ✅ | `development` / `staging` / `production` / `waiting-list` |
| `SANITY_PROJECT_ID` | ✅ | Sanity project ID |
| `SANITY_DATASET` | ✅ | Sanity dataset name |
| `SANITY_API_VERSION` | ✅ | Sanity API version |

---

## Deployment

The app is deployed via **Railway**. Key commands:

```bash
railway link                         # Connect local CLI to Railway project
railway run pnpm db:setup            # Run setup on staging/preview environment
railway run pnpm db:setup:prod       # Run setup on production environment
railway run pnpm db:update-admin-password  # Update admin password remotely
```

Build command: `pnpm build` — this generates all three Prisma clients before the Nuxt build.

---

## Documentation

Detailed architecture docs live in each layer:

- [Dashboard layer](./layers/dashboard/README.md) — caching, WebSocket, viewings, chat, listing creation
- [Database layer](./layers/database/README.md) — schema, API endpoints, cache utilities
- [Seed layer](./layers/seed/README.md) — seeding flows, PPD import, admin password management
- [Auth layer](./layers/auth/README.md) — login, signup, OTP, password reset
- [WebSocket layer](./layers/websocket/README.md) — real-time message types and routing
- [Email layer](./layers/email/README.md) — templates, AWS SES, preview tool
- [Cloudflare layer](./layers/cloudflare/README.md) — Images, R2, Turnstile
- [Map layer](./layers/map/README.md) — MapTiler, markers, polygon search
- [Analytics layer](./layers/analytics/README.md) — listing view tracking, engagement
- [Notifications layer](./layers/notifications/README.md) — notification types, preferences, badges
- [Admin layer](./layers/admin/README.md) — admin panel overview
- [UI layer](./layers/ui/README.md) — design system, SCSS, component library
- [Sanity layer](./layers/sanity/README.md) — CMS setup and schemas
- [Content layer](./layers/content/README.md) — content delivery

Virify is a modern property management and listing platform built with Nuxt 4, featuring a modular, extensible architecture and real-time capabilities. This guide will help you onboard as a contributor, whether you want to run the project locally or with Docker, and will explain the structure and nuances of each layer.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (preferred package manager)
- PostgreSQL (local or Docker)
- Docker & Docker Compose (optional, for containerized setup)

---

## 🐳 Docker Setup (Recommended)

1. Copy the example environment file:
	```bash
	cp .env.example .env
	```
2. Start all services (app, database, etc):
	```bash
	make up
	```
3. To access the app container shell:
	```bash
	make exec
	```
4. To access the database container shell:
	```bash
	make exec-db
	```
5. To stop all containers:
	```bash
	make down
	```

---

## 💻 Local Development Setup

1. Install dependencies:
	```bash
	pnpm install
	```
2. Set up your database (local or remote):
	- Update `DATABASE_URL` in your `.env` file.
	- Generate Prisma client:
	  ```bash
	  pnpm pgen
	  ```
	- Run migrations:
	  ```bash
	  pnpm db:reset
	  ```
	- Seed the database:
	  ```bash
	  pnpm db:seed
	  ```
3. Start the development server:
	```bash
	pnpm dev
	```

---

## 🏗️ Project Structure & Layers

Virify is organized into **feature layers** for clear separation of concerns. Each layer has its own README for details and setup nuances:

```
├── app/                  # Main Nuxt app (components, pages, composables, layouts, utils)
├── layers/               # Feature layers (see below)
│   ├── analytics/        # User analytics & tracking
│   ├── auth/             # Authentication & authorization
│   ├── database/         # Prisma ORM & PostgreSQL
│   ├── email/            # Transactional email (Vue Email, AWS SES)
│   ├── map/              # MapTiler integration & geospatial features
│   ├── notifications/    # User notification system
│   ├── sanity/           # Content management (Sanity Studio)
│   ├── seed/             # Database seeding utilities
│   ├── ui/               # Design system & component library
│   └── websocket/        # Real-time messaging & events
├── shared/               # Shared types & utilities
└── public/               # Static assets
```

**Layer Documentation:**
- [Analytics](./layers/analytics/README.md)
- [Auth](./layers/auth/README.md)
- [Database](./layers/database/README.md)
- [Email](./layers/email/README.md)
- [Map](./layers/map/README.md)
- [Notifications](./layers/notifications/README.md)
- [Sanity](./layers/sanity/README.md)
- [Seed](./layers/seed/README.md)
- [UI](./layers/ui/README.md)
- [WebSocket](./layers/websocket/README.md)

---

## ⚙️ Common Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production
- `pnpm preview` – Preview production build
- `pnpm test` – Run unit tests
- `pnpm test:full` – Run all tests (unit + E2E)
- `pnpm pgen` – Generate Prisma client
- `pnpm db-push` – Push schema changes to DB
- `pnpm seed` – Seed the database
- `make up` – Start Docker containers
- `make down` – Stop Docker containers
- `make exec` – Enter app container
- `make exec-db` – Enter database container

---

## 🧪 Testing

Run tests with:
```bash
pnpm test        # Unit tests
pnpm test:full   # Full suite (unit + E2E)
```

---

## � Waiting List Mode

Virify supports a **Waiting List Mode** for controlled rollout or maintenance periods. When enabled, the application restricts access to certain features while allowing existing users to continue using core functionality.

### Enabling Waiting List Mode

Set the environment variable:
```bash
DEPLOYMENT_ENV=waiting-list
```

### What's Blocked in Waiting List Mode

The following features are **completely disabled** when in waiting list mode:

- ❌ **New User Signups** (`/auth/signup`) - No new accounts can be created
- ❌ **Property Search** (`/api/search/`) - All search functionality is disabled (traditional and AI search)

### What's Allowed in Waiting List Mode

Existing users and specific functionality remain available:

#### Authentication & Account Management
- ✅ User login (`/auth/login`)
- ✅ OTP verification (`/auth/verify-otp`)
- ✅ Account settings and profile management

#### Property Management (Existing Users Only)
- ✅ Create and edit draft listings
- ✅ Publish listings
- ✅ View own listings and manage properties
- ✅ Upload and manage property images

#### Dashboard & Messaging
- ✅ Full dashboard access for authenticated users
- ✅ Conversations and messaging between users
- ✅ Notifications system
- ✅ User favorites and notes

#### Content & Data
- ✅ Sanity CMS content (guides, help articles)
- ✅ Price Paid data lookup
- ✅ Address lookup and validation
- ✅ Property type data

#### Other Allowed Features
- ✅ Contact form submissions
- ✅ Support requests
- ✅ Analytics tracking (for existing users)
- ✅ Waiting list signup form

### Route Configuration

Accessible routes in waiting list mode are configured in [`app/utils/waiting-list-config.ts`](./app/utils/waiting-list-config.ts):

```typescript
allowedRoutes: [
  '/',
  '/contact',
  '/terms',
  '/privacy',
  '/price-paid',
  '/guides/*',
  '/login',
  '/account/*',
  '/dashboard/*',
  // etc.
]
```

### API Middleware

The waiting list middleware ([`server/middleware/waiting-list.ts`](./server/middleware/waiting-list.ts)) enforces API restrictions by:

1. Checking if `useFeatureFlag().waitingList`
2. Blocking all API calls except those explicitly allowed
3. Returning 403 Forbidden for blocked endpoints

This ensures that even if users access blocked pages, the underlying API calls will fail securely.

---

## �🔑 Environment Variables

Set these in your `.env` file (see `.env.example` for all options):

- `DATABASE_URL` – PostgreSQL connection string
- `MAPTILER_API_KEY` – MapTiler API key
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` – AWS SES for email
- `SESSION_SECRET` – Session management secret
- `WS_BASE_URL` – WebSocket server URL
- `NUXT_SECRET_KEY` – Nuxt encryption key

---

## 🤝 Contributing

1. Fork and clone the repo
2. Create a feature branch
3. Make your changes (with tests)
4. Update documentation as needed
5. Open a pull request

---

## 📚 Further Reading

Each layer has its own README for setup, usage, and best practices. Start with the [layers/](./layers/) directory for details on:
- Local vs Docker nuances
- Integration points
- API endpoints
- Testing strategies
- Security considerations

---

## 📜 License

Proprietary – All rights reserved
