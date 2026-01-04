<template>
  <figure v-if="imageSrc" class="account-card-image" :class="{
    'account-card-image--with-note': hasNote}">
    <AtomsCloudFlareImage :src="imageSrc" alt="Property image" variant="thumbnail" :placeholder="true" />
  </figure>
</template>

<script setup lang="ts">
interface Props {
  imageSrc?: string | null;
  hasNote?: boolean;
}

const props= defineProps<Props>();
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.account-card-image {
  height: 100%;
  // max-height: 120px;
  flex: 0 0 auto;
  aspect-ratio: 4 / 3;
  width: auto;
  box-sizing: border-box;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  position: relative;
  margin: 0;

  &--with-note {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  @include mq.mobile-only {
    width: 100%;
    height: auto;
    max-height: none;
    flex: 0 0 auto;
    aspect-ratio: 4 / 3;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>
