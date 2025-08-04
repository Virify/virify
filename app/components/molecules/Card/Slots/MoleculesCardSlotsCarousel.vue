<template>
  <div role="presentation" class="m-card-slots-carousel" ref="$root">
    <nuxt-img v-if="!isActive" :src="currentSlide?.image" :alt="currentSlide?.alt" class="m-card-slots-carousel__slide"
      loading="lazy" />

    <MoleculesNewCarousel v-else :slides v-slot="{ slide }" v-model="currentIndex">
      <nuxt-img :src="slide?.image" :alt="slide?.alt" class="m-card-slots-carousel__slide" loading="lazy" />
    </MoleculesNewCarousel>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

export interface MediaSlide {
  image: string
  alt: string
  [key: string]: unknown
}

interface Props {
  slides: MediaSlide[]
}

const props = defineProps<Props>()

/**
 *  Current slide
 */
const currentIndex = ref(1)

const currentSlide = computed(() => {
  const { slides } = asObject(props)

  return asArray(slides)[currentIndex.value] as unknown as MediaSlide
})

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
    display: block;
    background: var(--monochrome-300) url('/img/spinner.svg') no-repeat center;
    background-size: var(--size-48) var(--size-48);
    aspect-ratio: 4/3;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>