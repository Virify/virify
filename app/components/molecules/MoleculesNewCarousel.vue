<template>
  <div role="presentation" class="m-new-carousel">
    <div class="m-new-carousel__window" ref="emblaRef">
      <div class="m-new-carousel__slides">
        <div class="m-new-carousel__slide" v-for="(slide, slideIndex) of slides" :key="slideIndex">
          <slot v-bind="{ slide, slideIndex }"></slot>
        </div>
      </div>
    </div>

    <template v-if="navigation">
      <button class="m-new-carousel__button m-new-carousel__button--prev" aria-label="Previous slide"
        @click.prevent="emblaApi?.scrollPrev">
        <AtomsIcon icon="chevron-left" aria-hidden="true" />
      </button>

      <button class="m-new-carousel__button m-new-carousel__button--next" aria-label="Next slide"
        @click.prevent="emblaApi?.scrollNext">
        <AtomsIcon icon="chevron-right" aria-hidden="true" />
      </button>
    </template>

    <span v-if="pagination" class="m-new-carousel__currents-slide | body-2xs">
      {{ currentSlide }} of {{ slides?.length }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { watchImmediate } from '@vueuse/core';
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType } from 'embla-carousel'

interface Props {
  pagination?: boolean
  navigation?: boolean
  emblaOptions?: EmblaOptionsType
  slides?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  pagination: true,
  navigation: true,
})

/**
 *  Set up carousel
 */
const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: true,
  ...asObject(props.emblaOptions)
})

/**
 *  Track current slide
 */
const currentSlide = defineModel({ default: 1 })

onMounted(() => {
  emblaApi.value?.on('select', ({ selectedScrollSnap }) => {
    currentSlide.value = 1 + selectedScrollSnap()
  })
})

watchImmediate(currentSlide, (newSlide) => {
  emblaApi.value?.scrollTo(newSlide - 1)
})

/**
 *  Reinit carousel when props change
 */
const { emblaOptions } = toRefs(props)

watch(emblaOptions, (newProps) => {
  emblaApi.value?.reInit({
    loop: true,
    ...asObject(newProps)
  })
})

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-new-carousel {
  position: relative;
  user-select: none;

  &__window {
    overflow: hidden;
  }

  &__button {
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
    z-index: 3;
    background: #{ fn.faded-color(66%, var(--monochrome-100))};
    color: var(--monochrome-900);
    border-radius: 100%;
    padding: var(--size-6);
    transition: background-color var(--animation-fast), opacity var(--animation-slow);

    &:hover {
      background-color: var(--secondary-400);
    }

    .a-icon {
      width: var(--size-28);
      height: var(--size-28);
    }

    &--prev {
      left: var(--size-12);
    }

    &--next {
      right: var(--size-12);
    }
  }

  /**
   *  Slides
   */
  &__slides {
    display: flex;
    gap: 0;
  }

  &__slide {
    flex: 0 0 100%;
    min-width: 0;
    cursor: grab;
    margin: 0;

    &:active {
      cursor: grabbing;
    }
  }

  /**
   *  Pagination
   */
  &__currents-slide {
    position: absolute;
    bottom: var(--size-12);
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    background: #{ fn.faded-color(66%, var(--monochrome-100))};
    color: var(--monochrome-900);
    padding: var(--size-6) var(--size-12);
    border-radius: var(--border-radius-pill);
    min-width: 6.5ch;
    text-align: center;
  }

  /**
   *  Only show arrows for mouse users
   */
  &__button {
    opacity: 0;
    pointer-events: none;
  }

  @media (hover: hover) {

    &:focus-within &__button,
    &:hover &__button {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>