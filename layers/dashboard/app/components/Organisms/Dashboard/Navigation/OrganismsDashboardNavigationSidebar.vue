<template>
  <!-- sidebar -->
  <UDashboardSidebar
    collapsible
    resizable
    mode="slideover"
    side="left"
    toggle-side="right"
    :min-size="300"
    :max-size="400"
    class="border-0 ring-0"
    :ui="{
      header: 'p-4 border-none',
      root: 'bg-primary',
      body: 'border-none',
      content: 'bg-primary',
      footer: 'border-none w-full',
      overlay: 'backdrop-blur-sm',
      toggle: '!text-white hover:!bg-white/10',
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
            link: 'body-xs no-underline',
            item: 'text-white',
            content: 'no-underline bg-primary text-white ring-0 border-0',
            viewport: 'shadow-none ring-0 border-0',
            linkLeadingIcon: 'text-secondary',
            linkTrailingBadgeSize: 'md',
            childLinkIcon: 'text-secondary',
            linkTrailingBadge: 'text-white bg-background',
          }"
          :collapsed="collapsed"
        >
          <!-- collapse icon -->
          <template #list-leading>
            <UDashboardSidebarCollapse
              v-if="collapsed"
              class="hover:bg-white/5 rounded-md transition-colors"
              :ui="{
                leadingIcon: 'text-white',
              }"
            />
          </template>
          <!-- popover badges -->
          <template #item-content="{ item }">
            <ul class="grid gap-1 p-2">
              <li v-for="child in item.children" :key="child.label">
                <ULink :to="child.to" class="flex items-center justify-between p-2 body-xs hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-2 pr-2">
                    <UIcon v-if="child.icon" :name="child.icon" class="size-5 text-secondary" />
                    <span>{{ child.label }}</span>
                  </div>
                  <UBadge v-if="child.badge" :label="child.badge" size="sm" variant="outline" class="text-foreground border" />
                </ULink>
              </li>
            </ul>
          </template>
        </UNavigationMenu>
      </TooltipProvider>
    </template>
    <!-- sidebar footer -->
    <template #footer="{ collapsed }">
      <div class="flex" :class="collapsed ? 'flex-col items-center gap-2' : 'justify-between w-full'">
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
import { TooltipProvider } from 'reka-ui';
const { dashboardNavigationitems } = useDashboardNavigation();
</script>
