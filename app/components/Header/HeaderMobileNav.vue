<template>
  <nav class="header-mobile-nav">
    <button type="button" @click.prevent="toggleMenu" aria-label="Expand mobile menu" class="header-mobile-nav__toggle"
      :class="{
        'header-mobile-nav__toggle--expanded': isExpanded
      }">
      <span class="header-mobile-nav__toggle-line header-mobile-nav__toggle-line--1"></span>
      <span class="header-mobile-nav__toggle-line header-mobile-nav__toggle-line--2"></span>
      <span class="header-mobile-nav__toggle-line header-mobile-nav__toggle-line--3"></span>
    </button>

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

</script>

<style lang="scss">
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
    background: var(--monochrome-200);
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
}
</style>