<template>
  <nav aria-label="Site navigation">
    <ul class="header-desktop-nav">
      <li v-for="item of menu">
        <a href="#" class="header-desktop-nav__link">{{ item.label }}</a>
      </li>
    </ul>
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

</script>

<style lang="scss">
.header-desktop-nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-36);

  &__link {
    text-decoration: none;
    font-weight: var(--font-bold);
    font-size: var(--font-sm);
  }

}
</style>