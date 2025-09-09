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
  width: 120px;
  flex: 0 0 120px;
  height: 100%;
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
    flex: 0 0 auto;
    aspect-ratio: 16 / 9;
    height: auto;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    aspect-ratio: 4 / 3;
  }
}
</style>
