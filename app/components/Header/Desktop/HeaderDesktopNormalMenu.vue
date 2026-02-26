<template>
  <ul class="header-desktop-normal-menu">
    <li v-for="{ label, href } of children" class="header-desktop-normal-menu__item">
      <nuxt-link :to="href" class="header-desktop-normal-menu__link | body-md">
        {{ label }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface MenuItem {
  label?: string
  href?: string
}

interface Props {
  children?: MenuItem[]
}

const { children } = defineProps<Props>()

</script>

<style lang="scss">
.header-desktop-normal-menu {

  &__item {
    padding: var(--size-8) 0;
    line-height: var(--line-height-sm);
  }

  &__link {
    display: block;
    font-weight: var(--font-semisemibold);
    font-size: var(--font-md);
    color: currentColor;
    text-decoration: none;
    transition: color var(--animation-fast);

    &:hover {
      background: transparent;
      color: var(--secondary-400);
    }
  }
}
</style>