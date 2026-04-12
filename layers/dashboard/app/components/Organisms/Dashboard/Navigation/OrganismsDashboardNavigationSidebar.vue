<template>
    <!-- sidebar -->
    <UDashboardSidebar
      collapsible
      resizable
      mode="slideover"
      side="left"
      toggle-side="right"
      :min-size="300"
      :default-size="300"
      :max-size="400"
      class="border-0 ring-0"
      :ui="{
        header: 'p-4 border-none',
        root: 'bg-(--background-100)! dark:bg-(--background-200)! text-sm',
        body: 'border-none',
        content: 'bg-(--background-100)! dark:bg-(--background-200)!',
        footer: 'border-none w-full',
        overlay: 'backdrop-blur-sm',
        toggle: '!text-foreground hover:!bg-white/10',
        handle: 'border border-(--background-300)',
      }"
    >
    <!-- sidebar header -->
    <template #header="{ collapsed }">
      <div class="flex items-center justify-between w-full p-2">
        <nuxt-link to="/" :class="[collapsed ? 'flex justify-center w-full' : '']" aria-label="Virify Home">
          <AtomsIcon v-if="!collapsed" icon="logo/horizontal-colour" width="140" height="42" class="max-w-140 text-foreground" />
          <AtomsIcon v-else icon="logo/v-logo" width="42" height="42" class="shrink-0" />
        </nuxt-link>
        <UDashboardSidebarCollapse
          v-if="!collapsed"
          class="hover:bg-white/5 rounded-md transition-colors"
        />
      </div>
    </template>
    <!-- sidebar content -->
    <template #default="{ collapsed }">
      <TooltipProvider :delay-duration="400">
        <!-- notifications button at top -->
        <div 
          :class="['flex items-center border-b border-white/20 pb-2 cursor-pointer p-1', collapsed ? 'justify-center' : 'gap-2']"
          @click="notificationSlideoverOpen = true"
        >
          <OrganismsDashboardNotificationButton v-model:open="notificationSlideoverOpen" color="secondary" />
          <div v-if="!collapsed" class="flex items-center gap-2 px-0 py-0">
            <p class="body-xs! text-foreground">Notifications</p>
            <UBadge
              v-if="notificationCounts?.total"
              :label="notificationCounts.total"
              size="md"
              class="text-foreground bg-background"
              color="primary"
              variant="outline"
              :ui="{
                base: 'border',
                label: 'font-normal',
              }"
            />
          </div>
        </div>
        <!-- navigation menu -->
        <UNavigationMenu
          orientation="vertical"
          :items="dashboardNavigationitems"
          :popover="true"
          :ui="{
            label: 'text-normal',
            link: 'body-xs no-underline',
            item: 'text-foreground',
            content: 'no-underline text-foreground ring-0! border-0!',
            linkLeadingIcon: 'text-secondary',
            linkTrailingBadgeSize: 'md',
            childLinkIcon: 'text-secondary',
            linkTrailingBadge: 'text-foreground bg-(--background-100) border',
          }"
          :collapsed="collapsed"
        >
          <!-- collapse icon -->
          <template #list-leading>
            <UDashboardSidebarCollapse
              v-if="collapsed"
              class="hover:bg-background/90 rounded-md transition-colors"
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
      <TooltipProvider :delay-duration="400">
        <div :class="collapsed ? 'flex flex-col items-center gap-3' : 'grid grid-cols-2 items-end w-full'">
          <!-- col 1: Admin Dashboard (if admin) + Logout -->
          <div class="flex flex-col items-start gap-1">
            <UTooltip v-if="isUserAdmin" text="Admin Dashboard">
              <UButton
                icon="i-lucide-shield"
                variant="link"
                size="xs"
                to="/admin"
                class="body-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                :ui="{
                  leadingIcon: 'text-secondary',
                  label: 'text-foreground font-bold',
                }"
                :label="collapsed ? undefined : 'Admin Dashboard'"
                :square="collapsed"
              />
            </UTooltip>
            <UTooltip text="Logout">
              <UButton
                icon="i-lucide-log-out"
                variant="link"
                size="xs"
                @click="logout"
                class="body-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                :ui="{
                  leadingIcon: 'text-secondary',
                  label: 'text-foreground font-bold',
                }"
                :label="collapsed ? undefined : 'Logout'"
                :square="collapsed"
              />
            </UTooltip>
          </div>
          <!-- col 2: Dark mode toggle -->
          <div class="flex items-end justify-end">
            <UColorModeButton
              class="hover:bg-white/5 rounded-md transition-colors"
              :ui="{ leadingIcon: 'text-foreground' }"
            />
          </div>
        </div>
      </TooltipProvider>
    </template>
  </UDashboardSidebar>
</template>
<script lang="ts" setup>
  import { TooltipProvider } from 'reka-ui';
  const { dashboardNavigationitems } = useDashboardNavigation();
  const { notificationCounts, fetchNotificationCounts } = useNotifications();
  const { clear, user } = useUserSession();

  const isUserAdmin = computed(() => user.value?.role === 'ADMIN');

  const notificationSlideoverOpen = ref(false);

  onMounted(() => {
    fetchNotificationCounts();

    nextTick(() => {
      const { query } = useRoute()

      if (query?.notifications === 'true') {
        notificationSlideoverOpen.value = true
      }
    })
  });

  const logout = async () => {
    await clear();
    navigateTo('/');
  };
</script>