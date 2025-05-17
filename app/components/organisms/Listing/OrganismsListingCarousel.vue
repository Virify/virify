<template>
  <LazyMoleculesCarousel :slides="validatedSlides" hydrate-on-interaction="mouseover" class="o-listing-carousel"
    v-slot="{ slide: { image, metadata } }">
    <img :src="image" :alt="metadata" class="o-listing-carousel__image" :width loading="lazy" />
  </LazyMoleculesCarousel>
</template>

<script setup lang="ts">
interface Props {
  slides: { image: string, metadata: string }[]
  width?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400
})

/**
 *  Validate slides
 */
const validatedSlides = computed(() => {
  const { slides } = props

  // Check slides are the valid format...
  const slidesValid = Array.isArray(slides) && slides.every(isObject)

  // ...return slides, or empty array if not
  return slidesValid ? slides : []
})
</script>

<style lang="scss">
.o-listing-carousel {

  &__image {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
}
</style>