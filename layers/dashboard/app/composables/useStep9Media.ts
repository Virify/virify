/**
 * Composable for managing Step 9 media uploads and deletions
 * Handles Cloudflare uploads with database persistence
 */


export function useStep9Media(options: UseStep9MediaOptions) {
  const { draftListingId, media, maxImages, listingTier } = options
  
  const { uploadImage, deleteImage, isUploading } = useCloudflare()
  const toast = useToast()
  
  // Upload state
  const uploadProgress = ref(0)
  const uploadingCount = ref(0)
  
  // Delete state
  const deletingIds = ref<Set<string>>(new Set())
  const isRemovingAll = ref(false)
  
  // Computed
  const atMaxImages = computed(() => media.length >= maxImages.value)
  
  const uploadLabel = computed(() => {
    if (atMaxImages.value) return 'Maximum images reached'
    if (isUploading.value) return 'Uploading...'
    return 'Drop images here or click to upload'
  })

  /**
   * Validate and filter files for upload
   */
  function validateFiles(files: File[]): File[] {
    return files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.add({
          title: 'File too large',
          description: `${file.name} exceeds 10MB limit.`,
          color: 'error',
        })
        return false
      }
      return true
    })
  }

  /**
   * Upload files to Cloudflare and save to database
   */
  async function handleFilesSelected(files: File[]) {
    if (!files || files.length === 0) return

    // Check remaining slots
    const remainingSlots = maxImages.value - media.length
    const filesToUpload = files.slice(0, remainingSlots)

    if (filesToUpload.length === 0) {
      toast.add({
        title: 'Maximum images reached',
        description: `You can only upload ${maxImages.value} images for your ${listingTier.value} tier.`,
        color: 'warning',
      })
      return
    }

    const validFiles = validateFiles(filesToUpload)
    if (validFiles.length === 0) {
      return
    }

    // Upload to Cloudflare
    uploadingCount.value = validFiles.length
    uploadProgress.value = 0

    const uploadedImages: MediaAssignment[] = []
    let uploaded = 0
    
    for (const file of validFiles) {
      const result = await uploadImage(file)
      if (result) {
        uploadedImages.push(createEmptyMediaAssignment(result.id, file.name))
      }
      uploaded++
      uploadProgress.value = (uploaded / validFiles.length) * 100
    }

    // Save to database
    if (uploadedImages.length > 0 && draftListingId.value) {
      try {
        await useRequestFetch()(`/api/draft-listings/${draftListingId.value}/media`, {
          method: 'POST',
          body: { media: uploadedImages },
        })
        
        media.push(...uploadedImages)
        
        toast.add({
          title: 'Success',
          description: `${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} uploaded`,
          color: 'success',
        })
      } catch (error) {
        console.error('Failed to save images to database:', error)
        toast.add({
          title: 'Error',
          description: 'Failed to save images. Please try again.',
          color: 'error',
        })
        
        // Cleanup Cloudflare on DB failure
        for (const img of uploadedImages) {
          await deleteImage(img.cloudflareId)
        }
      }
    }

    uploadingCount.value = 0
  }

  /**
   * Set an image as the main image (move to first position)
   * Only general images (not assigned to rooms) can be the main image
   */
  function setAsMainImage(cloudflareId: string): boolean {
    const index = media.findIndex(img => img.cloudflareId === cloudflareId)
    if (index === -1) return false // Not found
    if (index === 0) return true // Already first
    
    const image = media[index]
    if (!image?.isGeneral) {
      toast.add({
        title: 'Cannot set as main image',
        description: 'Only general property images can be set as the main image. Remove the room assignment first.',
        color: 'warning',
      })
      return false
    }
    
    media.splice(index, 1)
    media.unshift(image)
    return true
  }
  
  /**
   * Check if an image can be set as main (must be general)
   */
  function canBeMainImage(cloudflareId: string): boolean {
    const image = media.find(img => img.cloudflareId === cloudflareId)
    return image?.isGeneral === true
  }

  /**
   * Remove a single image by cloudflareId
   */
  async function removeImageById(cloudflareId: string) {
    const index = media.findIndex(img => img.cloudflareId === cloudflareId)
    if (index === -1) return

    if (deletingIds.value.has(cloudflareId)) return
    deletingIds.value.add(cloudflareId)

    try {
      if (draftListingId.value) {
        await useRequestFetch()(`/api/draft-listings/${draftListingId.value}/media`, {
          method: 'DELETE',
          body: { cloudflareIds: [cloudflareId] },
        })
      }
      media.splice(index, 1)
    } catch (error) {
      console.error('Failed to delete image:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to delete image. Please try again.',
        color: 'error',
      })
    } finally {
      deletingIds.value.delete(cloudflareId)
    }
  }

  /**
   * Remove all images
   */
  async function removeAllImages() {
    if (isRemovingAll.value || media.length === 0) return
    
    isRemovingAll.value = true
    const cloudflareIds = media.map(img => img.cloudflareId)
    cloudflareIds.forEach(id => deletingIds.value.add(id))

    try {
      if (draftListingId.value) {
        await useRequestFetch()(`/api/draft-listings/${draftListingId.value}/media`, {
          method: 'DELETE',
          body: { cloudflareIds },
        })
      }
      
      media.length = 0
      
      toast.add({
        title: 'Success',
        description: `${cloudflareIds.length} image${cloudflareIds.length > 1 ? 's' : ''} deleted`,
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to delete images:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to delete images. Please try again.',
        color: 'error',
      })
    } finally {
      deletingIds.value.clear()
      isRemovingAll.value = false
    }
  }

  return {
    // State
    uploadProgress,
    uploadingCount,
    deletingIds,
    isRemovingAll,
    isUploading,
    
    // Computed
    atMaxImages,
    uploadLabel,
    
    // Methods
    handleFilesSelected,
    removeImageById,
    removeAllImages,
  }
}
