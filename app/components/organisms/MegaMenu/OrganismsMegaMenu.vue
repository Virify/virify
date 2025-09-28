<template>
  <li 
    v-if="hasDropdown" 
    ref="dropdownRef"
    class="o-site-navigation__dropdown"
  >
    <nuxt-link 
      ref="triggerRef" 
      :to="item.href || '#'" 
      class="o-site-navigation-link | button button-quiet button-xs"
      @mouseenter="openMenu"
      @focus="openMenu"
      @click="handleLinkClick"
      :aria-expanded="isOpen" 
      aria-haspopup="true"
      :aria-controls="menuId"
    >
      <AtomsIcon v-if="item.icon" :icon="item.icon" width="16" height="16" class="o-site-navigation__icon" />
      {{ item.label }}
    </nuxt-link>

    <div 
      :id="menuId" 
      ref="menuRef" 
      class="o-site-navigation__dropdown-menu o-site-navigation__mega"
      :class="menuStateClasses" 
      role="menu" 
      :aria-hidden="!isOpen" 
      :inert="!isOpen"
      @mouseleave="handleMouseLeave"
    >
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
  <li v-else class="o-site-navigation__item">
    <nuxt-link :to="item.href || '#'" class="o-site-navigation-link | button button-quiet button-xs">
      <AtomsIcon 
        v-if="item.icon" 
        :icon="item.icon" 
        width="16" 
        height="16" 
        class="o-site-navigation__icon"
      />
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

// Computed
const categories = computed<NavigationSubItem[]>(() => props.item.children ?? []);
const hasDropdown = computed(() => props.item.type === "dropdown" && categories.value.length > 0);
const defaultCategoryId = computed(() => categories.value[0]?.id ?? null);
const isSingleColumn = computed(() => !categories.value.some((category) => Array.isArray(category.children) && category.children.length > 0));
const menuId = computed(() => `mega-menu-${props.item.id}`);
const isOpen = computed(() => props.dropdown.openItemId.value === props.item.id);
const activeCategoryId = computed(() => props.dropdown.activeCategoryId.value);

const activeGuides = computed(() => {
  if (!hasDropdown.value) return [];
  const activeCategory = categories.value.find((category) => category.id === activeCategoryId.value) ?? categories.value[0];
  return activeCategory?.children ?? [];
});

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
function handleLinkClick(event: Event) {
  // Prevent navigation when menu is closed, allow when open
  if (!isOpen.value) {
    event.preventDefault();
  } else {
    closeMenu();
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
 * Handles mouse leave from the entire dropdown area
 */
function handleMouseLeave() {
  if (isOpen.value) {
    closeMenu();
  }
}
</script>

<style lang="scss" scoped>
.o-site-navigation {
  &__dropdown {
    position: static;
  }

  &__dropdown-menu {
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

  &__mega {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: var(--size-8);
    min-width: 600px;
    width: 600px;
    align-items: stretch;

    &-divider {
      width: 1px;
      background-color: var(--secondary-400);
    }

    &-col {
      display: flex;
      flex-direction: column;
      gap: var(--size-4);
    }

    &--single {
      display: flex;
      flex-wrap: wrap;
      gap: var(--size-8);
      min-width: 0;
      width: fit-content;
      justify-content: center;
      align-items: center;

      .o-site-navigation__mega-col--single {
        display: contents;
      }

      .o-site-navigation__dropdown-link {
        width: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
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
