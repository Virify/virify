<template>
  <nuxt-link :to="href" class="header-desktop-link | body-md">
    {{ label }}
  </nuxt-link>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  href?: string
  isViewAll?: boolean
}

defineProps<Props>()

</script>

<style lang="scss">
.header-desktop-link {
  display: block;
  padding: var(--size-8) var(--size-16);
  font-weight: var(--font-bold);
  color: currentColor;
  text-decoration: none;
  transition: color var(--animation-fast);

  &:hover {
    background: transparent;
    color: var(--primary-400);
  }
}
</style>