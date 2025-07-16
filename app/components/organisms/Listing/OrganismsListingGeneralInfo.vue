<template>
  <section v-if="description" class="listing-general-info">
    <h3 class="listing-general-info__title">Property Description</h3>
    <p class="listing-general-info__description">{{ description }}</p>
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
  padding: var(--size-16) var(--size-12);
  background: var(--background-200);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color, #e5e7eb);
}

.listing-general-info__title {
  margin-bottom: var(--size-8);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--foreground-900);
}

.listing-general-info__description {
  color: var(--foreground-800);
  line-height: 1.5;
  font-size: var(--font-size-md);
  margin: 0;
}
</style>