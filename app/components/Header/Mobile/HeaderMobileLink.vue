<template>
  <nuxt-link :to="href" class="header-mobile-link | body-md">
    {{ label }}

    <AtomsIcon v-if="isViewAll" icon="arrow-right" />
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
.header-mobile-link {
  display: flex;
  align-items: center;
  gap: var(--size-8);
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

  .a-icon {
    display: block;
    flex-shrink: 0;
    width: var(--size-20);
    height: var(--size-20);
  }
}
</style>