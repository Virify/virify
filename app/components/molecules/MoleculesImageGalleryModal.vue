<template>
  <!-- Room Grid Gallery Modal (First Level) -->
  <MoleculesImageGalleryRoomGrid
    v-if="showGridModal"
    :images="props.images"
    @close="closeGridModal"
    @open-image="openImageModal"
  />

  <!-- Individual Image Modal (Second Level) -->
  <MoleculesImageModal
    v-if="showImageModal"
    :images="flatImages"
    :initial-index="selectedImageIndex"
    @close="closeImageModal"
  />
</template>

<script setup lang="ts">
interface ImageData {
  src: string
  alt: string
  bedroomId?: number | null
  bathroomId?: number | null
  kitchenId?: number | null
  receptionId?: number | null
  otherRoomId?: number | null
  gardenId?: number | null
  yardId?: number | null
  landId?: number | null
  outdoorSpaceId?: number | null
  globalIndex: number
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

// Convert all images to flat format for the image modal
const flatImages = computed(() => {
  return props.images.map(img => ({
    src: img.src,
    alt: img.alt
  }))
})

// Watch for show prop changes to open grid modal
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Always open the grid modal first
    showGridModal.value = true
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