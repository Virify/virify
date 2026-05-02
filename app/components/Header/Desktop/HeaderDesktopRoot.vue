<template>
  <nav aria-label="Site navigation" class="header-desktop-nav">
    <ul class="header-desktop-nav__menu">
      <li v-for="{ type, href, label, children } of menu">
        <HeaderDesktopLink v-if="type === 'link'" :href :label />
        <HeaderDesktopDropdown v-else-if="type === 'dropdown'" :label :href :children />
      </li>
      <li v-if="search || isAdmin" class="header-desktop-nav__menu-spacer">
        <HeaderActionsSearch show-shortcut />
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

const { search, isAdmin } = useFeatureFlag();

</script>

<style lang="scss">
.header-desktop-nav {

  &__menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-2);
  }

  &__menu-spacer {
    padding-left: var(--size-16);
  }
}
</style>