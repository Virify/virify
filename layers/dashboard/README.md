# Dashboard Layer

The `layers/dashboard` layer contains all authenticated user dashboard pages, composables, components and server utilities. It sits on top of `layers/database` and `layers/websocket`.

---

## Architecture Overview

```
User Action (UI)
     │
     ▼
Server API Endpoint  ──►  Database (Prisma)
     │
     ├──► Bust server-side cache (useStorage / cache utils)
     │
     └──► WebSocket broadcast (createAggregateUpdateMessage)
                │
                ▼
        websocket.client.ts plugin
                │
                ▼
        useNotifications  ──►  Optimistic update to aggregates ref
                │
                ▼
        useDashboardNavigation  ──►  Reactive sidebar badges auto-update
```

---

## Caching Strategy

### Two layers of cache

| Layer | Tool | Where |
|---|---|---|
| Server-side (nitro) | `useStorage('cache')` | API route handlers |
| Client-side (reactive) | Shared composable refs + `useAsyncData` | Vue composables |

### Server-side cache keys

All keys follow a consistent namespace pattern:

```
// Aggregates (badge counts)
aggregates:user:{userId}                                 TTL: 5 min

// Favourites
favs:lookups:{userId}                                    TTL: varies
favs:recent:{userId}                                     TTL: 30 min
favs:full:{userId}:{filter}:{sort}:{page}:{limit}        TTL: 60 min

// Notes
notes:full:{userId}:{filter}:{sort}:{page}:{limit}       TTL: 60 min

// My / Draft / Archived listings
my-listings:{userId}:{filter}:{sort}:{page}:{limit}      TTL: 60 min
draft-listings:{userId}:{filter}:{sort}:{page}:{limit}   TTL: 60 min

// Other user-scoped lists
hidden:full:{userId}:...                                 TTL: 60 min
viewings:{userId}:{role}:{status}:{sort}                 TTL: 5 min

// Shared / non-user
listing:{listingId}                                      TTL: 15 min
property:{propertyId}                                    TTL: varies
```

### Cache busting utilities

All invalidation helpers live in:
```
layers/database/server/utils/cache.ts
```

**Aggregate invalidation** (call whenever badge counts change):
```ts
await invalidateAggregatesCache(userId)
```

**Paginated list invalidation** (prefix-sweep — clears every page/filter/sort combo):
```ts
await invalidateFavouritesFullCache(userId)
await invalidateNotesFullCache(userId)
await invalidateMyListingsCache(userId)
await invalidateDraftListingsCache(userId)
await invalidateHiddenListingsFullCache(userId)
await invalidateViewingsCache(userId)
```

**Single-key invalidation:**
```ts
await invalidateFavouritesRecentCache(userId)
await invalidateLocationsCache(userId)
await invalidateRecentViewedCache(userId)
await invalidateConversationSentCache(userId)
```

---

## Aggregates System

`UserItemsAggregates` is the single object that drives all sidebar badge counts. It lives in `useNotifications` (singleton via `createSharedComposable`).

### The type (shared/types/notifications.ts)

```ts
interface UserItemsAggregates {
  favourites: number
  notes: number
  hiddenListings: number
  viewedListings: number
  enquiries: number
  locations: number
  listings: number              // active live listings
  draftListings: number
  archivedListings: number
  messages: number
  unreadMessages: number
  unreadConversations: number
  sentEnquiries: number
  sentUnreadEnquiries: number
  receivedEnquiries: number
  receivedUnreadEnquiries: number
  viewings: number              // PENDING + ACCEPTED + RESCHEDULED
}
```

### How aggregates update

Updates come from two paths and are **always additive/subtractive** (never a full re-fetch):

**Path 1 — WebSocket (immediate, optimistic):**
```
Server sends aggregate_update { aggregateType: "favourites", operation: "add" }
  → websocket.client.ts receives it
  → calls handleAggregateUpdate()
  → aggregates.value.favourites += 1
  → useDashboardNavigation recomputes badge instantly
```

