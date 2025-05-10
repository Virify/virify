<template>
  <div role="presentation">
    <div class="embla" ref="emblaRef">
      <div class="embla-slides">
        <div class="embla-slide" v-for="slide of slides">
          <slot v-bind="{ slide }"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'

const [emblaRef] = emblaCarouselVue()

interface Props {
  slides?: any[]
}

defineProps<Props>()
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