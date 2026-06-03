<template>
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
      root: 'bg-background text-sm',
      body: 'border-none',
      content: 'bg-background',
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
          class="hover:bg-white/5 rounded-md transition-colors text-foreground"
        />
      </div>
    </template>

    <!-- sidebar content -->
    <template #default="{ collapsed }">
      <TooltipProvider :delay-duration="400">
        <!-- admin label -->
        <div
          v-if="!collapsed"
          class="flex items-center gap-2 px-2 pb-2 border-b border-white/20"
        >
          <UIcon name="i-lucide-shield-check" class="size-4 text-secondary shrink-0" />
          <p class="body-xs! text-foreground font-semibold">Admin Dashboard</p>
        </div>

        <!-- navigation menu -->
        <UNavigationMenu
          orientation="vertical"
          :items="adminNavigationItems"
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
          <template #list-leading>
            <UDashboardSidebarCollapse
              v-if="collapsed"
              class="hover:bg-background/90 rounded-md transition-colors text-foreground"
            />
          </template>
        </UNavigationMenu>
      </TooltipProvider>
    </template>

    <!-- sidebar footer -->
    <template #footer="{ collapsed }">
      <TooltipProvider :delay-duration="400">
        <div :class="collapsed ? 'flex flex-col items-center gap-3' : 'grid grid-cols-3 items-end w-full'">
          <!-- col 1: Export Data / Clear Cache / User Dashboard / Logout -->
          <div class="flex flex-col items-start gap-1">
            <UTooltip text="Export Waiting List">
              <UButton
                :icon="isExportingWaitingList ? 'i-lucide-loader-circle' : 'i-lucide-list'"
                variant="link"
                size="xs"
                :disabled="isExportingWaitingList"
                class="body-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                :ui="{
                  leadingIcon: 'text-secondary',
                  label: 'text-foreground font-bold',
                }"
                :label="collapsed ? undefined : 'Export Waiting List'"
                :square="collapsed"
                @click="exportWaitingList"
              />
            </UTooltip>
            <UTooltip text="Export Data">
              <UButton
                :icon="isExporting ? 'i-lucide-loader-circle' : 'i-lucide-download'"
                variant="link"
                size="xs"
                :disabled="isExporting"
                class="body-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                :ui="{
                  leadingIcon: 'text-secondary',
                  label: 'text-foreground font-bold',
                }"
                :label="collapsed ? undefined : 'Export Data'"
                :square="collapsed"
                @click="exportAll"
              />
            </UTooltip>
            <UTooltip :text="cacheBustStatus">
              <UButton
                :icon="bustState === 'loading' ? 'i-lucide-loader-circle' : 'i-lucide-trash-2'"
                variant="link"
                size="xs"
                :disabled="bustState === 'loading'"
                class="body-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                :ui="{
                  leadingIcon: bustState === 'success' ? 'text-green-500' : bustState === 'error' ? 'text-red-500' : 'text-secondary',
                  label: 'text-foreground font-bold',
                }"
                :label="collapsed ? undefined : 'Clear Cache'"
                :square="collapsed"
                @click="bustCache"
              />
            </UTooltip>
            <UTooltip text="User Dashboard">
              <UButton
                icon="i-lucide-layout-dashboard"
                variant="link"
                size="xs"
                to="/dashboard"
                class="body-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                :ui="{
                  leadingIcon: 'text-secondary',
                  label: 'text-foreground font-bold',
                }"
                :label="collapsed ? undefined : 'User Dashboard'"
                :square="collapsed"
              />
            </UTooltip>
            <UTooltip text="Logout">
              <UButton
                icon="i-lucide-log-out"
                variant="link"
                size="xs"
                class="body-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                :ui="{
                  leadingIcon: 'text-secondary',
                  label: 'text-foreground font-bold',
                }"
                :label="collapsed ? undefined : 'Logout'"
                :square="collapsed"
                @click="logout"
              />
            </UTooltip>
          </div>
          <!-- col 2: empty -->
          <div />
          <!-- col 3: Color mode -->
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
import { TooltipProvider } from "reka-ui";

const { adminNavigationItems } = useAdminNavigation();
const { isExporting, exportAll, isExportingWaitingList, exportWaitingList } = useAdminExport();
const { clear } = useUserSession();
const bustState = ref<'idle' | 'loading' | 'success' | 'error'>('idle');

const cacheBustStatus = computed(() => ({
  idle: 'Clear Cache',
  loading: 'Clearing cache…',
  success: 'Cache cleared!',
  error: 'Clear failed – check console',
}[bustState.value]));

async function bustCache() {
  if (bustState.value === 'loading') return;
  bustState.value = 'loading';
  try {
    await useRequestFetch()('/api/admin/cache', { method: 'POST' });
    bustState.value = 'success';
  } catch (e) {
    console.error('[Admin] Cache bust failed:', e);
    bustState.value = 'error';
  } finally {
    setTimeout(() => { bustState.value = 'idle'; }, 3000);
  }
}

const logout = async () => {
  await clear();
  navigateTo("/");
};
</script>
