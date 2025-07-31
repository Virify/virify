<template>
  <div class="gallery-modal" @click="handleBackdropClick">
    <!-- Thumbnail Strip at Top -->
    <div class="gallery-modal__thumbnails">
      <div class="gallery-modal__thumbnails-container">
        <button
          v-for="(image, index) in images"
          :key="index"
          class="gallery-modal__thumbnail"
          :class="{ 'gallery-modal__thumbnail--active': index === currentIndex }"
          @click="setCurrentIndex(index)"
        >
          <nuxt-img
            :src="image.src"
            :alt="image.alt"
            class="gallery-modal__thumbnail-image"
            fit="cover"
            quality="60"
            :width="80"
            :height="60"
          />
        </button>
      </div>
    </div>

    <!-- Bottom Bar -->
    <AtomsBottomBar :title="currentImage.alt || 'Image'" @close="closeModal" />

    <!-- Main Image Display -->
    <div class="gallery-modal__main">
      <div class="gallery-modal__image-container">
        <nuxt-img
          :src="currentImage.src"
          :alt="currentImage.alt"
          class="gallery-modal__image"
          :class="{ 'gallery-modal__image--zoomed': isZoomed }"
          decoding="async"
          fit="contain"
          quality="95"
          sizes="95vw"
          @click.stop="toggleZoom"
        />
        
        <!-- Image Counter -->
        <div class="gallery-modal__counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
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
    padding: var(--size-80) var(--size-24) var(--size-24);
    min-height: 0;
    height: calc(100vh - var(--size-80) - var(--size-24));

    @include mq.mobile-only {
      padding: var(--size-60) var(--size-16) var(--size-16);
      height: calc(100vh - var(--size-60) - var(--size-16));
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
    object-fit: contain;
    border-radius: 0;
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


  // Image counter
  &__counter {
    position: absolute;
    top: var(--size-16);
    left: var(--size-16);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: var(--size-8) var(--size-12);
    border-radius: var(--border-radius-full);
    font-size: var(--t-font-sm);
    font-weight: 500;
    backdrop-filter: blur(10px);

    @include mq.mobile-only {
      font-size: var(--font-xs);
      padding: var(--size-6) var(--size-10);
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

  // Thumbnail strip at top
  &__thumbnails {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.8), transparent);
    padding: var(--size-24) var(--size-24) var(--size-40);
    backdrop-filter: blur(20px);
    z-index: 1001;

    @include mq.mobile-only {
      padding: var(--size-16) var(--size-16) var(--size-32);
    }
  }

  &__thumbnails-container {
    display: flex;
    gap: var(--size-8);
    justify-content: center;
    overflow-x: auto;
    padding: var(--size-4) 0;
    max-width: 100%;

    // Hide scrollbar
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    @include mq.mobile-only {
      gap: var(--size-6);
    }
  }

  &__thumbnail {
    background: none;
    border: 2px solid transparent;
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      border-color: rgba(255, 255, 255, 0.5);
      transform: scale(1.05);
    }

    &--active {
      border-color: white;
      transform: scale(1.1);
    }
  }

  &__thumbnail-image {
    width: 80px;
    height: 60px;
    object-fit: cover;
    display: block;

    @include mq.mobile-only {
      width: 60px;
      height: 45px;
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