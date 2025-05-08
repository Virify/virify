<template>
  <div role="presentation">
    <div class="m-listing-card-carousel embla" ref="emblaRef">
      <div class="embla-slides">
        <img v-for="i of 3" :src :alt class="m-listing-card-carousel-image embla-slide" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'

interface Props {
  src: string
  alt: string
}

defineProps<Props>()

const [emblaRef] = emblaCarouselVue()
</script>

<style>
.m-listing-card-carousel-image {
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