<template>
  <button class="| button button-xs" @click="$emit('remove-from-favourties', listingId)">
    <Icon name="material-symbols:delete" />
  </button>
</template>
<script setup lang="ts">
defineProps<{ listingId: number }>();
</script>