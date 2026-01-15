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
  const { groups } = useDashboardSearch()

  onMounted(async () => {
    // Fetch aggregates (badge counts) immediately
    await fetchUserItemsAggregates()
    
    // Background fetch notifications without blocking
    // These will be displayed when the user opens the notification panel
    fetchNotificationCounts().catch(e => console.error("Failed to fetch notification counts", e))
    fetchNotifications({ limit: 50 }).catch(e => console.error("Failed to fetch notifications", e))
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