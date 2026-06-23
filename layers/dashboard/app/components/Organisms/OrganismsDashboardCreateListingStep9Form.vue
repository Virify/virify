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

      <UFormField
        label="Property Video"
        name="property.videoTour"
        description="Add a video tour of your property (optional)"
        hint="We only support Youtube"
      >
        <UInput
          v-model="state.property.videoTour"
          placeholder="e.g. 'https://www.youtube.com/watch?v=XAeKtyL2m-Q'"
          color="secondary"
          class="w-full"
        />
      </UFormField>

      <MoleculesDashboardCreateListingStep9FloorPlanUpload
        :floor-plans="state.property.floorPlans"
        :deleting-ids="deletingFloorPlanIds"
        :is-uploading="isUploadingFloorPlans"
        :is-processing="isProcessingFloorPlans"
        :max-floor-plans="maxFloorPlans"
        :upload-progress="uploadProgress"
        :uploading-count="uploadingCount"
        :get-image-url="getImageUrl"
        @files-selected="handleFloorPlanFilesSelected"
        @remove-floor-plan="removeFloorPlanById"
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
  const toast = useToast();
  const draftData = getStepData(9);

  // selectedTier is already set when loading draft or live listing
  const listingTier = computed(() => (selectedTier.value || "BASIC").toLowerCase());

  const maxImages = computed(() =>
    getMaxImagesForTier(listingTier.value as "PREMIUM" | "FEATURED" | "BASIC"),
  );

  const maxFloorPlans = computed(() => {
    const totalFloors = Number(getStepData(2)?.property?.totalFloors ?? 0);
    return Number.isFinite(totalFloors) && totalFloors > 0 ? totalFloors : 0;
  });

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
      videoTour: draftData?.property?.videoTour ?? "",
      floorPlans: draftData?.property?.floorPlans || [],
    },
  });

  const {
    uploadImage: uploadFloorPlanImage,
    deleteImage: deleteFloorPlanImage,
    getImageUrl,
    isUploading: isUploadingFloorPlans,
  } = useCloudflareImages();

  const isProcessingFloorPlans = ref(false);
  const deletingFloorPlanIds = ref<Set<string>>(new Set());

  const allImagesHaveDescriptions = computed(
    () =>
      state.property.media.length > 0 &&
      state.property.media.every((img) => (img.description ?? "").trim().length > 0),
  );

  const hasSchemaErrors = computed(
    () =>
      !step9Schema.safeParse({
        property: {
          description: state.property.description ?? "",
          media: state.property.media,
          videoTour: state.property.videoTour?.trim() ?? "",
          floorPlans: state.property.floorPlans,
        },
      }).success,
  );

  const isFormValid = computed(
    () =>
      !hasSchemaErrors.value &&
      state.property.description.length >= 10 &&
      state.property.media.length > 0 &&
      allImagesHaveDescriptions.value,
  );

  // Save progress requires valid form state AND unsaved changes
  const isSaveValid = computed(
    () =>
      !hasSchemaErrors.value &&
      state.property.description.length >= 10 &&
      (state.property.media.length === 0 || allImagesHaveDescriptions.value),
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
        videoTour: state.property.videoTour?.trim() ?? "",
        floorPlans: state.property.floorPlans.map((plan) => ({
          id: plan.id,
          cloudflareId: plan.cloudflareId,
          filename: plan.filename,
        })),
      },
    };
  }

  async function handleFloorPlanFilesSelected(files: File[]) {
    if (files.length === 0 || isProcessingFloorPlans.value) return;

    if (maxFloorPlans.value <= 0) {
      toast.add({
        title: "Set total floors first",
        description:
          "Please complete Step 2 with total floors before uploading floor plans.",
        color: "warning",
        icon: "i-lucide-triangle-alert",
      });
      return;
    }

    const remainingSlots = maxFloorPlans.value - state.property.floorPlans.length;
    const filesWithinLimit = files.slice(0, Math.max(remainingSlots, 0));

    if (filesWithinLimit.length === 0) {
      toast.add({
        title: "Floor plan limit reached",
        description: `You can only upload ${maxFloorPlans.value} floor plan${maxFloorPlans.value === 1 ? "" : "s"} for this property.`,
        color: "warning",
        icon: "i-lucide-triangle-alert",
      });
      return;
    }

    if (filesWithinLimit.length < files.length) {
      toast.add({
        title: "Some files skipped",
        description: `Only ${filesWithinLimit.length} floor plan${filesWithinLimit.length === 1 ? "" : "s"} could be uploaded (limit: ${maxFloorPlans.value}).`,
        color: "warning",
        icon: "i-lucide-triangle-alert",
      });
    }

    const validFiles = filesWithinLimit.filter((file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toast.add({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          color: "error",
          icon: "i-lucide-file-x",
        });
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.add({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit.`,
          color: "error",
          icon: "i-lucide-file-x",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    isProcessingFloorPlans.value = true;

    const uploadedPlans: { id?: number; cloudflareId: string; filename?: string }[] = [];

    try {
      await Promise.all(
        validFiles.map(async (file) => {
          const uploaded = await uploadFloorPlanImage(file);
          if (!uploaded) return;

          uploadedPlans.push({
            cloudflareId: uploaded.id,
            filename: file.name,
          });
        }),
      );

      if (uploadedPlans.length === 0) return;

      const targetDraftId = draftListingId.value;
      const targetListingId = editingListingId?.value;

      if (!targetDraftId && !targetListingId) {
        throw new Error("Could not resolve listing id for floor plan upload");
      }

      const response = await useRequestFetch()<{
        success: boolean;
        media: { id: number; floorPlan: string | null }[];
      }>("/api/draft-listings/0/media", {
        method: "POST",
        body: {
          mediaType: "floorPlan",
          media: uploadedPlans,
          ...(targetDraftId ?
            { draftId: targetDraftId }
          : { listingId: targetListingId }),
        },
      });

      for (const created of response?.media ?? []) {
        if (!created.floorPlan) continue;
        const match = uploadedPlans.find(
          (plan) => plan.cloudflareId === created.floorPlan,
        );
        if (match) match.id = created.id;
      }

      state.property.floorPlans.push(...uploadedPlans);

      toast.add({
        title: "Floor plans uploaded",
        description: `${uploadedPlans.length} file${uploadedPlans.length > 1 ? "s" : ""} added`,
        color: "success",
        icon: "i-lucide-layout-template",
      });
    } catch (error) {
      console.error("Failed to upload floor plans:", error);

      for (const plan of uploadedPlans) {
        await deleteFloorPlanImage(plan.cloudflareId);
      }

      toast.add({
        title: "Upload failed",
        description: "Could not upload floor plans. Please try again.",
        color: "error",
        icon: "i-lucide-circle-x",
      });
    } finally {
      isProcessingFloorPlans.value = false;
    }
  }

  async function removeFloorPlanById(cloudflareId: string) {
    const index = state.property.floorPlans.findIndex(
      (plan) => plan.cloudflareId === cloudflareId,
    );
    if (index === -1) return;
    if (deletingFloorPlanIds.value.has(cloudflareId)) return;

    deletingFloorPlanIds.value.add(cloudflareId);

    try {
      const body: {
        cloudflareIds: string[];
        mediaType: "floorPlan";
        draftId?: number;
        listingId?: number;
      } = {
        cloudflareIds: [cloudflareId],
        mediaType: "floorPlan",
      };

      if (draftListingId.value) {
        body.draftId = draftListingId.value;
      } else if (editingListingId?.value) {
        body.listingId = editingListingId.value;
      }

      await useRequestFetch()("/api/draft-listings/0/media", {
        method: "DELETE",
        body,
      });

      state.property.floorPlans.splice(index, 1);
    } catch (error) {
      console.error("Failed to delete floor plan:", error);
      toast.add({
        title: "Delete failed",
        description: "Could not remove floor plan. Please try again.",
        color: "error",
        icon: "i-lucide-circle-x",
      });
    } finally {
      deletingFloorPlanIds.value.delete(cloudflareId);
    }
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
    if (draftListingId.value) {
      navigateTo(`/dashboard/draft-listings`);
      return;
    }
    navigateTo("/dashboard/my-listings");
  }

  function onStepSaved() {}
</script>
