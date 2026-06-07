---
applyTo: "layers/*/server/api/**"
description: "Use when writing or reviewing server API endpoints in Virify. Covers authentication, validation, response format, and Prisma usage patterns."
---

# API Endpoint Conventions

## File Location

Server endpoints live in `layers/*/server/api/`. The path maps directly to the URL:

```
layers/database/server/api/listing/create.post.ts  → POST /api/listing/create
layers/dashboard/server/api/user/profile/index.get.ts → GET /api/user/profile
```

Use `.get.ts`, `.post.ts`, `.patch.ts`, `.delete.ts` suffixes for HTTP method routing.

## Standard Endpoint Pattern

```ts
export default defineEventHandler(async (event) => {
  // 1. Authenticate
  const { user } = await useUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  // 2. Validate body (for POST/PATCH)
  const body = await readValidatedBody(event, schema.parse)

  // 3. DB operation
  const result = await db.entity.findFirst({
    where: { userId: user.id, id: body.id }
  })

  // 4. Return data directly (Nuxt H3 auto-serializes)
  return result
})
```

## Authentication

**Always authenticate first** before any DB call:

```ts
const { user } = await useUserSession(event)
if (!user) throw createError({ statusCode: 401 })
```

For public endpoints (no auth required), skip `useUserSession` and document it:
```ts
// Public endpoint — no authentication required
export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  // ...
})
```

## Input Validation with Zod

```ts
import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().min(1).max(100),
  price: z.number().int().positive(),
  listingId: z.number().int().positive().optional(),
})

const body = await readValidatedBody(event, bodySchema.parse)
```

Use `.refine()` for cross-field validation:
```ts
const schema = bodySchema.refine(
  (data) => data.draftId !== undefined || data.listingId !== undefined,
  { message: 'Either draftId or listingId must be provided' }
)
```

## Response Format

Return data directly — H3 auto-serializes to JSON. For operations that return nothing:

```ts
return { success: true }
```

For errors, use `createError`:
```ts
throw createError({ statusCode: 404, message: 'Listing not found' })
throw createError({ statusCode: 403, message: 'Forbidden' })
```

## Database Access

Import the correct Prisma client for the database:

```ts
// Main database (listings, users, etc.)
import { db } from '~~/layers/database/server/database/prisma'

// Pre-paid database
import { ppdDb } from '~~/layers/database/server/database/prismaPpd'
```

Always scope queries to the authenticated user:
```ts
const listing = await db.listing.findFirst({
  where: { id: listingId, userId: user.id }  // ← always check ownership
})
if (!listing) throw createError({ statusCode: 404 })
```

## Route Parameters

```ts
// Dynamic route: server/api/listing/[id].get.ts
const id = parseInt(getRouterParam(event, 'id') ?? '0')
if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })
```

## Query Parameters

```ts
const query = getQuery(event)
const page = parseInt(query.page as string) || 1
const limit = Math.min(parseInt(query.limit as string) || 20, 100)
```

## Client-Side Fetching

Always use `useRequestFetch()` on the client — never raw `fetch` or `$fetch`:

```ts
// ✓ Correct
const data = await useRequestFetch()('/api/listing/create', {
  method: 'POST',
  body: { title: 'My Listing' }
})

// ✗ Wrong — loses auth headers on server-side
const data = await $fetch('/api/listing/create', { method: 'POST' })
```
