<template>
  <li 
    v-if="hasDropdown" 
    ref="dropdownRef"
    class="o-site-navigation__dropdown"
    @mouseenter="openMenu"
    @mouseleave="handleMouseLeave"
  >
    <button 
      ref="triggerRef" 
      type="button"
      class="o-site-navigation-link | button button-ghost button-sm"
      @click="handleButtonClick"
      @keydown="handleKeydown"
      :aria-expanded="isOpen" 
      aria-haspopup="true"
      :aria-controls="menuId"
    >
      <AtomsIcon v-if="item.icon" :icon="item.icon" width="16" height="16" class="o-site-navigation__icon" />
      {{ item.label }}
      <AtomsIcon icon="chevron-down" width="12" height="12" class="o-site-navigation__icon" />
    </button>

    <div 
      :id="menuId" 
      ref="menuRef" 
      class="o-site-navigation__dropdown-menu o-site-navigation__mega"
      :class="menuStateClasses" 
      role="menu" 
      :aria-hidden="!isOpen" 
      :inert="!isOpen"
    >
      <!-- Main Category Link Button -->
      <div class="o-site-navigation__mega-header" v-if="item.href">
        <NuxtLink
          v-if="item.href"
          :to="item.href"
          class="o-site-navigation__mega-main-link | button button-ghost button-sm"
          @click="handleMenuClose"
        >
          Browse all {{ item.label.toLowerCase() }}
        </NuxtLink>
      </div>

      <template v-if="isSingleColumn">
        <div class="o-site-navigation__mega-col o-site-navigation__mega-col--single">
          <OrganismsMegaMenuItem 
            v-for="link in categories" 
            :key="link.id" 
            :to="link.href || '#'" 
            :label="link.label"
            :icon="link.icon" 
            variant="single"
            @click="handleMenuClose"
          />
        </div>
      </template>
      <template v-else>
        <OrganismsMegaMenuLeft 
          :categories="categories" 
          :active-category-id="activeCategoryId"
          @select="handleCategorySelect"
          @close="handleMenuClose"
        />
        <div class="o-site-navigation__mega-divider"></div>
        <OrganismsMegaMenuRight 
          :guides="activeGuides" 
          @close="handleMenuClose"
        />
      </template>
    </div>
  </li>
  <li 
    v-else 
    class="o-site-navigation__item"
    @mouseenter="closeMenuIfOpen"
  >
    <nuxt-link :to="item.href || '#'" class="o-site-navigation-link | button button-ghost button-sm">
      {{ item.label }}
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  item: NavigationItem; 
  dropdown: NavigationDropdownControls
}>();

// Refs
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
let leaveTimeout: ReturnType<typeof setTimeout> | null = null;

// Computed
const categories = computed<NavigationSubItem[]>(() => props.item.children ?? []);
const hasDropdown = computed(() => props.item.type === "dropdown");
const defaultCategoryId = computed(() => categories.value[0]?.id ?? null);
const isSingleColumn = computed(() => {
  // If we have no categories, default to single column to match server state if data is missing
  if (categories.value.length === 0) return false;
  return !categories.value.some((category) => Array.isArray(category.children) && category.children.length > 0)
});
const menuId = computed(() => `mega-menu-${props.item.id}`);
const isOpen = computed(() => props.dropdown.openItemId.value === props.item.id);
const activeCategoryId = computed(() => props.dropdown.activeCategoryId.value);

const activeGuides = computed(() => {
  if (!hasDropdown.value) return [];
  const activeCategory = categories.value.find((category) => category.id === activeCategoryId.value) ?? categories.value[0];
  return activeCategory?.children ?? [];
});

const childHasChildren = (item: NavigationItem) => {
  return Array.isArray(item.children) && item.children[0] && item.children[0].children;
};

const menuStateClasses = computed(() => ({
  "is-visible": isOpen.value,
  "o-site-navigation__mega--single": isSingleColumn.value,
}));

