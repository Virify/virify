<template>
  <ul class="header-mobile-menu">
    <li v-for="{ type, href, label, children, icon, isViewAll } of validatedMenu">
      <HeaderMobileLink v-if="type === 'link'" :label :href :is-view-all />
      <HeaderMobileDropdown v-else-if="type === 'dropdown'" :label :href :children :icon />
    </li>
  </ul>
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
  isViewAll?: boolean
  type?: 'link' | 'dropdown'
  children?: MenuItem[]
}

interface Props {
  menu?: MenuItem[]
}

const props = defineProps<Props>()

/**
 *  Ensure menu exists, and is an array
 */
const validatedMenu = computed(() => asArray(props.menu))

</script>