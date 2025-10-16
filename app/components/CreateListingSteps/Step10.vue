<template>
  <CreateListingStepsStepLayout
    title="Property Images"
    :info="`Upload images of your property and assign them to specific rooms. You must upload at least 1 image (up to ${maxImages} allowed).`"
    :hasChanges="hasActualChanges"
    :buttonDisabled="!isValid"
    :buttonText="buttonText"
    :errorMessage="errorMessage"
    showPrevious
    @cancel="handleCancel"
    @previous="$emit('previousStep')"
    @submit="handleSubmit"
  >
    <AtomsDivider />

    <!-- Images Section -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Upload Images" 
        :required="true"
        variant="section"
      />
      <em class="body-xs">At least one image is required to showcase your property</em>
      
      <OrganismsDraftImageUpload
        ref="imageUploadRef"
        v-model="uploadedImages"
        :available-rooms="availableRooms"
        :max-images="maxImages"
      />
    </div>

    <!-- Additional Actions for Final Step -->
    <template #additionalActions>
      <NuxtLink 
        v-if="canPreview"
        :to="`/listing/preview/${draft.id}`" 
        class="button button-tertiary button-sm"
      >
        Preview
      </NuxtLink>
      <NuxtLink 
        to="/account/create-listing" 
        class="button button-secondary button-sm"
      >
        Close
      </NuxtLink>
    </template>
  </CreateListingStepsStepLayout>
</template>

<script setup lang="ts">
const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepTen, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

// Get max images based on listing tier
const maxImages = computed(() => getMaxImagesForTier(props.draft.listingTier as "premium" | "featured" | "basic" | null));

// Get available rooms for assignment
const availableRooms = computed(() => getAvailableRooms(props.draft));

// Track uploaded images
const uploadedImages = ref<ImageAssignment[]>([]);

// Reference to the image upload component
const imageUploadRef = ref<any>(null);

// Load existing images on mount
onMounted(() => {
  const existingMedia = props.draft.property?.media || [];
  uploadedImages.value = existingMedia.map(m => {
    const metadata = m.metadata ? JSON.parse(m.metadata) : {};
    return {
      cloudflareId: m.image || '',
      filename: metadata.cloudflareImageId || m.image || '',
      description: metadata.description || null,
      bedroomId: m.bedroomId,
      bathroomId: m.bathroomId,
      kitchenId: m.kitchenId,
      receptionId: m.receptionId,
      otherRoomId: m.otherRoomId,
      gardenId: m.gardenId,
      yardId: m.yardId,
      landId: m.landId,
      isGeneral: !m.bedroomId && !m.bathroomId && !m.kitchenId && !m.receptionId && !m.otherRoomId && !m.gardenId && !m.yardId && !m.landId,
    };
  });
});

// Validation
const isValid = computed(() => uploadedImages.value.length > 0);

// Check if preview is available (step must be completed/saved with at least 1 image)
const stepCompleted = computed(() => props.draft.completedSteps?.includes(10) || false);
const canPreview = computed(() => stepCompleted.value && uploadedImages.value.length > 0);

// Change detection
const initialImageCount = ref(0);
onMounted(() => {
  initialImageCount.value = props.draft.property?.media?.length || 0;
});

const hasImageChanges = computed(() => {
  const currentCount = uploadedImages.value.length;
  if (currentCount !== initialImageCount.value) return true;
  
  const existingMedia = props.draft.property?.media || [];
  if (currentCount === 0 && existingMedia.length === 0) return false;
  
  return uploadedImages.value.some((img, index) => {
    const existing = existingMedia[index];
    if (!existing) return true;
    
    const metadata = existing.metadata ? JSON.parse(existing.metadata) : {};
    return (
      img.cloudflareId !== existing.image ||
      img.description !== (metadata.description || null) ||
      img.bedroomId !== existing.bedroomId ||
      img.bathroomId !== existing.bathroomId ||
      img.kitchenId !== existing.kitchenId ||
      img.receptionId !== existing.receptionId ||
      img.otherRoomId !== existing.otherRoomId ||
      img.gardenId !== existing.gardenId ||
      img.yardId !== existing.yardId ||
      img.landId !== existing.landId
    );
  });
});

const hasActualChanges = computed(() => hasImageChanges.value);

// Button text - this is the last step, so just "Save"
const buttonText = computed(() => {
  if (!isValid.value) return 'Save';
  if (stepCompleted.value && !hasActualChanges.value) return 'Saved';
  return 'Save';
});

/**
 * Handle cancel - delete all images and reset
 */
const handleCancel = async () => {
  if (imageUploadRef.value && uploadedImages.value.length > 0) {
    const imageIds = uploadedImages.value.map(img => img.cloudflareId);
    await imageUploadRef.value.deleteAllImages(imageIds);
  }
  uploadedImages.value = [];
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  if (!isValid.value) return;
  
  // If no changes and step already complete, just go to next step
  if (!hasActualChanges.value && stepCompleted.value) {
    emit('nextStep');
    return;
  }
  
  // Create payload
  const payload = {
    draftId: props.draft.id,
    media: uploadedImages.value.map(img => ({
      cloudflareId: img.cloudflareId,
      description: img.description,
      bedroomId: img.bedroomId || null,
      bathroomId: img.bathroomId || null,
      kitchenId: img.kitchenId || null,
      receptionId: img.receptionId || null,
      otherRoomId: img.otherRoomId || null,
      gardenId: img.gardenId || null,
      yardId: img.yardId || null,
      landId: img.landId || null,
    })),
  };
  
  // Mark images as saved (prevents cleanup on unmount)
  imageUploadRef.value?.markAsSaved();
  
  // Emit update
  emit('updateStepData', payload as any, 10);
};
</script>
