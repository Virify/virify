<template>
  <section v-if="description" class="listing-general-info">
    <h3 class="listing-general-info__title | title-md">Property Description</h3>
    <p class="listing-general-info__description | body-md">{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
interface Props {
  description?: string
}

defineProps<Props>()
</script>

<style lang="scss">
.listing-general-info {
  padding: var(--size-16);
  border-radius: var(--border-radius-2xl);
  // border: 1px solid var(--border-color, #e5e7eb);
}
</style>