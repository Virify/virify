<template>
  <div class="image-gallery-modal" @click="closeModal">
    <div class="image-gallery-modal__backdrop" />
    
    <div class="image-gallery-modal__container" @click.stop>
      <!-- Close Button -->
      <div class="image-gallery-modal__header">
        <p class="| body-sm">Total Images: {{ images.length }}</p>
        <button class="image-gallery-modal__close" @click="closeModal">
          <AtomsIcon icon="cross" :size="24" />
        </button>
      </div>

      <!-- Pure Masonry Grid -->
      <div class="image-gallery-modal__grid">
        <div
          v-for="(image, index) in images"
          :key="index"
          :ref="el => setItemRef(el as any, index)"
          class="image-gallery-modal__grid-item"
          :class="{ 'is-expanded': expandedIndex === index }"
          :style="expandedIndex === index ? expandedStyles : {}"
          @click="toggleExpand(index)"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="image-gallery-modal__grid-image"
          />
          <div class="image-gallery-modal__overlay" :class="{ 'is-expanded': expandedIndex === index }">
            <span class="image-gallery-modal__overlay-text">{{ image.alt }}</span>
          </div>
        </div>
      </div>

      <!-- Backdrop for expanded image -->
      <div 
        v-if="expandedIndex !== null" 
        class="image-gallery-modal__expanded-backdrop"
        @click="collapseImage"
      />
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

const selectedIndex = ref(props.initialIndex)
const expandedIndex = ref<number | null>(null)
const itemRefs = ref<{ [key: number]: HTMLElement }>({})
const expandedStyles = ref({})

function setItemRef(el: HTMLElement | ComponentPublicInstance | null, index: number) {
  if (el && '$el' in el) {
    itemRefs.value[index] = el.$el as HTMLElement
  } else if (el) {
    itemRefs.value[index] = el as HTMLElement
  }
}


function toggleExpand(index: number) {
  if (expandedIndex.value === index) {
    expandedIndex.value = null
    expandedStyles.value = {}
  } else {
    selectedIndex.value = index
    expandedIndex.value = index
    calculateExpandedPosition(index)
  }
}

function calculateExpandedPosition(index: number) {
  const element = itemRefs.value[index]
  if (!element) return

  const rect = element.getBoundingClientRect()
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  const translateX = centerX - rect.left - rect.width / 2
  const translateY = centerY - rect.top - rect.height / 2
  
  expandedStyles.value = {
    transform: `translate(${translateX}px, ${translateY}px) scale(1.5)`,
    zIndex: 1001,
    position: 'relative'
  }
}

function collapseImage() {
  expandedIndex.value = null
  expandedStyles.value = {}
}

function closeModal() {
  expandedIndex.value = null
  emit('close')
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
      if (selectedIndex.value > 0) {
        selectedIndex.value--
      }
      break
    case 'ArrowRight':
      if (selectedIndex.value < props.images.length - 1) {
        selectedIndex.value++
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
  }

  &__container {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: var(--background-100);
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--size-12) var(--size-24) 0;
  }

  &__close {
    background: none;
    border: none;
    color: var(--foreground-900);
    cursor: pointer;
    font-size: var(--text-xl);
    padding: var(--size-8);
  }

  &__grid {
    flex: 1;
    padding: var(--size-16);
    
    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--foreground-100);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--foreground-400);
      border-radius: 4px;
      
      &:hover {
        background: var(--foreground-500);
      }
    }
    
    // Firefox
    scrollbar-width: thin;
    scrollbar-color: var(--foreground-400) var(--foreground-100);
    
    // Masonry everywhere
    columns: 2;
    column-gap: var(--size-12);

    @include mq.tablet {
      // Desktop: More columns
      overflow-y: auto;
      padding: var(--size-4) var(--size-24) var(--size-24);
      columns: 3;
      column-gap: var(--size-20);
    }
    
    @include mq.desktop {
      columns: 3;
      column-gap: var(--size-24);
    }
  }

  &__grid-item {
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    break-inside: avoid;
    display: block;
    margin-bottom: var(--size-12);

    @include mq.tablet {
      margin-bottom: var(--size-20);
    }

    &:hover:not(.is-expanded) {
      transform: scale(1.02);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }

    &.is-expanded {
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      border-radius: var(--border-radius-2xl);
    }
  }

  &__grid-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    
    @include mq.tablet {
      height: auto;
    }
  }


  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: var(--size-12) var(--size-16) var(--size-16);
    opacity: 1;
    transition: all 0.2s ease;

    &.is-expanded {
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
      padding: var(--size-16) var(--size-20) var(--size-20);
    }
  }

  &__overlay-text {
    color: white;
    font-size: var(--text-sm);
    font-weight: 500;
    line-height: 1.3;
    display: block;

    .is-expanded & {
      font-size: var(--text-base);
      font-weight: 600;
    }
  }

  &__expanded-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    backdrop-filter: blur(5px);
  }
}
</style>