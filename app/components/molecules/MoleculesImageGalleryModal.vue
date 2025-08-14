<template>
  <!-- Grid Gallery Modal (First Level) -->
  <MoleculesImageGalleryGridModal
    v-if="showGridModal"
    :images="images"
    @close="closeGridModal"
    @open-image="openImageModal"
  />

  <!-- Individual Image Modal (Second Level) -->
  <MoleculesImageModal
    v-if="showImageModal"
    :images="images"
    :initial-index="selectedImageIndex"
    @close="closeImageModal"
  />
</template>

<script setup lang="ts">
interface ImageData {
  src: string
  alt: string
}

interface Props {
  images: ImageData[]
  show: boolean
  initialIndex?: number
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})
const emit = defineEmits<Emits>()

const showGridModal = ref(false)
const showImageModal = ref(false)
const selectedImageIndex = ref(props.initialIndex)

// Watch for show prop changes to open grid modal
watch(() => props.show, (newShow) => {
  if (newShow) {
    // If an initial index is provided, go directly to image modal
    if (props.initialIndex > 0) {
      selectedImageIndex.value = props.initialIndex
      showImageModal.value = true
    } else {
      showGridModal.value = true
    }
  } else {
    closeAll()
  }
})

// Watch for initialIndex changes to update selectedImageIndex
watch(() => props.initialIndex, (newIndex) => {
  selectedImageIndex.value = newIndex || 0
})

function openImageModal(imageIndex: number) {
  selectedImageIndex.value = imageIndex
  showGridModal.value = false
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
  showGridModal.value = true
}

function closeGridModal() {
  showGridModal.value = false
  emit('close')
}

function closeAll() {
  showGridModal.value = false
  showImageModal.value = false
}
</script>

<style lang="scss">
// Coordinator component - no styles needed
</style>