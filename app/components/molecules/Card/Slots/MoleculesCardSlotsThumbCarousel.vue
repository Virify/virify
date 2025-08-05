<template>
  <div ref="$root" role="presentation" class="m-card-slots-gallery-carousel">
    <MoleculesCardSlotsCarousel class="m-card-slots-gallery-carousel__main" :slides v-model="currentSlide" />

    <div ref="$thubmnails" class="m-card-slots-gallery-carousel__thumbnails" role="none">
      <template v-if="!isActive">
        <div class="m-card-slots-gallery-carousel__skeleton-thumbnails">
          <div v-for="i of 10" class="m-card-slots-gallery-carousel__skeleton-thumbnail | skeleton"></div>
        </div>
      </template>

      <MoleculesNewCarousel v-else :slides :embla-options="thumbnailOptions" :pagination="false" :navigation="false"
        class="m-card-slots-gallery-carousel__thumbnail-carousel" v-model="currentThumbnail"
        v-slot="{ slide, slideIndex }">
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
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core'
import type { MediaSlide } from './MoleculesCardSlotsCarousel.vue'
import type { EmblaOptionsType } from 'embla-carousel'

interface Props {
  slides: MediaSlide[]
}

defineProps<Props>()

/**
 *  Thumbnail options
 */
const thumbnailOptions: ComputedRef<EmblaOptionsType> = computed(() => {
  const axis = isVertical.value ? 'y' : 'x'

  return {
    loop: true,
    dragFree: true,
    axis
  }
})

/**
 *  Change slide
 */
const currentSlide = ref(1)
const currentThumbnail = ref(1)

function goToSlide(newIndex: number) {
  currentSlide.value = newIndex + 1
}

watch(currentSlide, (newIndex) => {
  currentThumbnail.value = newIndex
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

/**
 *  Control axis
 */
const isVertical = ref(false)
const $thubmnails = useTemplateRef('$thubmnails')

const { stop: stopResize } = useResizeObserver($thubmnails, ([entry]) => {
  const { width } = asObject(entry?.contentRect)

  isVertical.value = (width as number) < 200
})

onBeforeUnmount(() => {
  stop()
  stopResize()
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
    overflow: hidden;
    height: 100%;
  }

  /**
   * Skeleton thumbnails
   */
  &__skeleton-thumbnails {
    display: flex;
    gap: var(--size-12);
    flex-direction: column;
  }

  &__skeleton-thumbnail {
    width: 100%;
    height: auto;
    flex: 1 0 auto;
  }

  /**
   * Embla thumbnails
   */
  &__thumbnail-carousel {
    height: 100%;

    .m-new-carousel__window {
      height: 100%;
    }

    .m-new-carousel__slides {
      height: 100%;
      flex-direction: column;
    }

    .m-new-carousel__slide {
      min-height: 0;
      flex: 0 0 auto;
      padding: 0 0 var(--size-10);
    }
  }

  &__thumbnail-button {
    display: block;
    padding: 0;
    margin: 0;
    border: 3px solid transparent;
    background: none;
    overflow: hidden;
    width: 100%;

    &--active {
      border-color: var(--secondary-400);
    }
  }

  &__thumbnail {
    display: block;
    width: 100%;
    height: auto;
    background: var(--monochrome-300) url(/img/spinner.svg) no-repeat center;
    background-size: var(--size-28) var(--size-28);
  }

  /**
   * All thumbnails
   */
  &__thumbnail-button,
  &__skeleton-thumbnail,
  &__thumbnail {
    aspect-ratio: 4/3;
  }

  /**
   * Containers
   */
  @container (width < 740px) {
    grid-template-columns: 1fr;
    aspect-ratio: unset;

    &__main {
      width: 100%;
      height: auto;
    }

    /**
     * Skeleton thumbnails
     */
    &__skeleton-thumbnails {
      flex-direction: row;
    }

    &__skeleton-thumbnail {
      width: calc(25% - var(--size-10));
      height: auto;
    }

    /**
     * Embla thumbnails
     */
    &__thumbnail-carousel {
      .m-new-carousel__slides {
        flex-direction: row;
      }

      .m-new-carousel__slide {
        flex: 0 0 20%;
        padding: 0 var(--size-10) 0 0;
      }
    }
  }

  /**
   * Smaller containers
   */
  @container (width < 580px) {
    &__skeleton-thumbnail {
      width: calc(33% - var(--size-10));
    }

    &__thumbnail-carousel {
      .m-new-carousel__slide {
        flex: 0 0 25%;
      }
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