<template>
  <div class="m-listing-amenities-preview">
    <div class="m-listing-amenities-preview__content">
      <slot name="content" />
    </div>
    <div v-if="showOverlay" class="m-listing-amenities-preview__overlay">
      <div class="m-listing-amenities-preview__cta">
        <slot name="overlay" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showOverlay?: boolean;
}

withDefaults(defineProps<Props>(), {
  showOverlay: true
});
</script>

<style lang="scss">
.m-listing-amenities-preview {
  position: relative;
  width: 100%;
  min-height: 300px;

  &__content {
    position: relative;
    z-index: 1;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: var(--size-16);
    justify-content: center;
    z-index: 2;
  }

  &__cta {
    background: url("/img/logo-background.svg") no-repeat right,
      var(--blue-400);
    background-size: auto 400%, cover;
    border-radius: var(--border-radius-xl);
    padding: var(--size-32);
    text-align: center;
    color: var(--monochrome-900);
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    margin: 0 var(--size-16);
  }
}
</style>