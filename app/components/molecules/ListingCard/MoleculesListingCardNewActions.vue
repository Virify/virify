<template>
  <div class="m-listing-card-actions">
    <nuxt-link :to="`/listing/${listingId}`" target="_blank" class="| button button-ghost body-sm">
      View
    </nuxt-link>
    <button class="| button button-secondary body-sm">
      Enquire
    </button>
  </div>
</template>
<script setup lang="ts">
defineProps({
  listingId: {
    type: Number,
    required: true
  }
})
</script>
<style lang="scss">
.m-listing-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-8);
  width: 100%;

  .button {
    width: 100%;
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
    border-color: var(--secondary-400);
  }
}
</style>
