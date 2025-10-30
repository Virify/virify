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

## 🔑 Environment Variables

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
