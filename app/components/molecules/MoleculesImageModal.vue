<template>
  <div class="gallery-modal" @click="handleBackdropClick">
    <!-- Close Button (Top Left) -->
    <button class="gallery-modal__close" @click="closeModal" aria-label="Close gallery">
      <AtomsIcon icon="cross" :size="24" />
    </button>

    <!-- Image Counter (Top Center) -->
    <div class="gallery-modal__counter">
      {{ currentIndex + 1 }} / {{ images.length }}
    </div>

    <!-- Main Image Display -->
    <div class="gallery-modal__main">
      <div class="gallery-modal__image-container">
        <AtomsCloudFlareImage
          :key="currentIndex"
          :src="currentImage.src"
          :alt="currentImage.alt"
          variant="marketing"
          class="aspect-3/4 w-full"
          :class="{ 'gallery-modal__image--zoomed': isZoomed }"
          eager
          @click.stop="toggleZoom"
        />
      </div>
    </div>


    <!-- Navigation Arrows -->
    <button
      v-if="currentIndex > 0"
      class="gallery-modal__nav gallery-modal__nav--prev"
      @click="navigateImage(-1)"
      aria-label="Previous image"
    >
      <AtomsIcon icon="chevron-left" :size="24" />
    </button>
    
    <button
      v-if="currentIndex < images.length - 1"
      class="gallery-modal__nav gallery-modal__nav--next"
      @click="navigateImage(1)"
      aria-label="Next image"
    >
      <AtomsIcon icon="chevron-right" :size="24" />
    </button>

  </div>
</template>

<script setup lang="ts">
interface ImageData {
  src: string
  alt: string
}

interface Props {
  images: ImageData[]
  initialIndex?: number
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

const emit = defineEmits<Emits>()

const currentIndex = ref(props.initialIndex)
const isZoomed = ref(false)

const currentImage = computed(() => {
  return props.images[currentIndex.value] || props.images[0] || { src: '', alt: '' }
})

function setCurrentIndex(index: number) {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index
    isZoomed.value = false // Reset zoom when changing images
  }
}

function navigateImage(direction: number) {
  const newIndex = currentIndex.value + direction
  setCurrentIndex(newIndex)
}

function toggleZoom() {
  isZoomed.value = !isZoomed.value
}

function handleBackdropClick(event: MouseEvent) {
  // Only close if clicking the backdrop, not the image or controls
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function closeModal() {
  emit('close')
}

// Handle keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      closeModal()
      break
    case 'ArrowLeft':
      navigateImage(-1)
      break
    case 'ArrowRight':
      navigateImage(1)
      break
    case ' ':
    case 'Enter':
      if (event.target === document.body) {
        event.preventDefault()
        toggleZoom()
      }
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.gallery-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  user-select: none;

  // Main image area
  &__main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-24);
    min-height: 0;
    height: 100%;

    @include mq.mobile-only {
      padding: var(--size-16);
    }
  }

  &__image-container {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    aspect-ratio: auto;
    cursor: zoom-in;
    transition: transform 0.3s ease, cursor 0.2s ease;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);

    &--zoomed {
      transform: scale(1.5);
      cursor: zoom-out;

      @include mq.mobile-only {
        transform: scale(1.2);
      }
    }
  }

  // Close button (Top Left)
  &__close {
    position: absolute;
    top: var(--size-24);
    left: var(--size-24);
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
    z-index: 1002;

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: scale(1.1);
    }

    &:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    @include mq.mobile-only {
      top: var(--size-16);
      left: var(--size-16);
      width: 40px;
      height: 40px;
    }
  }

  // Image counter (Top Center)
  &__counter {
    position: absolute;
    top: var(--size-24);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: var(--size-8) var(--size-16);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-sm);
    font-weight: 500;
    backdrop-filter: blur(10px);
    z-index: 1002;

    @include mq.mobile-only {
      top: var(--size-16);
      font-size: var(--font-size-xs);
      padding: var(--size-6) var(--size-12);
    }
  }

  // Navigation arrows
  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
    z-index: 1001;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
      transform: translateY(-50%) scale(1.1);
    }

    &--prev {
      left: var(--size-24);

      @include mq.mobile-only {
        left: var(--size-16);
      }
    }

    &--next {
      right: var(--size-24);

      @include mq.mobile-only {
        right: var(--size-16);
      }
    }

    @include mq.mobile-only {
      width: 44px;
      height: 44px;
    }
  }
}

// Smooth transitions for modal
.gallery-modal {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>