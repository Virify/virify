<template>
  <figure v-if="imageSrc" class="recent-card-image">
    <AtomsCloudFlareImage :src="imageSrc" alt="Property image" variant="thumbnail" :placeholder="true" />
  </figure>
</template>

<script setup lang="ts">
interface Props {
  imageSrc?: string | null;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.recent-card-image {
  width: 120px;
  flex: 0 0 120px;
  align-self: stretch;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  position: relative;
  margin: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
