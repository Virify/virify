<template>
  <button class="| button button-xs" @click="$emit('add-to-favourites', listingId)">
    <Icon name="healthicons:heart-outline-24px" />
  </button>
</template>
<script setup lang="ts">
defineProps<{ listingId: number }>();
</script>