// Use VueUse's onClickOutside to close menu when clicking outside
onClickOutside(dropdownRef, () => {
  if (isOpen.value) {
    closeMenu();
  }
});

/**
 * Watchers
 */
watch(
  () => props.dropdown.openItemId.value,
  (openId) => {
    if (!hasDropdown.value) return;
    if (openId === props.item.id && !props.dropdown.activeCategoryId.value && defaultCategoryId.value) {
      props.dropdown.setActiveCategory(defaultCategoryId.value);
    }
  },
  { immediate: true }
);

/**
 * Opens the dropdown menu.
 */
function openMenu() {
  if (!hasDropdown.value) return;
  
  // Clear any pending close timeout
  if (leaveTimeout) {
    clearTimeout(leaveTimeout);
    leaveTimeout = null;
  }
  
  props.dropdown.open(props.item.id, {
    trigger: triggerRef.value,
    defaultCategoryId: defaultCategoryId.value,
  });
}

/**
 * Closes the dropdown menu.
 */
function closeMenu() {
  props.dropdown.close({ returnFocus: false });
}

/**
 * Event Handlers
 */
function handleButtonClick() {
  // Button only opens menu, never closes it
  if (!isOpen.value) {
    openMenu();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    if (!isOpen.value) {
      openMenu();
      // Focus first menu item after opening
      nextTick(() => {
        const firstMenuItem = menuRef.value?.querySelector('a, button, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        firstMenuItem?.focus();
      });
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (!isOpen.value) {
      openMenu();
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    if (isOpen.value) {
      closeMenu();
    }
  }
}

/**
 * Handles category selection in the dropdown.
 * @param categoryId ID of the category to select
 */
function handleCategorySelect(categoryId: string | null) {
  props.dropdown.setActiveCategory(categoryId);
}

/**
 * Handles menu close from child components
 */
function handleMenuClose() {
  closeMenu();
}

/**
 * Close menu if any menu is currently open (for non-dropdown items)
 */
function closeMenuIfOpen() {
  if (props.dropdown.openItemId.value) {
    closeMenu();
  }
}

/**
 * Handles mouse leave from the entire dropdown area with delay
 */
function handleMouseLeave() {
  // Add a delay before closing to allow mouse to move into menu
  leaveTimeout = setTimeout(() => {
    if (isOpen.value) {
      closeMenu();
    }
  }, 300); // 300ms delay
}

// Clear timeout on cleanup
onUnmounted(() => {
  if (leaveTimeout) {
    clearTimeout(leaveTimeout);
  }
});
</script>

<style lang="scss" scoped>
.o-site-navigation {

  &-link {
    font-size: var(--font-xs);
  }

  &__dropdown {
    position: static;

    &-menu {
      position: absolute;
      top: calc(100% + 14px);
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--blue-400);
      border-radius: var(--border-radius-lg);
      padding: var(--size-16);
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease-in-out;
      z-index: 11;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      box-sizing: border-box;
      color: inherit;

      &.is-visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }
    }
  }

  &__mega {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: var(--size-8);
    min-width: 600px;
    width: 600px;
    align-items: stretch;

    &-header {
      grid-column: 1 / -1;
      padding: var(--size-6);
    }

    &-main-link {
      border-radius: var(--border-radius-lg);
      width: 100%;
      justify-content: center;
    }

    &-divider {
      width: 1px;
      background-color: var(--secondary-400);
    }

    &-col {
      display: flex;
      flex-direction: column;
      gap: var(--size-4);

      &--single {
        display: contents;
      }
    }

    &--single {
      display: flex;
      flex-direction: column;
      gap: var(--size-8);
      min-width: 0;
      width: fit-content;
      align-items: stretch;

      .o-site-navigation__mega-col--single {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-8);
        justify-content: flex-start;
        align-items: center;
      }

      .o-site-navigation__dropdown-link {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0;

        &:not(:last-child) {
          margin: 0;
        }
      }
    }
  }

  &__icon {
    margin-right: var(--size-4);
  }
}
</style>
