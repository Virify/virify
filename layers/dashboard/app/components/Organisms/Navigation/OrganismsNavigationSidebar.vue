<template>
  <!-- sidebar -->
  <UDashboardSidebar
    collapsible
    resizable
    mode="slideover"
    side="left"
    toggle-side="right"
    :min-size="18"
    :ui="{
      header: 'p-4',
      root: 'bg-primary',
    }"
  >
    <!-- sidebar header -->
    <template #header="{ collapsed }">
      <div class="flex items-center justify-between w-full p-2">
        <nuxt-link to="/" :class="[collapsed ? 'flex justify-center w-full' : '']" aria-label="Virify Home">
          <AtomsIcon v-if="!collapsed" icon="logo/horizontal-colour" width="140" height="42" class="max-w-140 text-white" />
          <AtomsIcon v-else icon="logo/v-logo" width="42" height="42" class="shrink-0" />
        </nuxt-link>
        <UDashboardSidebarCollapse
          v-if="!collapsed"
          class="hover:bg-white/5 rounded-md transition-colors"
          :ui="{
            leadingIcon: 'text-white',
          }"
        />
      </div>
    </template>
    <!-- sidebar content -->
    <template #default="{ collapsed }">
      <TooltipProvider :delay-duration="400">
        <!-- navigation menu -->
        <UNavigationMenu
          orientation="vertical"
          :items="dashboardNavigationitems"
          :popover="true"
          :ui="{
            label: 'text-normal',
            link: 'body-sm no-underline text-normal',
            item: 'text-white',
            content: 'no-underline bg-primary text-white ring-0 border-0',
            viewport: 'shadow-none ring-0 border-0',
            linkLeadingIcon: 'text-secondary',
            linkTrailingBadgeSize: 'md',
            childLinkIcon: 'text-secondary',
            linkTrailingBadge: 'text-primary bg-white',
          }"
          :collapsed="collapsed"
        >
          <!-- collapse icon -->
          <template #list-leading>
            <TooltipProvider :delay-duration="400">
              <UTooltip text="Expand sidebar">
                <UDashboardSidebarCollapse
                  v-if="collapsed"
                  class="hover:bg-white/5 rounded-md transition-colors"
                  :ui="{
                    leadingIcon: 'text-white',
                  }"
                />
              </UTooltip>
            </TooltipProvider>
          </template>
          <!-- popover badges -->
          <template #item-content="{ item }">
            <ul class="grid gap-1 p-2">
              <li v-for="child in item.children" :key="child.label">
                <ULink :to="child.to" class="flex items-center justify-between p-2 body-sm hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-2 pr-2">
                    <UIcon v-if="child.icon" :name="child.icon" class="size-5 text-secondary" />
                    <span>{{ child.label }}</span>
                  </div>
                  <UBadge v-if="child.badge" :label="child.badge" size="md" variant="outline" class="text-foreground border" />
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
            <UButton
              icon="i-lucide-log-out"
              variant="link"
              size="xs"
              @click="logout"
              tooltip="Logout"
              class="body-sm text-white hover:bg-white/5 rounded-md transition-colors"
              :ui="{
                leadingIcon: 'text-secondary',
                label: 'text-white font-bold',
              }"
              :label="collapsed ? undefined : 'Logout'"
              :square="collapsed"
            />
          </UTooltip>
        </TooltipProvider>
        <UColorModeButton
          class="hover:bg-white/5 rounded-md transition-colors"
          :ui="{
            leadingIcon: 'text-white',
          }"
        />
      </div>
    </template>
  </UDashboardSidebar>
</template>
<script lang="ts" setup>
const { dashboardNavigationitems } = useDashboardNavigation();
</script>
