<template>
  <nuxt-link :to="href" class="header-mobile-link | body-md">
    {{ label }}
  </nuxt-link>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  href?: string
}

defineProps<Props>()

</script>

<style lang="scss">
.header-mobile-link {
  display: block;
  padding: var(--size-8) 0;
  font-weight: var(--font-bold);
  color: currentColor;
  text-decoration: none;
  line-height: var(--lineheight-sm);
  text-align: left;

  &:hover {
    background: transparent;
    color: currentColor;
  }
}
</style>