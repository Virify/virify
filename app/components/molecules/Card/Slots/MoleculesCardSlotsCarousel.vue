<template>
  <div role="presentation" class="m-card-slots-carousel" ref="$root">
    <div v-if="!isActive" class="m-card-slots-carousel__slide">
      {{ slides[currentSlide - 1] }}
    </div>

    <MoleculesNewCarousel v-else :slides v-slot="{ slide }" v-model="currentSlide">
      <div class="m-card-slots-carousel__slide">
        {{ slide }}
      </div>
    </MoleculesNewCarousel>
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core'

const slides = Array.from({ length: 5 }).map((_, index) => {
  return 'Slide ' + (index + 1)
})

const currentSlide = ref(1)

/**
 *  Control hydration
 */
const isActive = ref(false)
const $root = useTemplateRef('$root')

const { stop } = useIntersectionObserver($root, ([entry]) => {
  const { isIntersecting } = asObject(entry)

  isActive.value = !!isIntersecting
})

onBeforeUnmount(() => {
  stop()
})

</script>

<style lang="scss">
.m-card-slots-carousel {
  width: 100%;
  flex-grow: 1;
  border-radius: calc(var(--border-radius-3xl) - 2px);
  overflow: hidden;

  &__slide {
    background: var(--monochrome-300);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--size-16);
    box-sizing: border-box;
    aspect-ratio: 4/3;
    color: var(--monochrome-900);
    flex-grow: 1;
  }
}
</style>