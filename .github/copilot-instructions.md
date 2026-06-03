# Virify AI Coding Assistant Instructions

## Architecture Overview

Virify is a Nuxt 3-based property management platform using a **modular layer architecture**. Each layer is a self-contained Nuxt extension that extends the root config in `nuxt.config.ts`. Layers include: `ui`, `email`, `database`, `auth`, `map`, `analytics`, `websocket`, `seed`, `content`, `sanity`, and `dashboard`.

**Key principle**: Changes to one layer should not break others. Prefer composable-based state sharing over prop-drilling.

## Safety Rules

⚠️ **NEVER run these commands**:
- Database commands (`pnpm db:migrate-dev`, `pnpm db:reset`, `pnpm pgen`, etc.) - User runs these manually
- Git operations (`git push`, `git merge`) - User controls version control

## Ticket Source & Delivery Workflow

- Use **Jira only** for ticket intake and status updates.
- Do **not** use Notion as a source of work items when Jira tickets are requested.
- Work only on tickets assigned to the requesting user.
- Respect explicit ticket scope from the user (e.g., exclude tickets they mark as out of scope).
- If the user sets a priority ticket (for example `VIRI-105`), complete that first.
- For each ticket: create a dedicated branch, implement and test changes, open a PR, and add a Jira ticket comment with the PR link/status.

## Critical Development Workflows

### Database Operations
- **Generate Prisma clients** (must run after schema changes): `pnpm pgen` (main), `pnpm pgen:ppd` (pre-paid), `pnpm pgen:waiting-list` (waiting list)
- **Run migrations**: `pnpm db:migrate-dev` (development), `pnpm db:migrate-deploy` (production)
- **Reset database** (dev only): `pnpm db:reset` and `pnpm db:setup`
- **View data**: `pnpm db-studio` opens Prisma Studio

⚠️ **Schema drift detection**: Migrations compare actual schema vs shadow DB. Always run `pnpm pgen` after updating `schema.prisma`.

