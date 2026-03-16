<template>
  <div class="o-draft-image-upload">
    <!-- Upload Area -->
    <div class="o-draft-image-upload__dropzone" :class="{
      'o-draft-image-upload__dropzone--dragging': isDragging,
      'o-draft-image-upload__dropzone--disabled': isUploading || atMaxImages
    }" @drop.prevent="handleDrop" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
      @click="triggerFileInput">
      <input ref="fileInput" type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        @change="handleFileSelect" class="o-draft-image-upload__input" />

      <div class="o-draft-image-upload__dropzone-content">
        <p class="title-xs">
          {{ atMaxImages ? 'Maximum images reached' : 'Drop images here or click to upload' }}
        </p>
        <p class="body-sm">
          {{ uploadedImages.length }} of {{ maxImages }} images
        </p>
        <p class="body-xs">
          JPG, PNG, WebP, GIF • Max 10MB per file
        </p>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="o-draft-image-upload__progress">
      <p class="body-sm">Uploading {{ Math.round(uploadProgress) }}%...</p>
      <div class="o-draft-image-upload__progress-bar">
        <div class="o-draft-image-upload__progress-fill" :style="{ width: `${uploadProgress}%` }" />
      </div>
    </div>

    <!-- Error Message -->
    <AtomsInlineError v-if="uploadError" class="o-draft-image-upload__error">
      {{ uploadError }}
    </AtomsInlineError>

    <!-- Uploaded Images Grid -->
    <div v-if="uploadedImages.length > 0" class="o-draft-image-upload__grid">
      <TransitionGroup name="image-list">
        <div v-for="(image, index) in uploadedImages" :key="image.cloudflareId" class="o-draft-image-upload__item">
          <!-- Image Preview -->
          <div class="o-draft-image-upload__preview">
            <AtomsCloudFlareImage :src="image.cloudflareId" :alt="image.description || 'Uploaded image'"
              variant="marker" :modifiers="{ fit: 'contain' }" class="o-draft-image-upload__image" />

            <!-- Delete Button -->
            <button type="button" @click="removeImage(index)" class="o-draft-image-upload__delete"
              :disabled="isUploading">
              ✕
            </button>
          </div>

          <!-- Description Input -->
          <AtomsInput :model-value="image.description || ''"
            @update:model-value="(value) => image.description = (value as string)" type="text"
            :name="`image-${index}-description`" placeholder="Description (optional)"
            wrapper-class="o-draft-image-upload__input" />

          <!-- Room Assignment Select -->
          <AtomsSelect :model-value="getSelectedRoom(image)"
            @update:model-value="(value) => assignToRoom(index, String(value))" :options="roomOptions"
            class="o-draft-image-upload__select | body-sm" />
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div v-else class="o-draft-image-upload__empty">
      <p class="title-xs">No images uploaded yet</p>
      <p class="body-sm">Drag and drop images or click the upload area above</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageAssignment } from '~/utils/listing/step-ten';

interface RoomOption {
  value: string;
  key: string;
}

interface AvailableRooms {
  bedrooms: Array<{ id: number; name: string; roomNumber: number }>;
  bathrooms: Array<{ id: number; name: string; roomNumber: number }>;
  kitchens: Array<{ id: number; name: string; roomNumber: number }>;
  receptions: Array<{ id: number; name: string; roomNumber: number; type?: string }>;
  otherRooms: Array<{ id: number; name: string; roomNumber: number; type?: string }>;
  gardens: Array<{ id: number; name: string }>;
  yards: Array<{ id: number; name: string }>;
  lands: Array<{ id: number; name: string }>;
}

interface Props {
  modelValue: ImageAssignment[];
  availableRooms: AvailableRooms;
  maxImages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxImages: 50,
});

const emit = defineEmits<{
  'update:modelValue': [value: ImageAssignment[]];
}>();

// Composables
const { uploadImage, deleteImage, deleteImages, isUploading, uploadError } = useCloudflare();

// Refs
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const uploadProgress = ref(0);
const imagesSaved = ref(false);

// Track NEW images uploaded in this session (not loaded from database)
const newlyUploadedImageIds = ref<Set<string>>(new Set());

// Computed
const uploadedImages = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const atMaxImages = computed(() => uploadedImages.value.length >= props.maxImages);

/**
 * Cleanup ONLY newly uploaded unsaved images on unmount
 */
const cleanup = async () => {
  // Only delete images that were uploaded in this session AND not saved
  if (!imagesSaved.value && newlyUploadedImageIds.value.size > 0) {
    const idsToDelete = Array.from(newlyUploadedImageIds.value);
    await deleteImages(idsToDelete);
  }
};

onUnmounted(cleanup);

