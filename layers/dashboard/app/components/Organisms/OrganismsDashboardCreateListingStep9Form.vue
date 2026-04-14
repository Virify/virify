<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="9"
    :schema="step9Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/listings/update/steps/nine/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <template #alert>
      <UAlert type="info" class="mb-6" color="secondary" variant="subtle" icon="i-lucide-info">
        <template #title>
          <h3>Step 9: Property Images</h3>
        </template>
        <template #description>
          <p class="body-sm text-muted">
            Upload up to <strong class="text-default">{{ maxImages }} images</strong> for your {{ listingTier || 'basic' }} tier listing. 
            JPG, PNG, WebP, or GIF • Max 10MB per file.
          </p>
        </template>
      </UAlert>
    </template>

    <div class="space-y-6">
      <!-- Upload Section -->
      <MoleculesDashboardCreateListingStep9ImageUpload
        :current-count="state.property.media.length"
        :max-images="maxImages"
        :is-uploading="isUploading || isProcessing"
        :at-max-images="atMaxImages"
        :upload-label="uploadLabel"
        :upload-progress="uploadProgress"
        :uploading-count="uploadingCount"
        @files-selected="handleFilesSelected"
      />

      <!-- Uploaded Images Grid -->
      <MoleculesDashboardCreateListingStep9ImageGrid
        :images="state.property.media"
        :grouped-images="groupedImages"
        :accordion-items="imageAccordionItems"
        :room-options="roomOptions"
        :deleting-ids="deletingIds"
        :is-removing-all="isRemovingAll"
        :disabled="isUploading || isProcessing"
        @remove-all="removeAllImages"
        @delete-image="removeImageById"
        @assign-room="assignToRoomById"
        @set-sortable-ref="setSortableRef"
        @change-position="changePositionInGroup"
      />
    </div>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
import Sortable, { type SortableEvent } from 'sortablejs'
import { useDebounceFn, useMediaQuery } from '@vueuse/core'

// Detect mobile for disabling drag
const isDesktop = useMediaQuery('(min-width: 1024px)')

// ============================================================================
// Draft Data & Tier
// ============================================================================

const { getStepData, draftListingId, editingListingId, selectedTier } = useCreateListingSteps()
const draftData = getStepData(9)

// selectedTier is already set when loading draft or live listing
const listingTier = computed(() => (selectedTier.value || 'BASIC').toLowerCase())

const maxImages = computed(() => 
  getMaxImagesForTier(listingTier.value as 'PREMIUM' | 'FEATURED' | 'BASIC')
)

// Build room data from already-loaded step data (steps 4, 5, 6)
// This avoids re-fetching the entire listing on every step visit
const propertyDataFromSteps = computed(() => {
  const step4 = getStepData(4)
  const step5 = getStepData(5)
  const step6 = getStepData(6)
  
  return {
    property: {
      bedroomFeatures: step4?.property?.bedroomFeatures || [],
      bathroomFeatures: step4?.property?.bathroomFeatures || [],
      kitchenFeatures: step5?.property?.kitchenFeatures || [],
      reception: step5?.property?.reception || [],
      otherRoom: step5?.property?.otherRoom || [],
      outdoorSpace: step6?.property?.outdoorSpace || null,
    }
  }
})

const state = reactive<Step9FormState>({
  property: {
    media: draftData?.property?.media || [],
  },
})

const isFormValid = computed(() => state.property.media.length > 0)

const {
  uploadProgress,
  uploadingCount,
  deletingIds,
  isRemovingAll,
  isUploading,
  isProcessing,
  atMaxImages,
  uploadLabel,
  handleFilesSelected,
  removeImageById,
  removeAllImages,
} = useStep9Media({
  draftListingId,
  editingListingId,
  media: state.property.media,
  maxImages,
  listingTier,
})

// Use step data for room assignment (no extra fetch needed)
const availableRooms = computed(() => getAvailableRoomsFromDraft(propertyDataFromSteps.value))

const roomOptions = computed(() => generateRoomOptions(availableRooms.value))

/**
 * Assign image to room
 */
function assignToRoomById(cloudflareId: string, roomValue: string) {
  const image = state.property.media.find(img => img.cloudflareId === cloudflareId)
  if (!image) return
  
  // Apply the room assignment
  Object.assign(image, parseRoomAssignment(roomValue))
}

const groupedImages = computed(() => groupImagesByRoom(state.property.media, availableRooms.value))

const imageAccordionItems = computed(() => generateAccordionItems(groupedImages.value))

function getImagesForGroup(groupKey: string): MediaAssignment[] {
  return groupedImages.value.find(g => g.key === groupKey)?.images ?? []
}

