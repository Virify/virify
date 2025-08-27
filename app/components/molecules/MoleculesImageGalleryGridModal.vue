<template>
  <div class="gallery-grid-modal" @click="handleBackdropClick">
    <!-- Bottom Bar -->
    <AtomsBottomBar title="Gallery" @close="closeModal" />

    <!-- Image Grid -->
    <div class="gallery-grid-modal__content">
      <div class="gallery-grid-modal__grid">
        <button v-for="(image, index) in images" :key="index" class="gallery-grid-modal__image-button"
          @click="openImageModal(index)">
          <nuxt-img provider="cloudflare" :src="image.src + '/gallery'" :alt="image.alt" class="gallery-grid-modal__image"
          />
        </button>
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
}

interface Emits {
  (e: 'close'): void
  (e: 'open-image', imageIndex: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function openImageModal(index: number) {
  emit('open-image', index)
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function closeModal() {
  emit('close')
}

// Handle keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal()
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

.gallery-grid-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  user-select: none;


  &__content {
    flex: 1;
    overflow-y: auto;
    padding: var(--size-24) var(--size-24) var(--size-120);

    @include mq.mobile-only {
      padding: var(--size-16) var(--size-16) var(--size-100);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--size-4);
    margin: 0 auto;
    padding: var(--size-8);

    @include mq.mobile-only {
      grid-template-columns: 1fr;
      gap: var(--size-16);
    }

    @include mq.tablet-only {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--size-20);
    }
  }

  &__image-button {
    background: none;
    border: none;
    border-radius: 0;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 0;
    transition: transform 0.3s ease;
  }
}

// Smooth transitions for modal
.gallery-grid-modal {
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