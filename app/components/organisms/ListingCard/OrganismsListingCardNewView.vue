<template>
  <nuxt-link :to="`/listing/${listingId}`" aria-label="View property details" title="View property details">
    <slot>
      <span class="| button button-tertiary button-full body-sm">View</span>
    </slot>
  </nuxt-link>
</template>

<script setup lang="ts">
interface Props {
  listingId: number;
}
defineProps<Props>();
</script>
<style scoped lang="scss">
.button {
  width: 100%;
  padding: var(--size-8);
  border-radius: var(--border-radius-lg);
  border-color: var(--secondary-400);
  box-sizing: border-box;
}
</style>