// ============================================================================
// Sortable (Drag & Drop)
// ============================================================================

const sortableRefs = new Map<string, HTMLElement>()
const sortableInstances = new Map<string, Sortable>()

function setSortableRef(groupKey: string, el: HTMLElement | null) {
  if (el) {
    sortableRefs.set(groupKey, el)
    initSortable(groupKey, el)
  } else {
    // Cleanup when element is removed
    const instance = sortableInstances.get(groupKey)
    if (instance) {
      instance.destroy()
      sortableInstances.delete(groupKey)
    }
    sortableRefs.delete(groupKey)
  }
}

function initSortable(groupKey: string, el: HTMLElement) {
  // Destroy existing instance if any
  const existing = sortableInstances.get(groupKey)
  if (existing) {
    existing.destroy()
  }
  
  const instance = Sortable.create(el, {
    animation: 200,
    // Disable drag on mobile - use position select instead
    disabled: !isDesktop.value,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onEnd: (evt: SortableEvent) => {
      if (evt.oldIndex === undefined || evt.newIndex === undefined) return
      if (evt.oldIndex === evt.newIndex) return
      
      // Get the images for this group
      const groupImages = getImagesForGroup(groupKey)
      const movedImage = groupImages[evt.oldIndex]
      
      if (!movedImage) return
      
      // Reorder images within the main media array
      reorderImageWithinGroup(groupKey, evt.oldIndex, evt.newIndex)
      
      // Auto-save the new order (lightweight - just sortOrder update)
      autoSaveMediaOrder()
    },
  })
  
  sortableInstances.set(groupKey, instance)
}

/**
 * Reorder image within its group and update the main media array
 */
function reorderImageWithinGroup(groupKey: string, oldIndex: number, newIndex: number) {
  const groupImages = getImagesForGroup(groupKey)
  
  // Get the cloudflare IDs in the group's current order
  const groupIds = groupImages.map(img => img.cloudflareId)
  
  // Move the item in the group order
  const [movedId] = groupIds.splice(oldIndex, 1)
  if (movedId) groupIds.splice(newIndex, 0, movedId)
  
  // Now rebuild the entire media array with the new order
  // General images first, then room images in their group order
  const allGroups = groupedImages.value
  const newMediaOrder: MediaAssignment[] = []
  
  for (const group of allGroups) {
    if (group.key === groupKey) {
      // Use the new order for this group
      for (const id of groupIds) {
        const img = state.property.media.find(m => m.cloudflareId === id)
        if (img) newMediaOrder.push(img)
      }
    } else {
      // Keep existing order for other groups
      for (const img of group.images) {
        const original = state.property.media.find(m => m.cloudflareId === img.cloudflareId)
        if (original) newMediaOrder.push(original)
      }
    }
  }
  
  // Update the state
  state.property.media.splice(0, state.property.media.length, ...newMediaOrder)
}

/**
 * Change position of an image via dropdown select (for mobile)
 * newPosition is 1-indexed (1 = first position)
 */
function changePositionInGroup(groupKey: string, cloudflareId: string, newPosition: number) {
  const groupImages = getImagesForGroup(groupKey)
  const currentIndex = groupImages.findIndex(img => img.cloudflareId === cloudflareId)
  
  if (currentIndex === -1) return
  
  // Convert 1-indexed position to 0-indexed
  const targetIndex = newPosition - 1
  
  if (currentIndex === targetIndex) return
  
  // Reorder using existing function
  reorderImageWithinGroup(groupKey, currentIndex, targetIndex)
  
  // Auto-save
  autoSaveMediaOrder()
}

/**
 * Auto-save media order after drag (lightweight - no toast)
 */
const autoSaveMediaOrder = useDebounceFn(async () => {
  if (!draftListingId.value) return
  
  try {
    await useRequestFetch()('/api/listings/update/steps/nine/', {
      method: 'PATCH',
      body: {
        draftId: draftListingId.value,
        property: { media: formatMediaForSubmission(state.property.media) }
      }
    })
  } catch (error) {
    console.error('Failed to auto-save media order:', error)
  }
}, 500)

// Watch for screen size changes to enable/disable sortable
watch(isDesktop, (desktop) => {
  for (const instance of sortableInstances.values()) {
    instance.option('disabled', !desktop)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  for (const instance of sortableInstances.values()) {
    instance.destroy()
  }
  sortableInstances.clear()
  sortableRefs.clear()
})


function getSubmissionData() {
  return { property: { media: formatMediaForSubmission(state.property.media) } }
}

function onStepCompleted() {
  console.log('Step 9 completed')
}

function onStepSaved() {
  console.log('Step 9 saved')
}
</script>
