<template>
  <UDashboardGroup unit="px">
    <!-- sidebar -->
    <OrganismsDashboardNavigationSidebar />
      <slot/>
  </UDashboardGroup>
  <ViewsDialog />
</template>
<script lang="ts" setup>
  const { fetchUserItemsAggregates } = useNotifications()
  const { groups } = useDashboardSearch()

  onMounted(async () => {
    await fetchUserItemsAggregates()
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