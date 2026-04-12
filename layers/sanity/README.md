# Sanity Layer (Content Studio)

## Overview

The Sanity layer is a standalone [Sanity Studio v3](https://www.sanity.io/) installation for Virify's content authoring. It runs as a separate process (port 3333), separate from the Nuxt app (port 3000), and connects to a shared hosted Sanity dataset.

Content is consumed by the Nuxt app and the content layer via `@nuxtjs/sanity` using `useSanityQuery()`.

## Setup

### Docker
```bash
make up   # starts the Sanity Studio container automatically at port 3333
```

### Local
```bash
cd layers/sanity
pnpm install
pnpm run dev    # http://localhost:3333
```

## Configuration

| Value | Detail |
|-------|--------|
| Project ID | `zl7h47m2` |
| Dataset | `production` |
| Studio port | `3333` |
| Preview origin | `http://localhost:3000` (dev) / `https://preview.virify.co.uk` (staging) |

## Schema Types

| File | Document type | Purpose |
|------|---------------|---------|
| `guideType.ts` | `guide` | Property guides with slug, body, category |
| `guideCategory.ts` | `guideCategory` | Guide category taxonomy |
| `cookieType.ts` | `cookiePage` | Cookie policy page content |
| `termsType.ts` | `termsPage` | Terms & conditions page content |
| `privacyType.ts` | `privacyPage` | Privacy policy page content |
| `contactPageType.ts` | `contactPage` | Contact page configuration |
| `supportPageType.ts` | `supportPage` | Support page content |
| `waitingListPageType.ts` | `waitingListPage` | Waiting list landing page |
| `faqType.ts` | `faq` | FAQ entries with question and portable-text answer |
| `featureSectionType.ts` | `featureSection` | Homepage/marketing feature blocks |
| `iconType.ts` | `icon` | Reusable icon references |
| `index.ts` | — | Exports all schema types |
| `templates/faqTemplates.ts` | — | Sanity document templates for FAQ ordering |

## Plugins

| Plugin | Purpose |
|--------|---------|
| `structureTool` | Document list sidebar |
| `presentationTool` | Visual live-preview editing connected to Nuxt app |
| `visionTool` | GROQ query explorer |

## Preview Mode

The presentation tool enables visual editing:
- **Preview URL**: configured via `SANITY_STUDIO_PREVIEW_URL` env var (defaults to `http://localhost:3000`)
- **Enable endpoint**: `GET /api/preview/enable` (Nuxt server route)
- **Disable endpoint**: `GET /api/preview/disable`
- Allowed origins: `http://localhost:3000`, `https://preview.virify.co.uk`

## Environment Variables

```bash
# In Nuxt app (.env)
SANITY_PROJECT_ID=zl7h47m2
SANITY_DATASET=production
SANITY_API_TOKEN=...          # write token for mutations (optional)
SANITY_PREVIEW=true           # enables draft mode / visual editing

# In Sanity Studio (layers/sanity/.env)
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

## Related

- [Content Layer](../content/README.md) — pages that render Sanity content via `SanityContent.vue`

---

## 🏗️ What is Sanity?

Sanity Studio is an open-source, customizable content platform. In Virify, it is used for:
- Managing property and listing content
- Editing CMS pages and static content
- Providing a real-time collaborative editing experience

---

## 🚀 Setup

### Docker
- The Sanity Studio runs as a separate service in Docker Compose (`make up` starts it automatically)
- Access the studio at [http://localhost:3333](http://localhost:3333) (or configured port)

### Local
- Navigate to `layers/sanity/` and run:
	```bash
	pnpm install
	pnpm run dev
	```
- Access at [http://localhost:3333](http://localhost:3333)

---

## 🧩 Customization & Plugins
- Extend schemas in `layers/sanity/schemas/`
- Add plugins or custom input components as needed
- See [Sanity plugin docs](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

---

## 🔗 Further Reading
- [Sanity Getting Started](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Sanity Community](https://www.sanity.io/community/join?utm_source=readme)