// Also cleanup on page unload (tab close, refresh, navigation)
if (import.meta.client) {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!imagesSaved.value && newlyUploadedImageIds.value.size > 0) {
      // Attempt cleanup (may not complete before page closes)
      cleanup();
      // Show browser warning
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
}

/**
 * Generate room options for the select dropdown
 */
const roomOptions = computed((): RoomOption[] => {
  const options: RoomOption[] = [
    { value: 'general', key: 'General Property Image' },
  ];

  // Add bedrooms
  props.availableRooms.bedrooms.forEach(room => {
    options.push({
      value: `bedroom-${room.id}`,
      key: `Bedroom: ${room.name}`,
    });
  });

  // Add bathrooms
  props.availableRooms.bathrooms.forEach(room => {
    options.push({
      value: `bathroom-${room.id}`,
      key: `Bathroom: ${room.name}`,
    });
  });

  // Add kitchens
  props.availableRooms.kitchens.forEach(room => {
    options.push({
      value: `kitchen-${room.id}`,
      key: `Kitchen: ${room.name}`,
    });
  });

  // Add receptions
  props.availableRooms.receptions.forEach(room => {
    options.push({
      value: `reception-${room.id}`,
      key: `Reception: ${room.name}`,
    });
  });

  // Add other rooms
  props.availableRooms.otherRooms.forEach(room => {
    options.push({
      value: `otherRoom-${room.id}`,
      key: `Other: ${room.name}`,
    });
  });

  // Add gardens
  props.availableRooms.gardens.forEach(room => {
    options.push({
      value: `garden-${room.id}`,
      key: `Garden: ${room.name}`,
    });
  });

  // Add yards
  props.availableRooms.yards.forEach(room => {
    options.push({
      value: `yard-${room.id}`,
      key: `Yard: ${room.name}`,
    });
  });

  // Add lands
  props.availableRooms.lands.forEach(room => {
    options.push({
      value: `land-${room.id}`,
      key: `Land: ${room.name}`,
    });
  });

  return options;
});

/**
 * Get the selected room for an image
 */
function getSelectedRoom(image: ImageAssignment): string {
  if (image.bedroomId) return `bedroom-${image.bedroomId}`;
  if (image.bathroomId) return `bathroom-${image.bathroomId}`;
  if (image.kitchenId) return `kitchen-${image.kitchenId}`;
  if (image.receptionId) return `reception-${image.receptionId}`;
  if (image.otherRoomId) return `otherRoom-${image.otherRoomId}`;
  if (image.gardenId) return `garden-${image.gardenId}`;
  if (image.yardId) return `yard-${image.yardId}`;
  if (image.landId) return `land-${image.landId}`;
  return 'general';
}

/**
 * Assign an image to a specific room
 */
function assignToRoom(imageIndex: number, roomValue: string) {
  const image = uploadedImages.value[imageIndex];
  if (!image) return;

  // Clear all room assignments
  image.bedroomId = null;
  image.bathroomId = null;
  image.kitchenId = null;
  image.receptionId = null;
  image.otherRoomId = null;
  image.gardenId = null;
  image.yardId = null;
  image.landId = null;
  image.isGeneral = true;

  // Parse room value and assign
  if (roomValue !== 'general') {
    const [roomType, roomId] = roomValue.split('-');
    if (!roomId) return;

    const id = parseInt(roomId);

    switch (roomType) {
      case 'bedroom':
        image.bedroomId = id;
        image.isGeneral = false;
        break;
      case 'bathroom':
        image.bathroomId = id;
        image.isGeneral = false;
        break;
      case 'kitchen':
        image.kitchenId = id;
        image.isGeneral = false;
        break;
      case 'reception':
        image.receptionId = id;
        image.isGeneral = false;
        break;
      case 'otherRoom':
        image.otherRoomId = id;
        image.isGeneral = false;
        break;
      case 'garden':
        image.gardenId = id;
        image.isGeneral = false;
        break;
      case 'yard':
        image.yardId = id;
        image.isGeneral = false;
        break;
      case 'land':
        image.landId = id;
        image.isGeneral = false;
        break;
    }
  }

  // Trigger reactivity
  emit('update:modelValue', [...uploadedImages.value]);
}

/**
 * Trigger file input click
 */
function triggerFileInput() {
  if (!isUploading.value && !atMaxImages.value) {
    fileInput.value?.click();
  }
}

/**
 * Handle file selection from input
 */
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  await processFiles(Array.from(files));
  target.value = ''; // Reset input
}

/**
 * Handle drag and drop
 */
async function handleDrop(event: DragEvent) {
  isDragging.value = false;

  if (isUploading.value || atMaxImages.value) return;

  const files = event.dataTransfer?.files;
  if (!files) return;

  await processFiles(Array.from(files));
}

/**
 * Process and upload files (with parallel uploads for better performance)
 */
