/**
 * Composable for managing Step 9 media uploads and deletions
 * Handles Cloudflare uploads with database persistence
 */

export function useStep9Media(options: UseStep9MediaOptions) {
  const { draftListingId, editingListingId, media, maxImages, listingTier } = options;

  const { uploadImage, deleteImage, isUploading } = useCloudflareImages();
  const { checkImages, isChecking: isModerating } = useModeration();
  const toast = useToast();

  // Upload state
  const uploadProgress = ref(0);
  const uploadingCount = ref(0);
  const isProcessing = ref(false); // true for entire upload→moderate→save flow

  // Delete state
  const deletingIds = ref<Set<string>>(new Set());
  const isRemovingAll = ref(false);

  // Computed
  const atMaxImages = computed(() => media.length >= maxImages.value);

  const uploadLabel = computed(() => {
    if (atMaxImages.value) return "Maximum images reached";
    if (isUploading.value) return "Uploading...";
    if (isModerating.value) return "Checking images...";
    if (isProcessing.value) return "Saving...";
    return "Drop images here or click to upload";
  });

  /**
   * Validate and filter files for upload
   */
  function validateFiles(files: File[]): File[] {
    return files.filter((file) => {
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
  }

  /**
   * Upload files to Cloudflare and save to database
   */
  async function handleFilesSelected(files: File[]) {
    if (!files || files.length === 0) return;

    // Check remaining slots
    const remainingSlots = maxImages.value - media.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      toast.add({
        title: "Maximum images reached",
        description: `You can only upload ${maxImages.value} images for your ${listingTier.value} tier.`,
        color: "warning",
        icon: "i-lucide-triangle-alert",
      });
      return;
    }

    const validFiles = validateFiles(filesToUpload);
    if (validFiles.length === 0) {
      return;
    }

    // Upload to Cloudflare — all files in parallel for speed
    isProcessing.value = true;
    uploadingCount.value = validFiles.length;
    uploadProgress.value = 0;

    const uploadedImages: MediaAssignment[] = [];
    let completed = 0;

    await Promise.all(
      validFiles.map(async (file) => {
        const result = await uploadImage(file);
        completed++;
        uploadProgress.value = (completed / validFiles.length) * 100;
        if (result) {
          uploadedImages.push(createEmptyMediaAssignment(result.id, file.name));
        }
      }),
    );

    if (uploadedImages.length === 0) {
      uploadingCount.value = 0;
      isProcessing.value = false;
      return;
    }

    // Moderate all uploaded images before persisting
    const uploadedIds = uploadedImages.map((img) => img.cloudflareId);
    const { safe } = await checkImages(uploadedIds);

    if (!safe) {
      // checkImages already deleted all flagged images from Cloudflare.
      // Clean up any that were not flagged (safe ones in a batch that included a bad one).
      // Since we pass all IDs together, checkImages deletes ALL of them.
      toast.add({
        title: "Images rejected",
        description:
          "One or more of your images contained inappropriate content. All uploaded images have been removed. Please ensure your images are appropriate before uploading.",
        color: "error",
        icon: "i-lucide-image-off",
      });
      uploadingCount.value = 0;
      isProcessing.value = false;
      return;
    }

    // Save to database
    const targetDraftId = draftListingId.value;
    const targetListingId = editingListingId?.value;

    if (!targetDraftId && !targetListingId) {
      console.error(
        "[useStep9Media] Cannot save images: neither draftListingId nor editingListingId is set",
      );
      toast.add({
        title: "Error",
        description: "Could not save images: listing not found. Please try again.",
        color: "error",
        icon: "i-lucide-circle-x",
      });
      // Cleanup orphaned Cloudflare images
      for (const img of uploadedImages) {
        await deleteImage(img.cloudflareId);
      }
      uploadingCount.value = 0;
      isProcessing.value = false;
      return;
    }

    try {
      const response = await useRequestFetch()<{
        success: boolean;
        media: { id: number; image: string | null }[];
      }>("/api/draft-listings/0/media", {
        method: "POST",
        body: {
          media: uploadedImages,
          ...(targetDraftId ?
            { draftId: targetDraftId }
          : { listingId: targetListingId }),
        },
      });

      // Store the DB-assigned id on each uploaded image so the PATCH can use
      // update-by-id instead of updateMany, which silently no-ops on mismatches.
      if (response?.media) {
        for (const dbRecord of response.media) {
          if (!dbRecord.image) continue;
          const match = uploadedImages.find((img) => img.cloudflareId === dbRecord.image);
          if (match) match.id = dbRecord.id;
        }
      }

      media.push(...uploadedImages);

      toast.add({
        title: "Success",
        description: `${uploadedImages.length} image${uploadedImages.length > 1 ? "s" : ""} uploaded`,
        color: "success",
        icon: "i-lucide-image",
      });
    } catch (error) {
      console.error("[useStep9Media] Failed to save images to database:", error);
      toast.add({
        title: "Error",
        description: "Failed to save images. Please try again.",
        color: "error",
        icon: "i-lucide-circle-x",
      });

      // Cleanup Cloudflare on DB failure
      for (const img of uploadedImages) {
        await deleteImage(img.cloudflareId);
      }
    }

    uploadingCount.value = 0;
    isProcessing.value = false;
  }

  /**
   * Set an image as the main image (move to first position)
   * Only general images (not assigned to rooms) can be the main image
   */
  function setAsMainImage(cloudflareId: string): boolean {
    const index = media.findIndex((img) => img.cloudflareId === cloudflareId);
    if (index === -1) return false; // Not found
    if (index === 0) return true; // Already first

    const image = media[index];
    if (!image?.isGeneral) {
      toast.add({
        title: "Cannot set as main image",
        description:
          "Only general property images can be set as the main image. Remove the room assignment first.",
        color: "warning",
        icon: "i-lucide-triangle-alert",
      });
      return false;
    }

    media.splice(index, 1);
    media.unshift(image);
    return true;
  }

  /**
   * Check if an image can be set as main (must be general)
   */
  function canBeMainImage(cloudflareId: string): boolean {
    const image = media.find((img) => img.cloudflareId === cloudflareId);
    return image?.isGeneral === true;
  }

  /**
   * Remove a single image by cloudflareId
   */
  async function removeImageById(cloudflareId: string) {
    const index = media.findIndex((img) => img.cloudflareId === cloudflareId);
    if (index === -1) return;

    if (deletingIds.value.has(cloudflareId)) return;
    deletingIds.value.add(cloudflareId);

    try {
      // Use single endpoint with draftId or listingId in body
      const body: { cloudflareIds: string[]; draftId?: number; listingId?: number } = {
        cloudflareIds: [cloudflareId],
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
      media.splice(index, 1);
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        color: "error",
        icon: "i-lucide-circle-x",
      });
    } finally {
      deletingIds.value.delete(cloudflareId);
    }
  }

  /**
   * Remove all images
   */
  async function removeAllImages() {
    if (isRemovingAll.value || media.length === 0) return;

    isRemovingAll.value = true;
    const cloudflareIds = media.map((img) => img.cloudflareId);
    cloudflareIds.forEach((id) => deletingIds.value.add(id));

    try {
      // Use single endpoint with draftId or listingId in body
      const body: { cloudflareIds: string[]; draftId?: number; listingId?: number } = {
        cloudflareIds,
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

      media.length = 0;

      toast.add({
        title: "Success",
        description: `${cloudflareIds.length} image${cloudflareIds.length > 1 ? "s" : ""} deleted`,
        color: "success",
        icon: "i-lucide-image",
      });
    } catch (error) {
      console.error("Failed to delete images:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete images. Please try again.",
        color: "error",
        icon: "i-lucide-circle-x",
      });
    } finally {
      deletingIds.value.clear();
      isRemovingAll.value = false;
    }
  }

  return {
    // State
    uploadProgress,
    uploadingCount,
    deletingIds,
    isRemovingAll,
    isUploading,
    isModerating,
    isProcessing,

    // Computed
    atMaxImages,
    uploadLabel,

    // Methods
    handleFilesSelected,
    removeImageById,
    removeAllImages,
  };
}
