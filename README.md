# Virify

A modern property management and listing platform built with Nuxt 3, featuring an extensible layer-based architecture.

## 📋 Overview

Virify is a comprehensive property management system that allows users to:
- List and manage properties
- Search properties with interactive maps
- Save favorites and add notes
- Handle user authentication
- Send automated emails
- Process and display property media

## 🏗 Architecture

The application is built using a modular layer architecture for better separation of concerns and maintainability:

### Core Layers
- [Auth Layer](./layers/auth/README.md) - Authentication and authorization
- [Database Layer](./layers/database/README.md) - Prisma ORM and PostgreSQL integration
- [Email Layer](./layers/email/README.md) - Transactional emails with Vue Email and AWS SES
- [Map Layer](./layers/map/README.md) - MapTiler integration for property locations
- [UI Layer](./layers/ui/README.md) - Reusable component library and design system
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
│   └── plugins/         # Nuxt plugins
├── layers/              # Feature layers
│   ├── auth/           # Authentication layer
│   ├── database/       # Database layer
│   ├── email/          # Email functionality
│   ├── map/            # Map integration
│   └── ui/             # UI components
├── server/             # Server-side code
├── shared/             # Shared types and utilities
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

## 🔐 Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `MAPTILER_API_KEY` - MapTiler API key
- `AWS_ACCESS_KEY_ID` - AWS access key for SES
- `AWS_SECRET_ACCESS_KEY` - AWS secret for SES
- `AWS_REGION` - AWS region for SES
- `SESSION_SECRET` - Secret for session management

## 🤝 Contributing

1. Ensure you have the required dependencies installed
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

## 📜 License

Proprietary - All rights reserved
