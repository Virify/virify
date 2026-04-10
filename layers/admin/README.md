# Admin Layer

## Overview

The admin layer provides a protected admin dashboard for platform management. It includes page-level analytics, user management, listing oversight, search intelligence, mortgage calculator usage analytics, and bulk CSV exports. All admin pages and API endpoints are protected behind an `isAdmin()` check.

## Directory Structure

```
layers/admin/
├── app/
│   ├── components/                     # Admin-specific UI components
│   ├── composables/
│   │   ├── useAdminNavigation.ts       # Sidebar menu items
│   │   └── useAdminExport.ts           # CSV export of all admin data
│   ├── layouts/
│   │   └── admin.vue                   # Admin shell layout with sidebar
│   ├── middleware/
│   │   └── admin.ts                    # Route guard — redirects non-admins to /dashboard
│   ├── pages/
│   │   └── admin/
│   │       ├── index.vue               # Overview — KPI summary cards
│   │       ├── users/                  # User analytics
│   │       ├── listings/               # Listing analytics
│   │       ├── search/                 # Search intelligence
│   │       ├── engagement/             # Traffic and session data
│   │       └── mortgage/               # Mortgage calculator usage
│   └── utils/
├── server/
│   └── api/
│       └── admin/
│           ├── overview/               # GET /api/admin/overview
│           ├── users/                  # GET /api/admin/users
│           ├── listings/               # GET /api/admin/listings
│           ├── search/                 # GET /api/admin/search
│           ├── engagement/             # GET /api/admin/engagement
│           ├── mortgage/               # GET /api/admin/mortgage
│           └── cache/                  # POST /api/admin/cache
└── tests/
```

## Pages

| Route | Description |
|-------|-------------|
| `/admin` | KPI overview — total users, listings, interactions |
| `/admin/users` | User growth and activity analytics |
| `/admin/listings` | Listing counts, status breakdown, recent activity |
| `/admin/search` | What users search for — trending locations, search terms |
| `/admin/engagement` | Traffic sources, session counts, device breakdown |
| `/admin/mortgage` | Mortgage calculator usage and input distributions |

## API Endpoints

All endpoints require `isAdmin(user)` to return `true`, otherwise a 403 is thrown.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/overview` | Platform KPIs: user counts, listing counts, interactions |
| `GET` | `/api/admin/users` | User analytics data |
| `GET` | `/api/admin/listings` | Listing analytics data |
| `GET` | `/api/admin/search` | Search intelligence: trending locations, query patterns |
| `GET` | `/api/admin/engagement` | Traffic, sessions, engagement metrics |
| `GET` | `/api/admin/mortgage` | Mortgage calculator usage metrics |
| `POST` | `/api/admin/cache` | Manual cache invalidation |

## Composables

### `useAdminNavigation()`

Returns the sidebar navigation menu items array. Each item has a label, route, and icon. Used by the admin layout to render the left sidebar.

### `useAdminExport()`

```ts
const { exportAll } = useAdminExport()
await exportAll()   // fires all admin API endpoints in parallel, formats results as CSV, triggers file download
```

Calling `exportAll()` fetches data from all admin endpoints concurrently, merges the results, and triggers a CSV file download in the browser. Used for periodic data dumps.

## Middleware

`admin.ts` — applied to all `/admin/**` routes via `definePageMeta({ middleware: ['admin'] })`. Checks `user.isAdmin` from the active session. Non-admin users are redirected to `/dashboard`.

## Access Control

```ts
// server/api/admin/overview/index.get.ts (pattern used in every admin endpoint)
const { user } = await useUserSession(event)
if (!user || !isAdmin(user)) throw createError({ statusCode: 403 })
```

`isAdmin()` is a shared utility that checks the user record's admin flag.
