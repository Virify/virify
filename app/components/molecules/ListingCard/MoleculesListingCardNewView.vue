<template>
  <nuxt-link :to="`/listing/${listingId}`" class="| button button-secondary body-sm" 
             aria-label="View property details" title="View property details">
    View
  </nuxt-link>
</template>

<script setup lang="ts">
interface Props {
  listingId: number;
}
defineProps<Props>();
</script>