**Path 2 — TTL safety net (5 min):**
If a WebSocket message is missed (network blip, reconnect), the next call to
`fetchUserItemsAggregates()` hits `/api/notifications/aggregates` which re-queries
the DB and refreshes the cached value.

---

## Notification Types

Defined in `shared/types/notifications.ts`:

```ts
type NotificationType =
  | "NEW_MESSAGE"           // Incoming chat message
  | "NEW_ENQUIRY"           // Someone enquired on your listing
  | "ENQUIRY_REPLY"         // Reply to your enquiry
  | "LISTING_UPDATE"        // A saved listing changed
  | "SYSTEM"                // Platform announcement
  | "VIEWING_REQUEST"       // Someone requested a viewing on your listing
  | "VIEWING_ACCEPTED"      // Owner accepted your viewing request
  | "VIEWING_REJECTED"      // Owner rejected your viewing request
  | "VIEWING_RESCHEDULED"   // Owner proposed a new time
  | "VIEWING_CANCELLED"     // A viewing was cancelled
```

### Notification shape (`UserNotification`)

```ts
interface UserNotification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  senderUsername: string | null
  senderAvatar: string | null
  conversationId: number | null
  listingId: number | null
  isRead: boolean
  isDismissed: boolean
  createdAt: Date
  readAt: Date | null
  // Denormalised listing snapshot (for display without extra queries)
  listingPrice: number | null
  listingAddress: string | null
  listingImage: string | null
  listingIsRental: boolean | null
}
```

---

## WebSocket Events

The `websocket.client.ts` plugin is the **single entry point** for all real-time data.

### Event map

| Event | What it does |
|---|---|
| `aggregate_update` | Optimistic +1/-1 on one aggregate key |
| `new_conversation` | Adds conversation to `useEnquiries` + bumps 3 aggregate keys |
| `new_message` | Updates conversation unread state + fetches notification counts |
| `notification_new` | Adds to notification list + shows toast. If VIEWING_*, also fully re-fetches viewings and aggregates |
| `message_read` | Updates read state in `useEnquiries` only |

### Viewing-specific WS behaviour

Viewing notifications (`VIEWING_*`) trigger a **full re-fetch** of both
`fetchViewings()` and `fetchUserItemsAggregates(true)` — not just optimistic
updates. This ensures status, dates and counters stay accurate after multi-step
viewing workflows (request → accept/reject → reschedule).

---

## How Navigation Badges Work

`useDashboardNavigation` is a computed-only composable:

```ts
export const useDashboardNavigation = createSharedComposable(() => {
  const { aggregates } = useNotifications()

  const items = computed(() => [
    { label: 'Viewings', badge: aggregates.value.viewings > 0 ? String(aggregates.value.viewings) : undefined },
    { label: 'Enquiries', badge: aggregates.value.unreadConversations || undefined },
    // ... etc
  ])

  return { items }
})
```

No fetching, no side effects — badges are entirely derived from `aggregates`. The
moment `aggregates` updates (via WS), every badge in the nav recomputes automatically.

---

## Step-by-Step: Adding a New Feature with Caching

### 1. Database / Prisma

Add your model to `prisma/schema.prisma` and run `pnpm pgen`.

### 2. Server utility (DB query)

Create `layers/database/server/utils/my-feature.ts`:

```ts
export async function getUserMyFeature(userId: number) {
  return prisma.myFeature.findMany({ where: { userId } })
}
```

### 3. Cache invalidation helper

Add to `layers/database/server/utils/cache.ts`:

```ts
export async function invalidateMyFeatureCache(userId: number): Promise<void> {
  // For paginated lists use prefix sweep:
  await sweepPrefix(useStorage('cache'), `my-feature:${userId}:`)
  // For a single key:
  // await useStorage('cache').removeItem(`my-feature:${userId}`)
}
```

### 4. GET API endpoint (with cache)

Create `layers/database/server/api/user/my-feature/index.get.ts`:

```ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const query = getQuery(event)
  const sort = (query.sort as string) || 'newest'

  const cacheKey = `my-feature:${user.id}:${sort}`
  const storage = useStorage('cache')
  const cached = await storage.getItem(cacheKey)
  if (cached) return cached

  const data = await getUserMyFeature(user.id as number)
  storage.setItem(cacheKey, data, { ttl: 60 * 60 }).catch(() => {})
  return data
})
```

### 5. Mutation endpoint (bust cache + WS broadcast)

Create `layers/database/server/api/user/my-feature/index.post.ts`:

```ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer()

  const body = await readValidatedBody(event, mySchema.parse)

  const result = await createMyFeature(user.id as number, body)

  // 1. Bust all caches affected by this mutation
  await invalidateMyFeatureCache(user.id as number)
  await invalidateAggregatesCache(user.id as number)

  // 2. Broadcast aggregate update via WebSocket
  //    This triggers the optimistic +1 on all connected clients
  const msg = createAggregateUpdateMessage('myFeature', 'add', user.id)
  sendMessage(msg)

  return result
})
```

### 6. Add to UserItemsAggregates

In `shared/types/notifications.ts` add the key to `UserItemsAggregates`:

```ts
myFeature: number  // Count of user's active my-features
```

Update the DB query in `layers/database/server/utils/aggregates.ts` to include the count.

### 7. Add to useDashboardNavigation

In `layers/dashboard/app/composables/useDashboardNavigation.ts`:

```ts
{ label: 'My Feature', badge: aggregates.value.myFeature > 0 ? String(aggregates.value.myFeature) : undefined }
```

### 8. Client composable

Create `layers/dashboard/app/composables/useMyFeature.ts`:

```ts
export const useMyFeature = createSharedComposable(() => {
  const requestFetch = useRequestFetch()
  const { user } = useUserSession()
  const items = ref<MyFeatureItem[]>([])
  const loading = ref(false)

  async function fetchMyFeature() {
    if (!user.value?.id) return
    loading.value = true
    try {
      const data = await requestFetch<MyFeatureItem[]>('/api/user/my-feature')
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  return { items: readonly(items), loading: readonly(loading), fetchMyFeature }
})
```

### 9. Dashboard page

Create `layers/dashboard/app/pages/dashboard/my-feature/index.vue`:

```vue
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{ right: 'flex items-center gap-1' }">
        <template #title><MoleculesDashboardBreadcrumb /></template>
        <template #right>
          <OrganismsDashboardFilter
            :items="items"
            date-key="createdAt"
            persistence-key="dashboard-my-feature"
            @update:filtered="filtered = $event"
          />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <!-- render filtered -->
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'dashboard' })

const { items, fetchMyFeature } = useMyFeature()
onMounted(() => fetchMyFeature())

const filtered = ref([])
</script>
```

### 10. WebSocket handler

In `layers/websocket/plugins/websocket.client.ts`, the `onAggregateUpdate` handler already handles any `aggregateType` key generically — no change needed unless you need custom behaviour (like viewings does with its full re-fetch).

---

## TTL Reference

| Data | TTL | Rationale |
|---|---|---|
| Aggregates | 5 min | Safety net; WS keeps them fresh |
| Viewings | 5 min | Frequently changing status |
| Recent items | 30 min | Dashboard homepage, low staleness risk |
| Full paginated lists | 60 min | Expensive queries, busted on mutation |
| Single listing | 15 min | Shared across users |

---

## Key Composables

| Composable | Purpose |
|---|---|
| `useNotifications` | Aggregates, notification list, badge counts — **singleton** |
| `useViewings` | Viewing requests state — **singleton** |
| `useEnquiries` | Conversations + messages — **singleton** |
| `useDraftListings` | Draft listing state — **singleton** |
| `useDashboardNavigation` | Computed nav items from aggregates — **singleton** |
| `useDashboardRecentItems` | Recent favourites/notes for homepage — **singleton** |
| `useDashboardListFilter` | Sort/filter/search logic for any list page |

All singletons use `createSharedComposable` from `@vueuse/core`.
