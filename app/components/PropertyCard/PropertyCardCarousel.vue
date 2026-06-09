<template>
  <div class="embla-wrapper">
    <div ref="emblaRef" class="embla" role="presentation">
      <div class="embla-slides">
        <div class="embla-slide" v-for="(slide, slideIndex) of slides" :key="slideIndex">
          <slot v-bind="{ slide, slideIndex }"></slot>
        </div>
      </div>
    </div>

    <div class="embla-current-slide embla-desktop-hover | body-2xs">
      {{ currentSlide }} of {{ slides.length }}
    </div>

    <template v-if="showArrows">
      <button class="embla-nav embla-prev embla-desktop-hover" aria-label="Previous slide" @click.prevent="scrollPrev">
        <AtomsIcon icon="arrow-left" />
      </button>

      <button class="embla-nav embla-next embla-desktop-hover" aria-label="Next slide" @click.prevent="scrollNext">
        <AtomsIcon icon="arrow-right" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";

interface Props {
  slides: string[]
  showArrows?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showArrows: true,
});

const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: true,
  dragFree: false,
  containScroll: 'trimSnaps'
});

function scrollPrev() {
  emblaApi.value?.scrollPrev();
}

function scrollNext() {
  emblaApi.value?.scrollNext();
}

/**
 *  Track current selected index
 */
const currentSlide = shallowRef(1)

const unwatch = watch(emblaApi, (api) => {
  if (!api) return

  api.on('select', ({ selectedScrollSnap }) => {
    currentSlide.value = selectedScrollSnap() + 1
  })

  unwatch()
})

</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.embla-wrapper {
  position: relative;
}

.embla {
  overflow: hidden;
}

.embla-slides {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  gap: 0;
}

.embla-slide {
  cursor: grab;
  flex: 0 0 100%;
  min-width: 0;

  &:active {
    cursor: grabbing;
  }
}

.embla-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: 0;
  border-radius: 50%;
  width: var(--size-32);
  height: var(--size-32);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--animation-fast) var(--ease-in-out);
  z-index: 2;
  cursor: pointer;

  @include mq.tablet {
    width: var(--size-36);
    height: var(--size-36);
  }

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.7);
  }

  .a-icon {
    width: var(--size-20);
    height: var(--size-20);
  }
}

.embla-prev {
  left: var(--size-6);

  @include mq.tablet {
    left: var(--size-12);
  }
}

.embla-next {
  right: var(--size-6);

  @include mq.tablet {
    right: var(--size-12);
  }
}

.embla-current-slide {
  position: absolute;
  bottom: var(--size-6);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--size-4) var(--size-10);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-semibold);
  margin: 0;

  @include mq.tablet {
    bottom: var(--size-12);
  }
}

@media (hover: hover) {
  .embla-desktop-hover {
    transition-property: background-color var(--animation-fast) var(--ease-in-out), opacity var(--animation-slow) var(--ease-in-out);
    opacity: 0;
  }

  .embla-wrapper:hover>.embla-desktop-hover {
    opacity: 1;
  }
}

@media (hover:none) {
  .embla-nav {
    display: none;
  }
}
</style>
