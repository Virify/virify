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
          <UNavigationMenu orientation="vertical" :items="getStyles(collapsed || false)" :ui="{
            label: 'body-sm',
            link: 'body-sm no-underline text-foreground text-normal',
            content: 'no-underline',
            linkLeadingIcon: 'text-secondary',
          }" :collapsed="collapsed">
          </UNavigationMenu>
        </TooltipProvider>
      </template>
      <!-- sidebar footer -->
      <template #footer="{ collapsed }">
        <div class="flex" :class="collapsed ? 'flex-col items-center gap-2' : 'justify-between w-100'">
          <UButton icon="i-lucide-log-out" color="secondary" variant="link" size="xs" @click="logout"
            class="body-sm font-bold" :ui="{
              leadingIcon: 'text-secondary'
            }" :label="collapsed ? undefined : 'Logout'" :square="collapsed" />
          <UColorModeButton />
        </div>
      </template>
    </UDashboardSidebar>
    <!-- panel -->
    <UDashboardPanel>
      <!-- panel header -->
      <template #header>
        <UDashboardNavbar
          title="Dashboard"
          toggle-side="right"
          class="body-sm"
        />
      </template>
    </UDashboardPanel>
    <!-- page -->
    <slot />
  </UDashboardGroup>
</template>
<script lang="ts" setup>
import { dashboardNavigationitems } from '~/utils/account/navigation';
import type { NavigationMenuItem } from '@nuxt/ui';
import { TooltipProvider } from 'reka-ui';

const { clear } = useUserSession()
async function logout() {
  await clear()
  navigateTo('/')
}

function getStyles(collapsed: boolean): NavigationMenuItem[] {
  if (!collapsed) return dashboardNavigationitems.value as NavigationMenuItem[];

  return (dashboardNavigationitems.value as any[]).flatMap((item: NavigationMenuItem) => {
    // If it's a group with children, return the children (effectively flattening)
    if (item.children) {
      return item.children;
    }
    // If it's a label-only item (section header), hide it in collapsed mode
    if (item.type === 'label' && !item.children && !item.to) {
      return [];
    }
    // Return regular links
    return item;
  });
}
</script>