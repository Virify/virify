<template>
  <div class="m-listing-card-image">
    <img :src :alt class="m-listing-card-image-src" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
}

defineProps<Props>()
</script>

<style>
.m-listing-card-image-src {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0;
  padding: 0;
  border-radius: var(--border-radius-2xl);
  aspect-ratio: 4/3;
}
</style>