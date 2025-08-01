<template>
  <div 
    class="skeleton-bar" 
    :class="{ 'skeleton-bar--loading': loading }"
    :style="loading && (width || height) ? { width: widthStyle, height: heightStyle } : undefined"
  >
    <div v-if="loading" class="skeleton-bar__shimmer"></div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: true
});

const widthStyle = computed(() => {
  return props.width ? `${props.width}px` : undefined;
});

const heightStyle = computed(() => {
  return props.height ? `${props.height}px` : undefined;
});
</script>

<style lang="scss" scoped>
.skeleton-bar {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-sm);
  display: inline-block;
  
  &--loading {
    background: var(--blue-400);
    min-height: 1rem;
    min-width: 2rem;
  }

  &__shimmer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--blue-400) 25%,
      var(--background-100) 50%,
      var(--blue-400) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>