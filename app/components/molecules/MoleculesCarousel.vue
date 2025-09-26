<template>
  <div class="embla-wrapper" role="presentation">
    <div class="embla" ref="emblaRef">
      <div class="embla-slides">
        <div class="embla-slide" v-for="(slide, slideIndex) of slides" :key="slideIndex">
          <slot v-bind="{ slide, slideIndex }"></slot>
        </div>
      </div>
    </div>
    
    <!-- Navigation Arrows -->
    <template v-if="showArrows">
      <button
        class="embla-prev"
        @click="scrollPrev"
        :disabled="!canScrollPrev"
      >
        <AtomsIcon icon="chevron-left" :size="24" />
      </button>
      <button
        class="embla-next"
        @click="scrollNext"
        :disabled="!canScrollNext"
      >
        <AtomsIcon icon="chevron-right" :size="24" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'

interface Props {
  slides?: any[]
  slideSize?: string // e.g., '280px', '50%', 'auto'
  gap?: string // e.g., 'var(--size-16)', '1rem'
  loop?: boolean
  showArrows?: boolean // Show navigation arrows
  options?: any // Additional Embla options
  buttonSize?: string // Size of navigation buttons in pixels
}

const props = withDefaults(defineProps<Props>(), {
  slideSize: '100%',
  gap: 'var(--size-12)',
  loop: true,
  showArrows: false,
  buttonSize: "40px",
  options: () => ({})
})

const emblaOptions = computed(() => ({
  loop: props.loop,
  align: 'start',
  containScroll: 'trimSnaps',
  dragFree: true,
  ...props.options
}))

const [emblaRef, emblaApi] = emblaCarouselVue(emblaOptions)

// Arrow navigation state
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

// Navigation functions
function scrollPrev() {
  emblaApi.value?.scrollPrev()
}

function scrollNext() {
  emblaApi.value?.scrollNext()
}

function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index)
}

// Update navigation state
function updateNavigation() {
  if (emblaApi.value) {
    canScrollPrev.value = emblaApi.value.canScrollPrev()
    canScrollNext.value = emblaApi.value.canScrollNext()
  }
}

// Watch for embla API changes and set up event listeners
watchEffect(() => {
  if (emblaApi.value) {
    updateNavigation()
    emblaApi.value.on('scroll', updateNavigation)
    emblaApi.value.on('reInit', updateNavigation)
  }
})

// Expose the API for parent components
defineExpose({
  scrollPrev,
  scrollNext,
  scrollTo,
  canScrollPrev: () => canScrollPrev.value,
  canScrollNext: () => canScrollNext.value,
  emblaApi: computed(() => emblaApi.value)
})
</script>

<style scoped>
.embla-wrapper {
  position: relative;
}

.embla {
  overflow: hidden;
}

.embla-slides {
  display: flex;
  gap: v-bind(gap);
  align-items: stretch;
}

.embla-slide {
  flex: 0 0 v-bind(slideSize);
  min-width: 0;
  cursor: grab;
}

.embla-slide:active {
  cursor: grabbing;
}

/* Navigation Arrows */
.embla-prev,
.embla-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: v-bind(buttonSize);
  height: v-bind(buttonSize);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 2;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.7);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.embla-prev {
  left: var(--size-12);
}

.embla-next {
  right: var(--size-12);
}
</style>