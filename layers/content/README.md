# Content Layer

The **Content Layer** in Virify is responsible for managing and delivering all CMS-driven and structured content, such as property descriptions, static pages, and editorial content. It typically integrates with a headless CMS (e.g., Sanity) and provides APIs and utilities for accessing and rendering content throughout the application.

---

## 🚀 Features
- Centralized content management (properties, pages, guides, etc.)
- Real-time editing and preview (when using Sanity Studio)
- API endpoints for fetching content
- Utilities for rich text rendering and content blocks
- Extensible schema for new content types

---

## 🏗️ Directory Structure
- `schemas/` – Content schemas and types
- `server/` – API endpoints for content delivery
- `utils/` – Content utilities (e.g., rich text rendering)
- `tests/` – Content-related tests

---

## ⚙️ Setup

### Docker
- Content services (e.g., Sanity Studio) are started automatically with `make up`
- Access the CMS at the configured port (see [Sanity Layer](../sanity/README.md))

### Local
- Run the CMS locally (see [Sanity Layer](../sanity/README.md))
- Ensure environment variables for CMS API keys are set in `.env`

---

## 🧩 Extending Content
- Add new schemas in `schemas/`
- Create new API endpoints in `server/` for custom content needs
- Use provided utilities for rendering content in the UI

---

## 🏆 Best Practices
- Keep content schemas versioned and documented
- Use preview features for editorial workflows
- Validate content before publishing
- Test content rendering in the UI

---

## 🔗 Related Docs
- [Sanity Layer](../sanity/README.md)
- [UI Layer](../ui/README.md)
