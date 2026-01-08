<template>
  <UDashboardGroup unit="px">
    <!-- sidebar -->
    <OrganismsDashboardNavigationSidebar />
    <UDashboardSearch
      :groups="groups"
      placeholder="Search your saved listings for quick view..."
      :color-mode="false"
      label="Quick View"
      :ui="{
        label: 'body-sm',
        input: 'body-sm',
      }"
    >
      <template #item="{ item }">
        <OrganismsDashboardListingCardSearchItem :item="(item as DashboardSearchItem)" />
      </template>
    </UDashboardSearch>
    <slot />
  </UDashboardGroup>
  <ViewsDialog />
  <MoleculesToastContainer />
</template>
<script lang="ts" setup>

const { fetchUserItemsAggregates } = useNotifications()
const { groups } = useDashboardSearch()

// Initialize shared composables to keep them alive and cache data across dashboard navigation
useAnalytics()
useFavourites()
useNotes()

onMounted(async () => {
  await fetchUserItemsAggregates()
})
</script>
<style lang="scss">
  @media (min-width: 2560px) {
  .uw-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>