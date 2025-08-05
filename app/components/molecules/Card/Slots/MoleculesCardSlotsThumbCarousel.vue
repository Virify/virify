<template>
  <div ref="$root" role="presentation" class="m-card-slots-gallery-carousel">
    <MoleculesCardSlotsCarousel class="m-card-slots-gallery-carousel__main" :slides v-model="currentSlide" />

    <div class="m-card-slots-gallery-carousel__thumbnails">
      <template v-if="!isActive">
        <div v-for="i of 10" class="m-card-slots-gallery-carousel__skeleton-thumbnail | skeleton"></div>
      </template>

      <MoleculesNewCarousel :slides :embla-options="thumbnailOptions" :pagination="false" :navigation="false"
        class="m-card-slots-gallery-carousel__thumbnail-carousel" v-slot="{ slide, slideIndex }">
        <button @click.prevent="goToSlide(slideIndex)" class="m-card-slots-gallery-carousel__thumbnail-button" :class="{
          'm-card-slots-gallery-carousel__thumbnail-button--active': slideIndex === currentSlide - 1
        }">
          <nuxt-img :src="slide?.image" :alt="slide?.alt" class="m-card-slots-gallery-carousel__thumbnail"
            loading="lazy" />
        </button>
      </MoleculesNewCarousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import type { MediaSlide } from './MoleculesCardSlotsCarousel.vue'
import type { EmblaOptionsType } from 'embla-carousel'

interface Props {
  slides: MediaSlide[]
}

defineProps<Props>()

/**
 *  Thumbnail options
 */
const thumbnailOptions: EmblaOptionsType = {
  axis: 'x',
}

/**
 *  Change slide
 */
const currentSlide = ref(1)

function goToSlide(newIndex: number) {
  console.log({ newIndex })
  currentSlide.value = newIndex + 1
}

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
@use 'sass:math';

.m-card-slots-gallery-carousel {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--size-12);
  align-items: center;
  justify-content: center;
  padding: var(--size-16);
  box-sizing: border-box;
  flex: 1 1 auto;
  aspect-ratio: 560/351;
  overflow: hidden;

  @container style(--card-layout: vertical) {
    padding-bottom: 0;
  }

  @container style(--card-layout: horizontal) {
    padding-right: 0;
  }

  &__main {
    width: auto;
    height: 100%;
    aspect-ratio: 4/3;
  }

  &__thumbnails {
    display: flex;
    gap: var(--size-12);
    flex-direction: column;
    overflow: auto;
    height: 100%;
  }

  &__thumbnail-carousel .m-new-carousel__window {
    gap: var(--size-10);
  }

  &__thumbnail-button {
    padding: 0;
    margin: 0;
    border: 3px solid transparent;
    background: none;
    overflow: hidden;

    &--active {
      border-color: var(--secondary-400);
    }
  }

  &__thumbnail,
  &__skeleton-thumbnail {
    width: 100%;
    height: auto;
    flex: 1 0 auto;
    aspect-ratio: 4/3;
  }

  &__thumbnail {
    display: block;
  }

  @container (width < 740px) {
    grid-template-columns: 1fr;
    aspect-ratio: unset;

    &__main {
      width: 100%;
      height: auto;
    }

    &__thumbnails {
      flex-direction: row;
    }

    &__thumbnail,
    &__skeleton-thumbnail {
      width: calc(25% - var(--size-10));
      height: auto;
      aspect-ratio: 4/3;
    }
  }

  /**
   *  Fix border radius
   */
  &__thumbnail-button,
  &__skeleton-thumbnail,
  &__main {
    border-radius: var(--border-radius-xl);
  }
}
</style>