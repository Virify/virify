<template>
  <UDashboardGroup unit="px">
    <!-- sidebar -->
    <OrganismsDashboardNavigationSidebar />
    <slot />
  </UDashboardGroup>
  <ViewsDialog />
</template>
<script lang="ts" setup>
import { useEventListener, useIntervalFn } from '@vueuse/core'

const { fetchUserItemsAggregates, fetchNotifications, fetchNotificationCounts } = useNotifications()
const { viewings, fetchViewings } = useViewings()
const { wsConnected } = useWebSocketClient()

// Initialize lookups for favourites and notes (needed for hasNote/isFavourite checks)
// Destructure refresh so we can force a client-side fetch on mount.
// createSharedComposable is module-level on the server, so useAsyncData inside it
// only runs on the first SSR request — subsequent hard refreshes skip it and the
// Nuxt payload never carries the lookup data. Calling refresh() in onMounted
// guarantees the data is always fetched on the client regardless of SSR state.
const { refreshFavourites } = useFavouriteLookups()
const { refreshUserNotes } = useNoteLookups()

const hasFetched = ref(false)

onMounted(async () => {
  // Only fetch once per layout instance to prevent duplicate requests on page navigation
  if (hasFetched.value) return
  hasFetched.value = true

  // Fetch aggregates (badge counts) immediately
  await fetchUserItemsAggregates()

  // Background fetch: lookups, notifications
  refreshFavourites().catch(e => console.error("Failed to fetch favourite lookups", e))
  refreshUserNotes().catch(e => console.error("Failed to fetch note lookups", e))
  fetchNotificationCounts().catch(e => console.error("Failed to fetch notification counts", e))
  fetchNotifications({ limit: 20 }).catch(e => console.error("Failed to fetch notifications", e))
  // Only fetch viewings if not already populated (viewings page also fetches on mount)
  if (!viewings.value.length) {
    fetchViewings().catch(e => console.error("Failed to fetch viewings", e))
  }
})

// When the WebSocket is not connected, poll every 30 s so that notifications
// created server-side (and stored in the DB) still surface to the user.
// When the user re-connects via WebSocket the interval is effectively idle since
// the WS will push updates instead.
if (import.meta.client) {
  const { pause, resume } = useIntervalFn(() => {
    if (wsConnected.value) return
    fetchNotificationCounts().catch(e => console.error("[poll] Failed to fetch notification counts", e))
    fetchUserItemsAggregates(true).catch(e => console.error("[poll] Failed to fetch aggregates", e))
  }, 30_000)

  // Also refresh immediately on tab visibility change when WS is not connected
  // (covers the case where user returns to the tab after a long absence)
  useEventListener(document, 'visibilitychange', () => {
    if (document.visibilityState === 'visible' && !wsConnected.value) {
      fetchNotificationCounts().catch(e => console.error("[visibility] Failed to fetch notification counts", e))
      fetchUserItemsAggregates(true).catch(e => console.error("[visibility] Failed to fetch aggregates", e))
    }
  })

  onUnmounted(() => pause())
}
</script>
<style lang="scss">
@media (min-width: 1921px) {
  .uw-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }
}

@media (min-width: 3000px) {
  .uw-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
  }
}

@media (min-width: 4000px) {
  .uw-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
  }
}
</style>