### Build & Test
- **Type check**: `pnpm nuxi typecheck --no-telemetry`
- **Test**: `pnpm test` (unit tests via Vitest using jsdom)
- **Build**: `pnpm build` generates Prisma clients for all three databases, then builds Nuxt
- **Dev server**: `pnpm dev` (runs on http://localhost:3000)

### Docker
- `make up` - Start app + PostgreSQL containers
- `make exec` - Enter app shell
- `make exec-db` - Enter database shell

## Composable Patterns

**All major state uses `createSharedComposable` from `@vueuse/core`** to ensure singleton pattern across the app:

```ts
// ✓ Correct pattern (app/composables/useListingEdit.ts)
export const useListingEdit = createSharedComposable(() => {
  const deletingIds = ref(new Set<number>())
  const { data: draftListings } = useAsyncData(...)
  return { deletingIds, draftListings, ... }
})

// ✗ Avoid - allows multiple instances
export function useMyComposable() { ... }
```

**Data fetching uses `useAsyncData` with SSR-safe patterns**:
- Always provide a cache key as first param: `useAsyncData('unique-key', ...)`
- Use `immediate: true` for auto-fetch on mount
- Handle `status: 'pending' | 'success' | 'error'`

**Common patterns**:
- `useListingEdit()` - Draft & live listing state (with type guards `isDraftListing()`, `isLiveListing()`)
- `useDashboardRecentItems()` - Recent favourites/notes (data loading for dashboard)
- `useAnalytics()` - User interaction tracking (also orchestrates recent items refresh)
- Dialog composables: `useDialog()` for modal state, `useGlobalEnquiryModal()` for conversations

## Project-Specific Conventions

### Component Organization
**Atomic design pattern** in `app/components/`:
- `atoms/` - Individual inputs, buttons, cards (lowest level)
- `molecules/` - Combinations like input groups, cards with actions
- `organisms/` - Page sections like forms, hero sections, modals
- `views/` - Page-level components
- `EditListingSteps/` - Special multi-step form components

**Naming**: PascalCase with folder prefix (e.g., `atoms/AtomsButton.vue`, `organisms/OrganismsFormsSupport.vue`)

### Middleware
Routes use middleware for guarding:
- `authenticated` - Requires logged-in user, redirects to `/?showLogin=true`
- `draft-owner` - Requires draft ownership
- `email-test` - Email preview functionality
- `login` - For login page redirection
- `feature-flags.global` - Global feature flag route guard (blocks access to feature-flagged routes)

Usage: `definePageMeta({ middleware: ['authenticated'] })`

### API Endpoints
Server endpoints in `layers/*/server/api/` follow this pattern:
- Return structured responses: `{ success: boolean, data?: T, error?: string }`
- **Client-side authenticated requests**: Always use `useRequestFetch()` (never raw `$fetch` or `fetch`)
- **Server-side user verification**: Extract user from `const { user } = await useUserSession()` - always verify user exists before DB operations
- Database endpoints mirror entity structure: `/api/listing/...`, `/api/note/...`, `/api/conversation/...`

```ts
// ✓ Correct authenticated API pattern (client)
const data = await useRequestFetch()('/api/listing/create', { method: 'POST', body: {...} })

// ✓ Correct server endpoint pattern
export default defineEventHandler(async (event) => {
  const { user } = await useUserSession(event)
  if (!user) throw createError({ statusCode: 401 })
  // ... use user.id for DB queries
})
```

### Validation & Error Handling
- `useCheckValidity()` composable standardizes HTML5 form validation
- Error messages via `useToast()` which shows toast notifications
- Form states tracked in composables like `useListingStepForm()` with `buttonDisabled`, `buttonText`, `hasChanges`
- Type guards: `isDraftListing()`, `isLiveListing()`, `isObjectWithReturnValue()`

## Data Flow & Integration Points

### Listing Creation Workflow
1. User navigates to create listing (route guard via `authenticated` middleware)
2. `useListingEdit()` composable loads draft listings
3. Multi-step form uses `useListingEditor()` (wraps all 10 step components)
4. Each step:
   - Validates via step-specific validation composables
   - Stores step data in `useListingEdit.updateStepX()` 
   - Uses `useListingStepForm()` for reusable form logic (validation, dirty checking, submission)
5. Final submission calls `/api/listing/create` or updates via `/api/draft-listings/:id`

### Real-Time Messaging (WebSocket)
- `layers/websocket/` provides WebSocket connection management
- `layers/notifications/` handles notification display
- Composable: `useNotifications()` tracks last notification
- Global handler: `OrganismsGlobalNotificationHandler.vue` watches notifications, suppresses duplicates if user already viewing conversation

### Analytics & Dashboard
- `useAnalytics()` composable tracks events + orchestrates recent items refresh
- `useDashboardRecentItems()` (singleton) fetches recent favourites/notes
- `useDashboardNavigation()` (computed from aggregates) builds nav menu with badges

### Authentication Flow
- `useUserSession()` - Global auth state from `nuxt-auth-utils`
- Session expires trigger redirect via `authenticated` middleware
- Login/signup via dialogs from `useNavigation()` or direct routes `/login`, `/signup`

## External Dependencies & Services

- **Cloudflare Turnstile**: CAPTCHA via `useTurnstile()` composable
- **Cloudflare Images**: Image optimization (IDs are UUIDs, identified by regex `/^[0-9a-f]{8}-...$/i`)
- **Sanity CMS**: Content management via `@nuxtjs/sanity`, guides fetched in `useNavigation()`
- **MapTiler**: Maps via `@maptiler/sdk` (property location display)
- **AWS SES**: Email via `@aws-sdk/client-ses`
- **Prisma Postgres Adapter**: `@prisma/adapter-pg` for PostgreSQL

## Testing
- Framework: **Vitest** (configured in `vitest.config.ts`)
- Setup file: `tests/setup/nuxt.ts` with jsdom environment
- Composable tests: Use `vi.hoisted()` for mocks, mock composables before import
- Example: `tests/unit/composables/useListingStep.test.ts`

## Code Style
- Use **TypeScript** with strict mode (via `tsconfig.json`)
- Vue 3 Composition API with `<script setup>`
- Prettier for formatting (v3.7.4)
- Named exports for composables, default export for components
- Comments on non-obvious logic (e.g., "Clean up memory periodically")
- Avoid `any` - use proper type definitions from `layers/database/server/database/prisma/generated/client`
- **Never manually import utils or shared types** - Nuxt auto-imports from `app/utils/`, `shared/utils/`, `shared/types/`. Imports resolve on `pnpm dev` or `pnpm build`
- **Tailwind CSS only in `layers/dashboard/`** - Rest of project uses SCSS and leverages style utils

## Common Gotchas

1. **Three databases**: Main (`prisma/`), pre-paid (`prisma-ppd/`), waiting-list (`prisma-waiting-list/`). Commands like `pnpm db:migrate-dev:ppd` affect only that DB.
2. **SSR hydration**: Use `useAsyncData()` not direct `fetch()` for proper SSR support
3. **Shared composable memory**: `useListingStep()` has `MAX_CACHED_LISTINGS = 10` to prevent memory leaks
4. **Cloudflare image URLs**: Check via `isCloudflareId()` pattern, stored differently than Sanity images
5. **Dialog return values**: Use `isObjectWithReturnValue()` guard to safely access dialog results
