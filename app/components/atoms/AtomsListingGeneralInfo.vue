<template>
  <section v-if="description" class="listing-general-info">
    <h3 class="listing-general-info__title | title-md">Property Description</h3>
    <p class="listing-general-info__description | r-body-md-sm">{{ description }}</p>
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
  border-radius: var(--border-radius-2xl);
}
</style>