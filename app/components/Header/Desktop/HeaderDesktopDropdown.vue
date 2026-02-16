<template>
  <div ref="$root" class="header-desktop-dropdown">
    <button ref="$button" type="button" @click.prevent="showDropdown" class="header-desktop-dropdown__toggle | body-md"
      :aria-controls="dropdownId" :aria-expanded="isExpanded">
      {{ label }}

      <AtomsIcon icon="chevron-down" />
    </button>

    <div ref="$menu" :id="dropdownId" :hidden="!isExpanded" class="header-desktop-dropdown__menu">
      <HeaderDesktopMegaMenu v-if="containsSubdropdowns" :menu="children" />
      <HeaderDesktopNormalMenu v-else :children />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, useFocusWithin } from '@vueuse/core'

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
}

/**
 *  Close on click outside
 */
onClickOutside($root, closeDropdown)

/**
 *  Close on focus leave
 */
const { focused } = useFocusWithin($root)

watch(focused, (isFocused) => {
  if (!isFocused) closeDropdown()
})

/**
 *  Close on esc key press
 */
function closeOnKeypress(e: KeyboardEvent) {
  if (e.key !== 'Escape') return

  e.preventDefault()

  closeDropdown()

  $button.value?.focus()
}

onMounted(() => {
  $root.value?.addEventListener('keydown', closeOnKeypress)
})

onBeforeUnmount(() => {
  $root.value?.removeEventListener('keydown', closeOnKeypress)
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
    left: calc(0px - var(--size-8));
    width: fit-content;
    background: var(--background-200);
    padding: var(--size-16) var(--size-24);
    margin: 0;
    list-style: none;
    border-radius: var(--border-radius-2xl);
    box-shadow: 0 30px 60px -20px light-dark(rgba(#000, 0.07), rgba(#000, 0.5));
    min-width: 24ch;

    &--grid {
      width: 60ch;
    }
  }
}
</style>