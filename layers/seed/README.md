
# Seed Layer

The **Seed Layer** is responsible for populating the database with initial and test data. It is essential for onboarding, development, and testing. This layer uses Nitro tasks for fast, modular, and repeatable seeding.

---

## 🚦 When to Use

- **First-time setup**: Populate your local/dev database with sample data
- **Testing**: Reset and seed the database before running tests
- **Development**: Quickly generate realistic data for new features

---

## 🐳 Docker Usage

If running the project with Docker, the seed script is run automatically as part of the `make up` process (see root README). To manually reseed:

```bash
make exec
pnpm seed
```

---

## 💻 Local Usage

If running locally (not in Docker):

1. Ensure your database is running and `DATABASE_URL` is set in `.env`
2. Run:
	```bash
	pnpm seed
	```

---

## 🛠 How It Works

- The seeding logic lives in `layers/seed/server/` (see code for details)
- Uses [Prisma](https://www.prisma.io/) for type-safe DB access
- Modular: Add or update seeders for new models as needed

---

## 🧩 Customizing Seed Data

- Edit or add files in `layers/seed/server/` to change what data is seeded
- Use environment variables to control seed behavior (e.g., number of users, listings, etc.)
- For large datasets, consider using factories or Faker.js

---

## 🧹 Resetting the Database

To drop and recreate the database (dangerous, will erase all data!):

```bash
pnpm prisma migrate reset
pnpm seed
```

---

## 🏆 Best Practices

- Keep seed data realistic but minimal
- Use factories for randomization
- Document any required relationships (e.g., users must exist before listings)
- Reseed before running integration tests
- Never run seed scripts against production databases

---

## 🔗 Related Docs

- [Database Layer](../database/README.md)
- [Prisma Seeding Docs](https://www.prisma.io/docs/guides/database/seed-database)
