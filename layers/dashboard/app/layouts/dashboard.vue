<template>
  <UDashboardGroup>
    <!-- sidebar -->
    <UDashboardSidebar collapsible resizable mode="slideover" side="left" toggle-side="right" :min-size="15"  :ui="{
      header: 'p-4',
    }" >
    <!-- sidebar header -->
      <template #header="{ collapsed }">
        <div class="flex items-center justify-between w-full p-2">
          <nuxt-link to="/" :class="[collapsed ? 'flex justify-center w-full' : '']"
            aria-label="Virify Home">
            <AtomsIcon v-if="!collapsed" icon="logo/horizontal-colour"  width="140" height="42" class="max-w-140" />
            <AtomsIcon v-else icon="logo/v-logo" width="42" height="42" class="shrink-0" />
          </nuxt-link>
          <UDashboardSidebarCollapse v-if="!collapsed" :ui="{
            leadingIcon: 'text-secondary',
          }" />
        </div>
      </template>
      <!-- sidebar content -->
      <template #default="{ collapsed }">
        <TooltipProvider :delay-duration="400">
          <!-- navigation menu -->
          <UNavigationMenu orientation="vertical" :items="dashboardNavigationitems" :popover="true" :ui="{
            label: 'body-sm',
            link: 'body-sm no-underline text-foreground text-normal',
            content: 'no-underline',
            linkLeadingIcon: 'text-secondary',
            linkTrailingBadgeSize: 'md',
            childLinkIcon: 'text-secondary',
          }" :collapsed="collapsed">
            <!-- collapse icon -->
            <template #list-leading>
              <TooltipProvider :delay-duration="400">
                <UTooltip text="Expand sidebar">
                  <UDashboardSidebarCollapse v-if="collapsed" :ui="{
                      leadingIcon: 'text-secondary',
                    }"
                  />
                </UTooltip>
              </TooltipProvider>
            </template>
            <!-- popover badges -->
            <template #item-content="{ item }">
              <ul class="grid gap-1 p-2">
                <li v-for="child in item.children" :key="child.label">
                  <ULink :to="child.to" class="flex items-center justify-between gap-2 rounded-md p-2 text-sm">
                    <div class="flex items-center gap-2">
                      <UIcon v-if="child.icon" :name="child.icon" class="size-5 text-secondary" />
                      <span>{{ child.label }}</span>
                    </div>
                    <UBadge v-if="child.badge" :label="child.badge" size="md" variant="outline" class="text-foreground"/>
                  </ULink>
                </li>
              </ul>
            </template>
          </UNavigationMenu>
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
          class="body-sm border-0"
          :ui="{
            icon: 'text-secondary'
          }"
        />
      </template>
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
const { dashboardNavigationitems } = useDashboardNavigation()

onMounted(async () => {
  await fetchUserItemsAggregates()
})

async function logout() {
  await clear()
  navigateTo('/')
}
</script>