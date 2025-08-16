<template>
  <nav class="mobile-bottom-nav" role="navigation" aria-label="Mobile bottom navigation">
    <ul>
      <li class="bottom-nav-item" @click="$emit('toggleMenu')" :class="{ 'active': isMobileMenuOpen }">
        <AtomsIcon icon="read-more" size="28" />
        <span class="nav-label | body-xs">Menu</span>
      </li>
      <li class="bottom-nav-item" :class="{ 'current-page': $route.path === '/account' || $route.path === '/account/' }">
        <NuxtLink to="/account" class="nav-link" @click="$emit('closeBoth')">
          <AtomsIcon icon="property/house" size="28" />
          <span class="nav-label | body-xs">Dashboard</span>
        </NuxtLink>
      </li>
      <li class="bottom-nav-item" :class="{ 'current-page': $route.path === '/account/messages' }">
        <NuxtLink to="/account/messages" class="nav-link">
          <div class="icon-wrapper">
            <AtomsIcon icon="account/chat" size="28" />
            <span v-if="chatNotificationCount > 0" class="notification-badge | body-xs font-semibold">
              {{ chatNotificationCount > 99 ? '99+' : chatNotificationCount }}
            </span>
          </div>
          <span class="nav-label | body-xs">Chat</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  isMobileMenuOpen: boolean
}>()

defineEmits<{
  toggleMenu: []
  closeBoth: []
}>()

// Use notifications aggregate for unread messages count
const { getAggregateCount } = useNotifications()

// Get unread messages count from aggregates
const chatNotificationCount = computed(() => {
  return getAggregateCount('unreadMessages') || 0
})
</script>

<style lang="scss" scoped>
.mobile-bottom-nav {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--background-200);
    padding: var(--size-16);
    padding-bottom: calc(var(--size-16) + env(safe-area-inset-bottom));
    z-index: 1001;
    box-shadow: 0 -10px 8px rgba(0, 0, 0, 0.1);
    justify-content: space-around;
    align-items: center;
    min-height: var(--mobile-nav-height);
  }

  ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-4);
    padding: var(--size-8);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    min-width: 60px;
    color: var(--foreground-100);

    &.active {
      color: var(--secondary-500);
    }

    &.current-page {
      color: var(--secondary-400);
    }

    .nav-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--size-4);
      text-decoration: none;
      color: inherit;
    }

    :deep(svg) {
      color: inherit;
    }

    .nav-label {
      color: inherit;
    }

    .icon-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .notification-badge {
      position: absolute;
      top: -12px;
      left: 15px;
      background: var(--secondary-500);
      color: var(--monochrome-100);
      border-radius: 50%;
      height: var(--size-22);
      padding: var(--size-4) var(--size-8);
      display: flex;
      text-align: center;
    }
  }
}
</style>