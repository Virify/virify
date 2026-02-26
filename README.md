# Virify

A modern property management and listing platform built with Nuxt 3, featuring an extensible layer-based architecture and real-time messaging capabilities.

## 📋 Overview

Virify is a comprehensive property management system that allows users to:
- List and manage properties with detailed information
- Search properties with interactive maps and advanced filtering
- Save favorites and add personal notes
- Real-time messaging between users
- Secure user authentication and authorization
- Send automated transactional emails
- Process and display property media with analytics

## 🏗 Architecture

The application is built using a modular layer architecture for better separation of concerns and maintainability:

### Core Layers
- [Auth Layer](./layers/auth/README.md) - Authentication and authorization
- [Database Layer](./layers/database/README.md) - Prisma ORM and PostgreSQL integration
- [Email Layer](./layers/email/README.md) - Transactional emails with Vue Email and AWS SES
- [Map Layer](./layers/map/README.md) - MapTiler integration for property locations
- [UI Layer](./layers/ui/README.md) - Reusable component library and design system
- [WebSocket Layer](./layers/websocket/README.md) - Real-time messaging and notifications
- [Analytics Layer](./layers/analytics/README.md) - User behavior tracking and insights
## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- pnpm
- Docker (optional)

### Quick Start with Docker

1. Create and configure your `.env` file:
```bash
cp .env.example .env
```

2. Start the application:
```bash
make up
```

3. Access the container shell:
```bash
make exec
```

### Manual Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up your database:
```bash
# Generate Prisma client
pnpm pgen

# Run migrations
pnpm prisma migrate dev

# Seed the database
pnpm seed
```

3. Start the development server:
```bash
pnpm dev
```

## 🛠 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm test:full` - Run all tests including E2E
- `pnpm pgen` - Generate Prisma client
- `pnpm db-push` - Push database changes
- `pnpm seed` - Seed the database

### Docker Commands

- `make up` - Start containers
- `make down` - Stop containers
- `make exec` - Enter app container
- `make exec-db` - Enter database container

## 📁 Project Structure

```
├── app/                  # Main application code
│   ├── components/       # Vue components (atoms, molecules, organisms)
│   ├── composables/      # Vue composables
│   ├── pages/           # Page components
│   ├── middleware/      # Route middleware
│   ├── layouts/         # Page layouts
│   └── utils/           # Utility functions
├── layers/              # Feature layers
│   ├── analytics/      # Analytics and tracking
│   ├── auth/           # Authentication layer
│   ├── database/       # Database layer
│   ├── email/          # Email functionality
│   ├── map/            # Map integration
│   ├── ui/             # UI components
│   └── websocket/      # Real-time messaging
├── shared/             # Shared types and utilities
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Shared utility functions
└── public/             # Static assets
```

## 🧪 Testing

Run tests using:
```bash
# Unit tests
pnpm test

# Full test suite including E2E
pnpm test:full
```

## 📚 Documentation

Each layer contains its own documentation:
- [Auth Layer Documentation](./layers/auth/README.md)
- [Database Layer Documentation](./layers/database/README.md) 
- [Email Layer Documentation](./layers/email/README.md)
- [Map Layer Documentation](./layers/map/README.md)
- [UI Layer Documentation](./layers/ui/README.md)
- [WebSocket Layer Documentation](./layers/websocket/README.md)
- [Analytics Layer Documentation](./layers/analytics/README.md)

## 🔐 Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `MAPTILER_API_KEY` - MapTiler API key for maps

# Virify

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

1. Checking if `DEPLOYMENT_ENV === 'waiting-list'`
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
