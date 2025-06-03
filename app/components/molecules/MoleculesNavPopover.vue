<template>
  <div v-if="hasMenuItems" class="m-account-popover-wrapper">
    <!-- Mobile Burger Menu -->
    <button 
      type="button" 
      class="m-burger-menu-toggle"
      @click="toggleMobileMenu"
      aria-label="Toggle mobile menu"
      aria-expanded="false"
    >
      <div class="m-burger-menu-icon" :class="{ 'active': mobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <!-- Mobile Menu Overlay -->
    <div class="m-mobile-menu-overlay" :class="{ 'active': mobileMenuOpen }" @click="closeMobileMenu"></div>
    
    <!-- Mobile Menu Container -->
    <div class="m-mobile-menu-container" :class="{ 'open': mobileMenuOpen }">
      <div v-for="(group, index) in options" :key="`mobile-${index}`" class="m-mobile-menu-group">
        <div class="m-mobile-menu-header">
          <AtomsIcon width="24" height="24" :icon="group.icon" class="m-account-popover-icon" />
          <h3>{{ group.title }}</h3>
        </div>
        <ul class="m-mobile-menu-list">
          <li v-for="(item, idx) in group.items" :key="`mobile-item-${idx}`" class="m-mobile-menu-item">
            <AtomsIcon :name="item.icon" :icon="item.icon" height="16" width="16" />
            <NuxtLink v-if="!item.action" :to="item.url" class="m-mobile-menu-link | body-sm" @click="closeMobileMenu">
              {{ item.name }}
              <span v-if="item.countKey && getCount(item.countKey)" class="| body-xs font-bold">
                ({{ getCount(item.countKey) }})
              </span>
            </NuxtLink>
            <button v-else @click="handleMobileNavAction(item.action)" class="m-mobile-menu-link | body-sm">
              {{ item.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Desktop Menu -->
    <div v-for="(group, index) in options" :key="index" class="m-account-popover-container">
      <ul :id="`popover-${index}`" class="m-account-popover | box" popover>
        <li class="m-account-popover-listitem" v-for="(item, idx) in group.items" :key="idx">
          <AtomsIcon :name="item.icon" :icon="item.icon" height="16" width="16" />
          <NuxtLink v-if="!item.action" :to="item.url" class="m-account-popover-link | body-sm">
            {{ item.name }}
            <span v-if="item.countKey && getCount(item.countKey)" class="| body-xs font-bold"> ({{ getCount(item.countKey) }}) </span>
          </NuxtLink>
          <button v-else @click="handleNavAction(item.action)" class="m-account-popover-link | body-sm">
            {{ item.name }}
          </button>
        </li>
      </ul>

      <button type="button" class="m-account-popover-toggle | body-sm font-bold" :popovertarget="`popover-${index}`" aria-label="Expand menu">
        <AtomsIcon width="24" height="24" title="Menu icon" :icon="group.icon" class="m-account-popover-icon" />
        <span>{{ group.title }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationGroup } from "~~/shared/types/account";

const props = defineProps({
  options: {
    type: Array as PropType<NavigationGroup[]>,
    required: true,
  },
});

const { fetchAccountCounts, getCount } = useAccountCounts();
/**
 * Composables
 */
const { clear, user } = useUserSession();

/**
 * Mobile Menu State
 */
const mobileMenuOpen = ref(false);

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  mobileMenuOpen.value = false;
  document.body.style.overflow = '';
}

/**
 * Handle mobile navigation actions
 */
function handleMobileNavAction(action: string) {
  handleNavAction(action);
  closeMobileMenu();
}

/**
 *  Check options length
 */
const hasMenuItems = computed(() => {
  const { options } = props;

  return Array.isArray(options) && options.length;
});

/**
 * Logout
 */
async function logout() {
  await clear();
  navigateTo("/");
}

/**
 * Deletes the user account
 * Redirects to the home page after successful deletion
 * Shows an error notification if deletion fails
 * Shows a success notification if deletion is successful
 */
async function deleteAccount() {
  await $fetch("/auth/delete", {
    method: "DELETE",
  })
    .then(() => {
      clear();
      navigateTo("/");
    })
    .catch((error) => {
      console.error("Error deleting account:", error);
    });
}

/**
 * Handle navigation actions
 * @param {string} action - The action to perform
 */
function handleNavAction(action: string) {
  switch (action) {
    case "logout":
      logout();
      break;
    case "delete":
      deleteAccount();
      break;
    default:
      console.warn(`Action '${action}' not implemented`);
  }
}

onMounted(() => {
  // Fetch account counts when the component is mounted
  fetchAccountCounts();
});
</script>

<style scoped lang="scss">
@use "#styles/_utils/functions" as fn;

[popover] {
  position: absolute;
  inset: unset;
  /**
   *  @TODO
   *  Firefox and Safari do not yet support anchor positions, so will
   *  need to revisit interim solutions for this :(
   */
  top: calc(anchor(bottom) + var(--size-4));
  right: anchor(right);
}

.m-account-popover-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--size-16);
  margin: 0;
  padding: 0;
  position: relative;
}

