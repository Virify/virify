<template>
  <nav class="header-mobile-nav" aria-label="Site navigation">
    <button type="button" @click.prevent="toggleMenu" aria-label="Expand mobile menu" class="header-mobile-nav__toggle"
      :class="{
        'header-mobile-nav__toggle--expanded': isExpanded
      }" :aria-controls="menuId" :aria-expanded="isExpanded">
      <span class="header-mobile-nav__toggle-line header-mobile-nav__toggle-line--1" aria-hidden></span>
      <span class="header-mobile-nav__toggle-line header-mobile-nav__toggle-line--2" aria-hidden></span>
      <span class="header-mobile-nav__toggle-line header-mobile-nav__toggle-line--3" aria-hidden></span>
    </button>

    <div :id="menuId" class="header-mobile-nav__menu" :hidden="!isExpanded">
      <div v-if="search || isAdmin" class="header-mobile-nav__menu-search | container">
        <HeaderActionsSearch />
      </div>

      <HeaderMobileMenu :menu class="header-mobile-nav__menu-list | container" />
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 *  @TODO - move to shared folder to ensure types stay in sync
 */
interface MenuItem {
  id?: string
  label?: string
  href?: string
  description?: string
  icon?: string
  type?: 'link' | 'dropdown'
  children?: MenuItem[]
}

interface Props {
  menu: MenuItem[]
}

defineProps<Props>()


/**
 *  Toggle menu
 */
const isExpanded = shallowRef(false)

function toggleMenu() {
  isExpanded.value = !isExpanded.value
}

/**
 *  Close menu on page change
 */
watch(useRoute(), () => {
  isExpanded.value = false
})

/**
 *  a11y
 */
const menuId = useId()

/**
 *  @TODO - add focus trap when menu is open
 * 
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

// ...

const $menu = useTemplateRef('$menu')

const { activate, deactivate } = useFocusTrap($menu)

watch(isExpanded, (newState) => {
  newState ? activate() : deactivate()
})
*/

/**
 *  Conditionally allow search bar
 */
const { search, isAdmin } = useFeatureFlag();

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.header-mobile-nav {
  &__toggle {
    display: block;
    position: relative;
    width: var(--size-28);
    height: var(--size-28);
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  &__toggle-line {
    position: absolute;
    top: calc(50% - 1px);
    left: calc(50% - 10px);
    width: 20px;
    height: 3px;
    background: light-dark(var(--monochrome-200), var(--monochrome-900));
    border-radius: 2px;
    transition: transform var(--animation-slow) var(--bounce-out);

    &--1 {
      transform: translateY(-7px);
    }

    &--3 {
      transform: translateY(7px);
    }
  }

  &__toggle--expanded &__toggle-line--1 {
    transform: rotate(45deg);
  }

  &__toggle--expanded &__toggle-line--2,
  &__toggle--expanded &__toggle-line--3 {
    transform: rotate(-45deg);
  }

  &__menu {
    position: fixed;
    top: var(--header-height);
    left: 0;
    width: 100%;
    height: calc(100% - var(--header-height));
    overflow: auto;
    overscroll-behavior: contain;
    background: var(--background-200);
    z-index: -1;
  }

  &__menu-list {
    list-style: none;
    padding: 0 var(--size-4) var(--size-48);
    border: 0;
  }

  &__menu-search {
    padding: var(--size-24) var(--size-4);

    .header-actions-search {
      font-size: var(--font-md);
      padding: var(--size-8) var(--size-16);
      width: 100%;
      box-sizing: border-box;

      .a-icon {
        width: var(--size-24);
        height: var(--size-24);
      }
    }
  }
}
</style>