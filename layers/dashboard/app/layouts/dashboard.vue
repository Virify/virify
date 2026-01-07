<template>
  <UDashboardGroup>
    <!-- sidebar -->
    <OrganismsNavigationSidebar />
    <!-- panel -->
    <UDashboardPanel>
      <!-- panel header -->
      <template #header>
        <UDashboardNavbar
          :title="($route.meta.head as any)?.title || 'Dashboard'"
          :icon="($route.meta.head as any)?.icon"
          toggle-side="right"
          class="body-sm border-0"
          :ui="{
            icon: 'text-secondary',
            title: 'font-bold',
          }"
        />
      </template>
      <!-- panel body / page -->
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
  <ViewsDialog />
  <MoleculesToastContainer />
</template>
<script lang="ts" setup>
const { fetchUserItemsAggregates } = useNotifications()

onMounted(async () => {
  await fetchUserItemsAggregates()
})
</script>