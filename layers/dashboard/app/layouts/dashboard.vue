<template>
  <UDashboardGroup>
    <!-- sidebar -->
    <UDashboardSidebar collapsable resizable toggle-side="right" :ui="{
      header: 'p-0',
    }" collapsible>
    <!-- sidebar header -->
      <template #header="{ collapsed }">
        <nuxt-link to="/" class="o-site-navigation__brand w-100" :class="[collapsed ? 'flex justify-center' : 'pl-4']"
          aria-label="Virify Home">
          <AtomsIcon v-if="!collapsed" icon="logo/horizontal-colour" width="140" height="42" />
          <AtomsIcon v-else icon="logo/v-logo" width="42" height="42" />
        </nuxt-link>
      </template>
      <!-- sidebar content -->
      <template #default="{ collapsed }">
        <TooltipProvider :delay-duration="400">
          <UNavigationMenu orientation="vertical" :items="dashboardNavigationitems" :popover="true" :ui="{
            label: 'body-sm',
            link: 'body-sm no-underline text-foreground text-normal',
            content: 'no-underline',
            linkLeadingIcon: 'text-secondary',
            childLinkIcon: 'text-secondary',
            linkTrailingBadgeSize: 'md',
          }" :collapsed="collapsed" />
        </TooltipProvider>
      </template>
      <!-- sidebar footer -->
      <template #footer="{ collapsed }">
        <div class="flex" :class="collapsed ? 'flex-col items-center gap-2' : 'justify-between w-100'">
          <TooltipProvider :delay-duration="400">
            <UTooltip text="Logout">
              <UButton icon="i-lucide-log-out" color="secondary" variant="link" size="xs" @click="logout"
                tooltip="Logout"
                  class="body-sm font-bold" :ui="{
                    leadingIcon: 'text-secondary'
                  }" :label="collapsed ? undefined : 'Logout'" :square="collapsed" />
            </UTooltip>
          </TooltipProvider>
          <UColorModeButton />
        </div>
      </template>
    </UDashboardSidebar>
    <!-- panel -->
    <UDashboardPanel>
      <!-- panel header -->
      <template #header>
        <UDashboardNavbar
          :title="($route.meta.head as any)?.title || 'Dashboard'"
          :icon="($route.meta.head as any)?.icon"
          toggle-side="right"
          class="body-sm"
        />
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';
import { TooltipProvider } from 'reka-ui';

const { clear } = useUserSession()
const { fetchUserItemsAggregates } = useNotifications()
const { dashboardNavigationitems } = useDashboardNavigation()

onMounted(async () => {
  await fetchUserItemsAggregates()
})

async function logout() {
  await clear()
  navigateTo('/')
}
</script>