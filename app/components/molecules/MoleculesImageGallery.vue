<template>
  <div class="m-image-gallery">
    <div class="embla" ref="emblaRef">
      <div class="embla-slides">
        <div 
          class="embla-slide" 
          v-for="(image, index) in images" 
          :key="index"
          @click="openModal"
        >
          <div class="m-image-gallery__image-container">
            <AtomsCloudFlareImage
              :src="image.src"
              :alt="image.alt"
              variant="card"
              class="m-image-gallery__image"
              :placeholder="true"
            />
          </div>
        </div>
      </div>
      
      <!-- Navigation Arrows -->
      <button
        class="m-image-gallery__prev"
        @click="scrollPrev"
        :disabled="!canScrollPrev"
      >
        <AtomsIcon icon="chevron-left" :size="24" />
      </button>
      <button
        class="m-image-gallery__next"
        @click="scrollNext"
        :disabled="!canScrollNext"
      >
        <AtomsIcon icon="chevron-right" :size="24" />
      </button>
    </div>

    <!-- Thumbnails (Desktop only) -->
    <div class="m-image-gallery__thumbs" ref="emblaThumbsRef">
      <div class="m-image-gallery__thumbs-container">
        <button
          v-for="(image, index) in images"
          :key="index"
          class="m-image-gallery__thumb"
          :class="{ 'is-active': index === selectedIndex }"
          @click="onThumbClick(index)"
        >
          <div class="m-image-gallery__thumb-container">
            <AtomsCloudFlareImage
              :src="image.src"
              :alt="image.alt"
              variant="thumbnail"
              class="m-image-gallery__thumb-image"
              :placeholder="true"
            />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'

interface ImageData {
  src: string
  alt: string
}

interface Props {
  images: ImageData[]
}

interface Emits {
  (e: 'open-modal', imageIndex: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true })
const [emblaThumbsRef, emblaThumbsApi] = emblaCarouselVue({
  containScroll: 'keepSnaps',
  dragFree: true
})

const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function scrollPrev() {
  emblaApi.value?.scrollPrev()
}

function scrollNext() {
  emblaApi.value?.scrollNext()
}

function openModal() {
  const currentIndex = emblaApi.value?.selectedScrollSnap() || 0
  emit('open-modal', currentIndex)
}

function onThumbClick(index: number) {
  emblaApi.value?.scrollTo(index)
}

function updateSelection() {
  if (!emblaApi.value || !emblaThumbsApi.value) return
  
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
  canScrollPrev.value = emblaApi.value.canScrollPrev()
  canScrollNext.value = emblaApi.value.canScrollNext()
  emblaThumbsApi.value.scrollTo(selectedIndex.value)
}

onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on('select', updateSelection)
    emblaApi.value.on('reInit', updateSelection)
    updateSelection()
  }
})

onUnmounted(() => {
  if (emblaApi.value) {
    emblaApi.value.off('select', updateSelection)
    emblaApi.value.off('reInit', updateSelection)
  }
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.m-image-gallery {
  .embla {
    overflow: hidden;
    position: relative;
  }

  .embla-slides {
    display: flex;
    gap: var(--size-12);
  }

  .embla-slide {
    flex: 0 0 100%;
    min-width: 0;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &__image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    max-height: 70vh;
    border-radius: var(--border-radius-2xl);
    overflow: hidden;

    @include mq.notebook {
      aspect-ratio: 16/9;
      max-height: none;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-2xl);
  }

  &__prev,
  &__next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
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

  &__prev {
    left: var(--size-12);
  }

  &__next {
    right: var(--size-12);
  }

  &__thumbs {
    overflow: hidden;
    margin: var(--size-12) 0 var(--size-16) 0;
    display: none;

    @include mq.notebook {
      display: block;
    }
  }

  &__thumbs-container {
    display: flex;
    gap: var(--size-8);
  }

  &__thumb {
    flex: 0 0 auto;
    border: 2px solid transparent;
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s ease;
    padding: 0;

    &.is-active {
      border-color: var(--secondary-400);
    }

    &:hover {
      border-color: var(--secondary-400);
    }
  }

  &__thumb-container {
    position: relative;
    width: 175px;
    aspect-ratio: 16/9;
    overflow: hidden;
    border-radius: var(--border-radius-xl);
  }

  &__thumb-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}


// Hide thumbnails when in sidebar
.p-listing__sidebar-carousel .m-image-gallery {
  &__thumbs {
    display: none;
  }
}

</style>