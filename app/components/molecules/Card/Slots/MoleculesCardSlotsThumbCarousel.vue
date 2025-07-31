<template>
  <div role="presentation" class="m-card-slots-gallery-carousel">
    <MoleculesCardSlotsCarousel class="m-card-slots-gallery-carousel__main" :slides />

    <div class="m-card-slots-gallery-carousel__thumbnails">
      <template v-if="!isActive">
        <div v-for="i of 10" class="m-card-slots-gallery-carousel__skeleton-thumbnail | skeleton"></div>
      </template>

      <div v-else>
        Thumbnails
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MediaSlide } from './MoleculesCardSlotsCarousel.vue'

interface Props {
  slides: MediaSlide[]
}

defineProps<Props>()

/**
 *  Control hydration of carousel
 */
const isActive = ref(false)

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

  &__skeleton-thumbnail {
    width: 100%;
    height: auto;
    flex: 1 0 auto;
    aspect-ratio: 4/3;
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

    &__skeleton-thumbnail {
      width: calc(25% - var(--size-10));
      height: auto;
      aspect-ratio: 4/3;
    }
  }

  /**
   *  Fix border radius
   */
  &__skeleton-thumbnail,
  &__main {
    border-radius: var(--border-radius-xl);
  }
}
</style>