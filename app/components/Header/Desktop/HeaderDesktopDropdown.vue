<template>
  <div ref="$root" class="header-desktop-dropdown" @keydown.escape="closeDropdown">
    <button ref="$button" type="button" @click.prevent="showDropdown" class="header-desktop-dropdown__toggle | body-md"
      :aria-controls="dropdownId" :aria-expanded="isExpanded">
      {{ label }}

      <AtomsIcon icon="chevron-down" />
    </button>

    <div ref="$menu" :id="dropdownId" :hidden="!isExpanded" class="header-desktop-dropdown__menu" :class="{
      'header-desktop-dropdown__menu--mega-menu': containsSubdropdowns
    }">
      <HeaderDesktopMegaMenu v-if="containsSubdropdowns" :menu="children" :label :href />
      <HeaderDesktopNormalMenu v-else :children />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

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
  icon?: string
  label?: string
  href?: string
  children?: MenuItem[]
}

const { children } = defineProps<Props>()

/**
 *  Set menu type, based on if dropdown contains sub-dropdowns
 * 
 *  @TODO - currently the mega menu just assumes that ALL children are
 *          sub-dropdowns. We should really change the below to be
 *          .every({ type } => ...) to reflect this, and have an
 *          alternative component (or adapt the 'normal menu' component)
 *          to reflect this potential state
 */
const containsSubdropdowns = asArray(children).some(({ type }) => {
  return type === 'dropdown'
})

/**
 *  a11y
 */
const dropdownId = useId()

/**
 *  Elements
 */
const $root = useTemplateRef('$root')
const $button = useTemplateRef('$button')
const $menu = useTemplateRef('$menu')

/**
 *  Dropdown toggle
 */
const isExpanded = shallowRef(false)

function showDropdown() {
  isExpanded.value = true

  // Get first anchor or button, then focus on it
  nextTick(() => {
    const focusElem = $menu.value?.querySelector('button,a') as HTMLAnchorElement | HTMLButtonElement

    focusElem?.focus()
  })
}

function closeDropdown() {
  isExpanded.value = false

  $button.value?.focus()
}

/**
 *  Close on click outside
 */
onClickOutside($root, () => closeDropdown)

/**
 *  Close menu on page change
 */
watch(useRoute(), () => {
  isExpanded.value = false
})

</script>

<style lang="scss">
.header-desktop-dropdown {
  position: relative;

  &__toggle {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    padding: var(--size-8) var(--size-10) var(--size-8) var(--size-16);
    font-weight: var(--font-bold);
    color: currentColor;
    text-decoration: none;
    transition: color var(--animation-fast);
    cursor: pointer;

    &:hover {
      background: transparent;
      color: var(--secondary-400);
    }

    .a-icon {
      display: block;
      flex-shrink: 0;
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__menu {
    position: absolute;
    top: 100%;
    left: calc(0px - var(--size-12));
    width: fit-content;
    background: var(--background-100);
    padding: var(--size-16) var(--size-28);
    margin: 0;
    list-style: none;
    border-radius: var(--border-radius-2xl);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: 0 20px 60px -20px light-dark(rgba(#000, 0.07), rgba(#000, 0.5));
    min-width: 24ch;

    &--mega-menu {
      padding: var(--size-16) var(--size-28) var(--size-28);
    }
  }
}
</style>