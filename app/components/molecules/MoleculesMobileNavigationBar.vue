<template>
  <nav class="mobile-bottom-nav" role="navigation" aria-label="Mobile bottom navigation">
    <ul>
      <li class="bottom-nav-item" @click="$emit('toggleMenu')" :class="{ 'active': isMobileMenuOpen }">
        <AtomsIcon icon="read-more" size="24" />
        <span class="nav-label | body-sm">Menu</span>
      </li>
      <li class="bottom-nav-item active current-page">
        <AtomsIcon icon="property/house" size="24" />
        <span class="nav-label | body-sm">Dashboard</span>
      </li>
      <li class="bottom-nav-item" @click="console.log('Chat clicked')">
        <div class="icon-wrapper">
          <AtomsIcon icon="account/enquiry" size="24" />
          <span v-if="chatNotificationCount > 0" class="notification-badge | body-xs font-semibold">
            {{ chatNotificationCount > 99 ? '99+' : chatNotificationCount }}
          </span>
        </div>
        <span class="nav-label | body-sm">Chat</span>
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
}>()

// Use notifications composable to get chat/enquiry count
const { aggregates } = useNotifications()

// For chat notifications, we'll use enquiries count
const chatNotificationCount = computed(() => {
  return aggregates.value?.enquiries || 0
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
    background: var(--background-100);
    border-top: 1px solid var(--border-color, #e2e8f0);
    padding: var(--size-8) var(--size-16);
    z-index: 1001;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    justify-content: space-around;
    align-items: center;
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
    transition: all 0.2s ease;
    min-width: 60px;
    color: var(--foreground-200);

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &.active {
      color: var(--blue-400);
    }

    &.current-page {
      color: var(--secondary-400);
    }

    :deep(svg) {
      color: inherit;
      transition: color 0.2s ease;
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
      top: -8px;
      left: 15px;
      background: var(--error);
      color: var(--monochrome-900);
      border-radius: 50%;
      min-width: var(--size-22);
      height: var(--size-22);
      padding: var(--size-4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>