async function processFiles(files: File[]) {
  const remainingSlots = props.maxImages - uploadedImages.value.length;
  const filesToUpload = files.slice(0, remainingSlots);

  if (filesToUpload.length === 0) return;

  uploadProgress.value = 0;

  // Upload all files in parallel for better performance
  const uploadPromises = filesToUpload.map(async (file) => {
    const result = await uploadImage(file);

    if (result) {
      return {
        cloudflareId: result.id,
        filename: file.name,
        description: null,
        isGeneral: true,
      } as ImageAssignment;
    }
    return null;
  });

  // Wait for all uploads to complete
  const results = await Promise.all(uploadPromises);

  // Filter out failed uploads and add successful ones
  const successfulUploads = results.filter((r): r is ImageAssignment => r !== null);

  // Track newly uploaded image IDs for cleanup
  successfulUploads.forEach(img => {
    newlyUploadedImageIds.value.add(img.cloudflareId);
  });

  uploadedImages.value = [...uploadedImages.value, ...successfulUploads];

  uploadProgress.value = 100;

  // Reset progress after a short delay
  setTimeout(() => {
    uploadProgress.value = 0;
  }, 1000);
}

/**
 * Remove an image
 */
async function removeImage(index: number) {
  const image = uploadedImages.value[index];
  if (!image) return;

  // Delete from Cloudflare
  const deleted = await deleteImage(image.cloudflareId);

  if (deleted) {
    // Remove from tracking set if it was newly uploaded
    newlyUploadedImageIds.value.delete(image.cloudflareId);

    // Remove from array
    uploadedImages.value = uploadedImages.value.filter((_, i) => i !== index);
  }
}

/**
 * Mark images as saved when form is submitted (prevents cleanup)
 */
const markAsSaved = () => {
  imagesSaved.value = true;
  // Clear the tracking set since images are now saved
  newlyUploadedImageIds.value.clear();
};

/**
 * Delete all images from Cloudflare (used by cancel button)
 */
const deleteAllImages = async (imageIds: string[]) => {
  if (imageIds.length === 0) return;

  // Delete all images from Cloudflare
  await deleteImages(imageIds);

  // Clear the tracking set
  newlyUploadedImageIds.value.clear();

  // Clear the local array
  uploadedImages.value = [];
};

defineExpose({
  markAsSaved,
  deleteAllImages,
});
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.o-draft-image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-16);

  &__dropzone {
    width: 100%;
    max-width: 800px;
    margin-top: var(--size-16);
    border: 2px dashed var(--foreground-100);
    border-radius: var(--border-radius-lg);
    padding: var(--size-32) var(--size-24);
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--background-200);

    @include mq.mobile-only {
      padding: var(--size-24) var(--size-16);
    }

    &:hover:not(&--disabled) {
      border-color: var(--secondary-400);
      background: var(--background-100);
    }

    &--dragging {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-8);
    color: var(--text-secondary);

    .title-xs {
      margin: 0;
      color: var(--text-primary);
    }

    .body-sm,
    .body-xs {
      margin: 0;
    }
  }

  &__input {
    display: none;
  }

  &__progress {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    padding: var(--size-12) var(--size-16);
    background: var(--background-200);
    border-radius: var(--border-radius-md);

    .body-sm {
      margin: 0;
      color: var(--text-secondary);
    }
  }

  &__progress-bar {
    width: 100%;
    height: 6px;
    background: var(--background-100);
    border-radius: var(--border-radius-full);
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: var(--primary-500);
    transition: width 0.3s ease;
  }

  &__error {
    margin-top: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--size-12);
    width: 100%;
    margin-top: var(--size-8);

    @include mq.tablet-only {
      grid-template-columns: repeat(3, 1fr);
    }

    @include mq.mobile-only {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--size-8);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    padding: var(--size-8);
    border: 1px solid var(--border-200);
    border-radius: var(--border-radius-md);
    background: var(--background-50);
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  &__preview {
    position: relative;
    border-radius: var(--border-radius-sm);
    overflow: hidden;
    background: var(--background-100);
    aspect-ratio: 4 / 3;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__delete {
    position: absolute;
    top: var(--size-4);
    right: var(--size-4);
    color: var(--foreground-100);
    width: 24px;
    height: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background-200);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__input {
    border: 1px solid var(--secondary-400);
  }

  &__select {
    border: 1px solid var(--input-text-border);
    padding: var(--size-10);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-12);
    padding: var(--size-48) var(--size-24);
    text-align: center;

    @include mq.mobile-only {
      padding: var(--size-32) var(--size-16);
    }
  }
}

// Transition animations
.image-list-enter-active,
.image-list-leave-active {
  transition: all 0.3s ease;
}

.image-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.image-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.image-list-move {
  transition: transform 0.3s ease;
}
</style>
