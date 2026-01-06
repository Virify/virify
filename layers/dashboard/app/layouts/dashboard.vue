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
            icon: 'text-secondary'
          }"
        />
      </template>
      <!-- panel body / page -->
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
<script lang="ts" setup>
import { TooltipProvider } from 'reka-ui';

const { clear } = useUserSession()
const { fetchUserItemsAggregates } = useNotifications()

onMounted(async () => {
  await fetchUserItemsAggregates()
})

async function logout() {
  await clear()
  navigateTo('/')
}
</script>