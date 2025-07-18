<template>
  <div class="skeleton-image-wrapper" :class="{ 'is-loaded': isLoaded }">
    <nuxt-img
      v-bind="$attrs"
      @load="onImageLoad"
      @error="onImageError"
      :src="imgSrc"
      :data-loaded="isLoaded"
      class="skeleton-image"
    />
    <!-- No fallback image shown on error -->
  </div>
</template>

<script setup lang="ts">
// No fallbackSrc prop needed

const isLoaded = ref(false);
const hasError = ref(false);
const attrs = useAttrs();

const imgSrc = computed(() => {
  // If error, don't try to reload the original image
  return hasError.value ? '' : (attrs.src as string || '');
});

function onImageLoad() {
  isLoaded.value = true;
}

function onImageError() {
  hasError.value = true;
}
</script>

<style lang="scss" scoped>
.skeleton-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(90deg, var(--background-200) 25%, var(--background-300) 50%, var(--background-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &.is-loaded {
    background: none;
    animation: none;
  }
}

.skeleton-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;

  &[data-loaded="true"] {
    opacity: 1;
  }
}

// No fallback image styles

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>