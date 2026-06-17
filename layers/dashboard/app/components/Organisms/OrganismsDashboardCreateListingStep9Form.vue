<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="9"
    :schema="step9Schema"
    :state="state"
    :is-valid="isFormValid"
    :is-save-valid="isSaveValid"
    api-endpoint="/api/listings/update/steps/nine/"
    :get-submission-data="getSubmissionData"
    :get-fields-to-moderate="getFieldsToModerate"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <template #alert>
      <UAlert
        type="info"
        class="mb-6"
        color="secondary"
        variant="subtle"
        icon="i-lucide-info"
      >
        <template #title>
          <h3>Step 9: Description &amp; Media</h3>
        </template>
        <template #description>
          <p class="body-sm text-muted">
            Add a compelling description of your property, then upload up to
            <strong class="text-default">{{ maxImages }} images</strong> for your
            {{ listingTier || "basic" }} tier listing. JPG, PNG, WebP, or GIF &bull; Max
            10MB per file.
          </p>
        </template>
      </UAlert>
    </template>

    <div class="space-y-6">
      <!-- Property Description -->
      <UFormField
        label="Property Description"
        name="property.description"
        description="Add a compelling description of your property (min 10 characters). Press Enter twice between paragraphs to add spacing."
        required
        eagerValidation
      >
        <UTextarea
          v-model="state.property.description"
          placeholder="e.g. 'This charming 2-bedroom apartment offers stunning views...'"
          :rows="10"
          color="secondary"
          class="w-full"
        />
      </UFormField>

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
        :groups="groupedImages"
        :accordion-items="imageAccordionItems"
        :room-options="roomOptions"
        :deleting-ids="deletingIds"
        :is-removing-all="isRemovingAll"
        :disabled="isUploading || isProcessing"
        @remove-all="removeAllImages"
        @delete-image="removeImageById"
        @update-title="updateImageTitle"
        @assign-room="assignToRoomById"
        @reorder-group="handleGroupReorder"
      />
    </div>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
  // ============================================================================
  // Draft Data & Tier
  // ============================================================================

  const { getStepData, draftListingId, editingListingId, selectedTier, isStepDirty } =
    useCreateListingSteps();
  const draftData = getStepData(9);

  // selectedTier is already set when loading draft or live listing
  const listingTier = computed(() => (selectedTier.value || "BASIC").toLowerCase());

  const maxImages = computed(() =>
    getMaxImagesForTier(listingTier.value as "PREMIUM" | "FEATURED" | "BASIC"),
  );

  // Fetch real room data fresh from the DB when step 9 mounts so we always
  // have the actual DB IDs (not in-memory placeholders from steps 4/5/6).
  const { data: freshPropertyRooms } = useAsyncData(
    () => `step9-rooms-${draftListingId.value ?? editingListingId?.value}`,
    async () => {
      const id = draftListingId.value ?? editingListingId?.value;
      if (!id) return null;
      const endpoint =
        editingListingId?.value ?
          `/api/listings/${id}/rooms`
        : `/api/draft-listings/${id}/rooms`;
      return useRequestFetch()<{
        property: {
          bedroomFeatures: any[];
          bathroomFeatures: any[];
          kitchenFeatures: any[];
          reception: any[];
          otherRoom: any[];
          outdoorSpace: any;
        };
      }>(endpoint).catch(() => null);
    },
    { immediate: true },
  );

  // Fall back to in-memory step data if the fetch hasn't resolved yet
  const propertyDataFromSteps = computed(() => {
    if (freshPropertyRooms.value) return freshPropertyRooms.value;
    const step4 = getStepData(4);
    const step5 = getStepData(5);
    const step6 = getStepData(6);
    return {
      property: {
        bedroomFeatures: step4?.property?.bedroomFeatures || [],
        bathroomFeatures: step4?.property?.bathroomFeatures || [],
        kitchenFeatures: step5?.property?.kitchenFeatures || [],
        reception: step5?.property?.reception || [],
        otherRoom: step5?.property?.otherRoom || [],
        outdoorSpace: step6?.property?.outdoorSpace || null,
      },
    };
  });

  const state = reactive<Step9FormState>({
    property: {
      description: draftData?.property?.description ?? "",
      media: draftData?.property?.media || [],
    },
  });

  const allImagesHaveDescriptions = computed(
    () =>
      state.property.media.length > 0 &&
      state.property.media.every((img) => (img.description ?? "").trim().length > 0),
  );

  const isFormValid = computed(
    () =>
      state.property.description.length >= 10 &&
      state.property.media.length > 0 &&
      allImagesHaveDescriptions.value,
  );

  // Save progress requires valid form state AND unsaved changes
  const isSaveValid = computed(
    () =>
      state.property.description.length >= 10 &&
      (state.property.media.length === 0 || allImagesHaveDescriptions.value) &&
      isStepDirty(9, getSubmissionData()),
  );

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
  });

  // Use step data for room assignment (no extra fetch needed)
  const availableRooms = computed(() =>
    getAvailableRoomsFromDraft(propertyDataFromSteps.value),
  );

  const roomOptions = computed(() => generateRoomOptions(availableRooms.value));

  /**
   * Update an image title. Writes directly to the single source of truth
   * (state.property.media) keyed by cloudflareId so the value is never tied to
   * fragile object-reference identity across reorders/re-renders.
   */
  function updateImageTitle(cloudflareId: string, title: string) {
    const image = state.property.media.find((img) => img.cloudflareId === cloudflareId);
    if (!image) return;

    const trimmed = title.slice(0, 100);
    image.description = trimmed.length > 0 ? trimmed : null;
  }

  /**
   * Assign image to room
   */
  function assignToRoomById(cloudflareId: string, roomValue: string) {
    const image = state.property.media.find((img) => img.cloudflareId === cloudflareId);
    if (!image) return;

    Object.assign(image, parseRoomAssignment(roomValue));
  }

  const groupedImages = computed(() =>
    groupImagesByRoom(state.property.media, availableRooms.value),
  );

  const imageAccordionItems = computed(() => generateAccordionItems(groupedImages.value));

  // ============================================================================
  // Drag & Drop (vue-draggable-plus)
  // ============================================================================

  /**
   * Called by ImageGrid when VueDraggable finishes a drag within a group.
   * newImages is the group's images in their new order; we rebuild the full
   * flat media array preserving the order of every other group.
   */
  function handleGroupReorder(groupKey: string, newImages: MediaAssignment[]) {
    const newOrder: MediaAssignment[] = [];

    for (const group of groupedImages.value) {
      if (group.key === groupKey) {
        // Use the dragged order; look up from state to keep object references intact
        for (const img of newImages) {
          const original = state.property.media.find(
            (m) => m.cloudflareId === img.cloudflareId,
          );
          if (original) newOrder.push(original);
        }
      } else {
        for (const img of group.images) {
          const original = state.property.media.find(
            (m) => m.cloudflareId === img.cloudflareId,
          );
          if (original) newOrder.push(original);
        }
      }
    }

    state.property.media.splice(0, state.property.media.length, ...newOrder);
  }

  function getSubmissionData() {
    return {
      property: {
        description: state.property.description ?? "",
        media: formatMediaForSubmission(state.property.media),
      },
    };
  }

  function getFieldsToModerate() {
    // Build a lookup of the last-saved image titles, keyed by cloudflareId.
    // The wrapper's generic change-detection can't resolve an array keyed by
    // cloudflareId, so we diff here and only return titles that actually
    // changed. Image *content* is already moderated once at upload time
    // (see useStep9Media → checkImages); we never re-moderate images on save.
    const lastSaved = getStepData(9) as
      | { property?: { media?: { cloudflareId: string; description?: string | null }[] } }
      | undefined;
    const savedTitles = new Map<string, string>();
    for (const img of lastSaved?.property?.media ?? []) {
      savedTitles.set(img.cloudflareId, (img.description ?? "").trim());
    }

    return [
      { name: "property.description", value: state.property.description },
      ...state.property.media
        .filter((img) => {
          const current = (img.description ?? "").trim();
          // Only moderate titles that have content AND differ from last save.
          return current.length > 0 && current !== savedTitles.get(img.cloudflareId);
        })
        .map((img) => ({
          name: `media.${img.cloudflareId}.description`,
          value: img.description ?? "",
        })),
    ];
  }

  function onStepCompleted() {
    navigateTo("/dashboard/draft-listings");
  }

  function onStepSaved() {}
</script>
