<template>
  <div role="presentation">
    <div class="embla" ref="emblaRef">
      <div class="embla-slides">
        <div class="embla-slide" v-for="(slide, slideIndex) of slides" :key="slideIndex">
          <slot v-bind="{ slide, slideIndex }"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'

const [emblaRef, emblaApi] = emblaCarouselVue({loop: true})


interface Props {
  slides?: any[]
}

defineProps<Props>()

// Expose the API for parent components
defineExpose({
  scrollPrev: () => emblaApi.value?.scrollPrev(),
  scrollNext: () => emblaApi.value?.scrollNext(),
  canScrollPrev: () => emblaApi.value?.canScrollPrev(),
  canScrollNext: () => emblaApi.value?.canScrollNext()
})
</script>

<style scoped>
.embla {
  overflow: hidden;
}

.embla-slides {
  display: flex;
  gap: var(--size-12);
}

.embla-slide {
  flex: 0 0 100%;
  min-width: 0;
  cursor: grab;
}

.embla-slide:active {
  cursor: grabbing;
}
</style>