/* Burger Menu Styles */
.m-burger-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: block;
  }
}

.m-burger-menu-icon {
  width: 30px;
  height: 24px;
  position: relative;
  
  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: var(--foreground-100);
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    
    &:nth-child(1) {
      top: 0px;
    }
    
    &:nth-child(2) {
      top: 10px;
    }
    
    &:nth-child(3) {
      top: 20px;
    }
  }
  
  &.active {
    span {
      &:nth-child(1) {
        top: 10px;
        transform: rotate(135deg);
      }
      
      &:nth-child(2) {
        opacity: 0;
        left: -60px;
      }
      
      &:nth-child(3) {
        top: 10px;
        transform: rotate(-135deg);
      }
    }
  }
}

/* Mobile Menu Overlay */
.m-mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--animation-fast) ease-out;
  
  &.active {
    opacity: 1;
    visibility: visible;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
}

/* Mobile Menu */
.m-mobile-menu-container {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 300px;
  background-color: var(--background-200, white);
  z-index: 1000;
  padding: var(--size-16);
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform var(--animation-fast) ease-out;
  
  &.open {
    transform: translateX(0);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
}

.m-mobile-menu-group {
  margin-bottom: var(--size-16);
  padding-bottom: var(--size-16);
  border-bottom: 1px solid var(--border-color, #eee);
  
  &:last-child {
    border-bottom: none;
  }
}

.m-mobile-menu-header {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  margin-bottom: var(--size-8);
  padding-top: var(--size-8);
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }
}

.m-mobile-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.m-mobile-menu-item {
  display: flex;
  align-items: center;
  gap: var(--size-5);
  color: var(--foreground-100);
  padding-left: var(--size-6);
  width: 100%;
  margin: var(--size-2) 0;
  border-radius: var(--border-radius-md);
  
  &:hover {
    background: var(--background-100);
  }
}

.m-mobile-menu-link {
  display: block;
  padding: var(--size-6) var(--size-14);
  white-space: nowrap;
  text-decoration: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  transition: background-color var(--animation-fast);
  color: var(--foreground-100);
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

/* Desktop Menu */
.m-account-popover-container {
  display: flex;
  flex-direction: row;
  gap: var(--size-8);
  margin: 0;
  padding: 0;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
}

.m-account-popover-toggle {
  padding: 0;
  margin: 0;
  border: 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: var(--size-6);
}

.m-account-popover-icon {
  display: block;
  width: var(--size-28);
  height: var(--size-28);
}

.m-account-popover {
  list-style: none;
  margin: 0;
  min-width: 14ch;
  padding: var(--size-8);
  border-radius: var(--border-radius-lg);
}

.m-account-popover-listitem {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--size-5);
  color: var(--foreground-100);
  padding-left: var(--size-6);
  width: 100%;

  &:hover {
    background: var(--background-100);
  }
}

.m-account-popover-link {
  display: block;
  padding: var(--size-6) var(--size-14);
  white-space: nowrap;
  text-decoration: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  transition: background-color var(--animation-fast);
}

/**
 *  Open animations
 */
/* Commenting out @starting-style as it's causing compilation issues */
/* @starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: translateY(-1em);
  }
} */

[popover]:popover-open {
  transition: opacity var(--animation-fast) ease-out, transform var(--animation-fast) ease-out;
  animation: popoverFadeIn var(--animation-fast) ease-out;
}

@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: translateY(-1em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
