---
applyTo: "{app,layers/*/app}/composables/**"
description: "Use when writing or reviewing Vue composables in Virify. Covers singleton pattern, data fetching, reactive state, and naming conventions."
---

# Composable Conventions

## Singleton Pattern (Required for Shared State)

Use `createSharedComposable` from `@vueuse/core` for any composable that should have a **single instance** across the app. This prevents duplicate API calls and ensures consistent state.

```ts
import { createSharedComposable } from '@vueuse/core'

// ✓ Singleton — one instance shared across all consumers
export const useFavourites = createSharedComposable(() => {
  const items = ref<Favourite[]>([])
  const deletingIds = ref(new Set<number>())
  return { items, deletingIds }
})

// ✗ New instance per call — only for local/component state
export function useLocalState() {
  const count = ref(0)
  return { count }
}
```

Use `createSharedComposable` when:
- The composable fetches data from an API
- It holds global UI state (search results, nav state, user data)
- Multiple components need the same data

Use regular `function` when:
- State is local to one component
- The composable is a simple wrapper (e.g., `useCheckValidity`)

## Data Fetching with `useAsyncData`

Always prefer `useAsyncData` over direct `$fetch` for SSR-safe data loading:

```ts
export const useMyData = createSharedComposable(() => {
  const { data, status, refresh } = useAsyncData(
    'unique-cache-key',           // ← unique key, never omit
    () => useRequestFetch()('/api/my-endpoint'),
    { immediate: true }           // ← auto-fetch on composable init
  )

  return { data, status, refresh }
})
```

Never use raw `fetch()` or `$fetch` for authenticated requests — use `useRequestFetch()`.

## Reactive State Patterns

```ts
export const useMyComposable = createSharedComposable(() => {
  // Primitive state
  const isLoading = ref(false)
  const total = ref(0)

  // Array/object state — typed
  const items = ref<MyType[]>([])

  // Set for tracking IDs (pending operations)
  const deletingIds = ref(new Set<number>())

  // Computed from state
  const isEmpty = computed(() => items.value.length === 0)
  const saleItems = computed(() =>
    items.value.filter(i => i.listing?.saleListing)
  )

  return { isLoading, total, items, deletingIds, isEmpty, saleItems }
})
```

## Error Handling

```ts
const toast = useToast()

async function deleteItem(id: number) {
  deletingIds.value.add(id)
  try {
    await useRequestFetch()(`/api/item/${id}`, { method: 'DELETE' })
    items.value = items.value.filter(i => i.id !== id)
    toast.add({ title: 'Deleted', color: 'success', icon: 'i-lucide-check-circle-2' })
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to delete', color: 'error', icon: 'i-lucide-circle-x' })
  } finally {
    deletingIds.value.delete(id)
  }
}
```

## Type Guards

Use type guards from `app/utils/` for discriminated unions:

```ts
if (isDraftListing(listing)) {
  // TypeScript knows listing is DraftListing
}
if (isLiveListing(listing)) {
  // TypeScript knows listing is LiveListing
}
```

## Naming Conventions

- File: `useMyFeature.ts` (camelCase, `use` prefix)
- Export: named export matching filename (`export const useFoo = ...` or `export function useFoo()`)
- Avoid `any` — use proper types from `layers/database/server/database/prisma/generated/client`

## Common Composables Reference

| Composable | Purpose |
|------------|---------|
| `useListingEdit()` | Draft & live listing state |
| `useDraftListings()` | Shared draft listings list |
| `useRole()` | User role (ADMIN/AGENT/USER) |
| `useFeatureFlag()` | Feature flag access |
| `useCheckValidity()` | HTML5 form validation |
| `useUserSession()` | Auth state from nuxt-auth-utils |
| `useToast()` | Toast notifications |
| `useRequestFetch()` | Auth-preserving fetch |
| `useAnalytics()` | Event tracking |
| `useDialog()` | Modal/dialog state |

## Auto-imports

Nuxt auto-imports from:
- `app/composables/` — no import statement needed
- `app/utils/` — no import statement needed  
- `shared/utils/` — no import statement needed
- `shared/types/` — no import statement needed

**Never manually import these** — it causes duplicate module issues.
