<template>
  <UDashboardGroup unit="px">
    <!-- sidebar -->
    <OrganismsNavigationSidebar />
    <UDashboardSearch
      :groups="groups"
      placeholder="Search..."
      :color-mode="false"
      :ui="{
        label: 'body-md'
      }"
    >
      <template #item="{ item }">
        <OrganismsListingCardSearchItem :item="item" />
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