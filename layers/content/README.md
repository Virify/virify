# Content Layer

## Overview

The content layer provides the pages and components for rendering CMS-driven static content. It is a thin presentation layer — the actual content data is authored in Sanity (see `layers/sanity/`) and fetched at runtime using `@nuxtjs/sanity`.

## Directory Structure

```
layers/content/
├── app/
│   ├── components/
│   │   ├── SanityContent.vue          # Portable-text renderer for Sanity rich text
│   │   ├── atoms/                     # Content-specific atoms (e.g., breadcrumbs)
│   │   └── molecules/                 # Content-specific molecules (e.g., guide cards)
│   └── pages/
│       ├── cookie/                    # /cookie-policy
│       ├── guides/                    # /guides and /guides/:slug
│       ├── privacy/                   # /privacy-policy
│       └── terms/                     # /terms
│       └── information/               # /information/:slug
└── nuxt.config.ts
```

## Pages

| Route | Description |
|-------|-------------|
| `/cookie-policy` | Cookie policy page — content from `cookieType` Sanity schema |
| `/guides` | Guides listing page — fetches all guides from `guideType` schema |
| `/guides/:slug` | Individual guide page — fetches single guide by slug |
| `/privacy-policy` | Privacy policy — content from `privacyType` Sanity schema |
| `/terms` | Terms and conditions — content from `termsType` Sanity schema |
| `/information/{slug}` | General Sanity Pages, Ads/annoucemeents etc — content from `TODO` Sanity schema |

## `SanityContent.vue`

The core component for rendering Sanity portable-text blocks. Used on every content page to render rich text with headings, paragraphs, links, and embedded content blocks authored in the Sanity Studio.

## Related

- [Sanity Layer](../sanity/README.md) — content authoring, schema definitions, and Sanity Studio
- Content is fetched using `useSanityQuery()` from `@nuxtjs/sanity` — no custom API endpoints in this layer
