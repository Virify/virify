<template>
  <figure v-if="imageSrc" class="recent-card-image" :class="{
    'recent-card-image--with-note': hasNote}">
    <AtomsCloudFlareImage :src="imageSrc" alt="Property image" variant="thumbnail" :placeholder="true" />
  </figure>
</template>

<script setup lang="ts">
interface Props {
  imageSrc?: string | null;
  hasNote?: boolean;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.recent-card-image {
  width: 120px;
  flex: 0 0 120px;
  align-self: stretch;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  position: relative;
  margin: 0;

  &--with-note {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  @include mq.mobile-only {
    width: 80px;
    flex: 0 0 80px;
  }

  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
