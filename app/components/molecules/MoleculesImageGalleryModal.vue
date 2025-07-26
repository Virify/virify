<template>
  <div class="image-gallery-modal" @click="closeModal">
    <div class="image-gallery-modal__backdrop" />
    
    <div class="image-gallery-modal__container" @click.stop>
      <!-- Close Button -->
      <div class="image-gallery-modal__header">
        <button class="image-gallery-modal__close" @click="closeModal">
          <AtomsIcon icon="cross" :size="24" />
        </button>
      </div>

      <!-- Normal Grid View -->
      <div v-if="expandedIndex === null" class="image-gallery-modal__grid">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="image-gallery-modal__grid-item"
          @click="expandImage(index)"
        >
          <nuxt-img
            :src="image.src"
            :alt="image.alt"
            class="image-gallery-modal__grid-image"
            decoding="async"
            :width="800"
            :height="600"
            fit="cover"
            quality="90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            placeholder="/img/preload.svg"
          />
          <div class="image-gallery-modal__overlay">
            <span class="image-gallery-modal__overlay-text">{{ image.alt }}</span>
          </div>
        </div>
      </div>

      <!-- Expanded View -->
      <div v-if="expandedIndex !== null && expandedImage" class="image-gallery-modal__expanded">
        <div class="image-gallery-modal__expanded-container">
          <nuxt-img
            :src="expandedImage.src"
            :alt="expandedImage.alt"
            class="image-gallery-modal__expanded-image"
            decoding="async"
            :width="1200"
            :height="900"
            fit="contain"
            quality="95"
            sizes="90vw"
            placeholder="/img/preload.svg"
          />
          <div class="image-gallery-modal__expanded-overlay">
            <span class="image-gallery-modal__expanded-text">{{ expandedImage.alt }}</span>
          </div>
        </div>

        <!-- Navigation arrows -->
        <div class="image-gallery-modal__navigation">
          <button
            v-if="expandedIndex > 0"
            class="image-gallery-modal__nav-button image-gallery-modal__nav-button--prev"
            @click="navigateImage(-1)"
          >
            <AtomsIcon icon="chevron-left" :size="32" />
          </button>
          <button
            v-if="expandedIndex < images.length - 1"
            class="image-gallery-modal__nav-button image-gallery-modal__nav-button--next"
            @click="navigateImage(1)"
          >
            <AtomsIcon icon="chevron-right" :size="32" />
          </button>
        </div>

        <!-- Backdrop -->
        <div class="image-gallery-modal__expanded-backdrop" @click="collapseImage" />
      </div>
    </div>
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

const expandedIndex = ref<number | null>(null)

const expandedImage = computed(() => {
  if (expandedIndex.value === null) return null
  return props.images[expandedIndex.value]
})

function expandImage(index: number) {
  expandedIndex.value = index
  document.body.style.overflow = 'hidden'
}

function collapseImage() {
  expandedIndex.value = null
  document.body.style.overflow = ''
}

function closeModal() {
  expandedIndex.value = null
  document.body.style.overflow = ''
  emit('close')
}

function navigateImage(direction: number) {
  if (expandedIndex.value === null) return
  
  const newIndex = expandedIndex.value + direction
  if (newIndex >= 0 && newIndex < props.images.length) {
    expandedIndex.value = newIndex
  }
}

// Handle keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      if (expandedIndex.value !== null) {
        collapseImage()
      } else {
        closeModal()
      }
      break
    case 'ArrowLeft':
      if (expandedIndex.value !== null) {
        navigateImage(-1)
      }
      break
    case 'ArrowRight':
      if (expandedIndex.value !== null) {
        navigateImage(1)
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

.image-gallery-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
  }

  &__container {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: var(--monochrome-300);
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    @include mq.tablet {
      width: 95vw;
      height: 90vh;
      max-width: 1600px;
      border-radius: var(--border-radius-3xl);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }
  }

  &__header {
    color: var(--monochrome-900);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: var(--size-12) var(--size-24) 0 var(--size-24);
  }

  &__close {
    background: none;
    border: none;
    color: var(--monochrome-900);
    cursor: pointer;
    padding: var(--size-8);
  }

  &__grid {
    flex: 1;
    padding: var(--size-16);
    padding-top: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: max-content;
    gap: var(--size-12);
    overflow-y: auto;

    @include mq.tablet {
      padding: var(--size-24);
      padding-top: 0;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--size-20);
    }
  }

  &__grid-item {
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__grid-image {
    width: 100%;
    height: 100%;
    max-height: 400px;
    object-fit: cover;
    display: block;
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: var(--size-12) var(--size-16) var(--size-16);
  }

  &__overlay-text {
    color: var(--monochrome-900);
    font-size: var(--text-sm);
    font-weight: 500;
    line-height: 1.3;
  }

  &__expanded {
    position: fixed;
    inset: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
  }

  &__expanded-container {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
  }

  &__expanded-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: var(--border-radius-xl);
  }

  &__expanded-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: var(--size-16) var(--size-20) var(--size-20);
    border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
  }

  &__expanded-text {
    color: white;
    font-size: var(--text-base);
    font-weight: 600;
    line-height: 1.3;
  }

  &__navigation {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    z-index: 1002;
    pointer-events: none;
    display: flex;
    justify-content: space-between;
    padding: 0 var(--size-24);
  }

  &__nav-button {
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    pointer-events: auto;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: scale(1.1);
    }
  }
}
</style>