<template>
  <LazyMoleculesCarousel :slides="validatedSlides" hydrate-on-idle class="o-listing-carousel"
    v-slot="{ slide: { image, metadata } }">
    <img :src="image" :alt="metadata" class="o-listing-carousel__image" :width loading="lazy"
      :style="`--aspect-ratio: ${aspectRatio}`" />
  </LazyMoleculesCarousel>
</template>

<script setup lang="ts">
interface Props {
  slides: { image: string, metadata: string }[]
  width?: number
  aspectRatio?: `${number}/${number}` | number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  aspectRatio: '16/9'
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
    object-fit: cover;
    aspect-ratio: var(--aspect-ratio);
    max-height: 70dvh;
  }
}
</style>