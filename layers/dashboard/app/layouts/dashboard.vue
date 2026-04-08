<template>
  <UDashboardGroup unit="px">
    <!-- sidebar -->
    <OrganismsDashboardNavigationSidebar />
      <slot/>
  </UDashboardGroup>
  <ViewsDialog />
</template>
<script lang="ts" setup>
  const { fetchUserItemsAggregates, fetchNotifications, fetchNotificationCounts } = useNotifications()
  const { fetchViewings } = useViewings()
  
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
    
    // Background fetch: lookups, notifications, viewings
    refreshFavourites().catch(e => console.error("Failed to fetch favourite lookups", e))
    refreshUserNotes().catch(e => console.error("Failed to fetch note lookups", e))
    fetchNotificationCounts().catch(e => console.error("Failed to fetch notification counts", e))
    fetchNotifications({ limit: 50 }).catch(e => console.error("Failed to fetch notifications", e))
    fetchViewings().catch(e => console.error("Failed to fetch viewings", e))
  })
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