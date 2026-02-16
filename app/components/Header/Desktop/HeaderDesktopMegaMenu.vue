<template>
  <ul class="header-desktop-mega-menu">
    <li v-for="{ label, children } of menu">
      <h3 class="header-desktop-mega-menu__title | title-xs">
        {{ label }}
      </h3>

      <!--
        @TODO - make this so it can show nested dropdowns or links
      -->
      <ul class="header-desktop-mega-menu__sub-menu">
        <li v-for="{ label, href } of children">
          <nuxt-link :to="href" class="| body-md">
            {{ label }}
          </nuxt-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
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
  menu?: MenuItem[]
}

defineProps<Props>()

</script>

<style lang="scss">
.header-desktop-mega-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  columns: 4;
  column-gap: var(--size-24);
  min-width: 70ch;

  >* {
    break-inside: avoid;
  }

  &__title {
    margin: 0 0 var(--size-10);
  }

  &__sub-menu {
    list-style: none;
    margin: 0 0 var(--size-24);
    padding: 0;
  }
}
</style>