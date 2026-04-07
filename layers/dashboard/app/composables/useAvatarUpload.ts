const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/** Extracts a Cloudflare image ID from a delivery URL (`imagedelivery.net/{hash}/{id}/{variant}`) */
function getCloudflareId(url: string): string | null {
  const match = url.match(/imagedelivery\.net\/[^/]+\/([^/]+)/)
  return match?.[1] ?? null
}

/**
 * Composable for uploading, moderating and removing a user avatar via Cloudflare Images.
 *
 * @param state - Reactive object with at least an `avatar` field (URL string)
 *
 * **Upload flow:**
 * 1. Validates file type and size client-side
 * 2. Uploads directly to Cloudflare
 * 3. Runs through the moderation API — auto-deletes from Cloudflare if flagged
 * 4. On pass, persists the delivery URL to the DB and sets `state.avatar`
 *
 * **Remove flow:**
 * 1. Deletes from Cloudflare (if it's a CF-hosted image)
 * 2. Clears `state.avatar` and PATCHes the database
 */
export function useAvatarUpload(state: { avatar?: string | null }) {
  const { uploadImage, getImageUrl, deleteImage, isUploading: avatarUploading } = useCloudflareImages()
  const { checkImages } = useModeration()
  const { fetch: refreshSession } = useUserSession()
  const toast = useToast()

  const avatarFile = ref<File | undefined>(undefined)
  const avatarPreview = ref<string | undefined>(undefined)
  const avatarRemoving = ref(false)
  const avatarModerating = ref(false)

  /** Persists the avatar URL (or empty string to clear) to the database */
  async function saveAvatarToDb(url: string) {
    await useRequestFetch()('/api/user/profile', {
      method: 'PATCH',
      body: { ...state, avatar: url },
    })
  }

  /** Removes the current avatar from Cloudflare and the database, then resets local state */
  async function removeAvatar(removeFile: () => void) {
    avatarRemoving.value = true
    try {
      const currentUrl = state.avatar

      // Clear local state first
      removeFile()
      avatarFile.value = undefined
      avatarPreview.value = undefined
      state.avatar = ''

      // Delete from Cloudflare if it was a CF image
      const cfId = currentUrl ? getCloudflareId(currentUrl as string) : null
      if (cfId) {
        await deleteImage(cfId)
      }

      // Clear in database
      await saveAvatarToDb('')
      await refreshSession()

      toast.add({ title: 'Avatar removed', color: 'success', icon: 'i-lucide-check-circle' })
    } catch {
      toast.add({ title: 'Error', description: 'Failed to remove avatar', color: 'error', icon: 'i-lucide-circle-alert' })
    } finally {
      avatarRemoving.value = false
    }
  }

  watch(avatarFile, async (file) => {
    if (!file) return

    // Validate format
    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      toast.add({ title: 'Invalid file type', description: 'Please upload a JPEG, PNG or WebP image.', color: 'error', icon: 'i-lucide-circle-alert' })
      avatarFile.value = undefined
      return
    }

    // Validate size
    if (file.size > MAX_AVATAR_SIZE) {
      toast.add({ title: 'File too large', description: 'Please upload an image smaller than 2MB.', color: 'error', icon: 'i-lucide-circle-alert' })
      avatarFile.value = undefined
      return
    }

    // Show local preview immediately while uploading
    avatarPreview.value = URL.createObjectURL(file)

    // 1. Upload to Cloudflare
    const uploaded = await uploadImage(file)
    if (!uploaded) {
      avatarFile.value = undefined
      avatarPreview.value = undefined
      return
    }

    // 2. Moderate — auto-deletes from Cloudflare if flagged
    avatarModerating.value = true
    const { safe, reason } = await checkImages([uploaded.id])
    avatarModerating.value = false
    if (!safe) {
      toast.add({ title: 'Image rejected', description: reason, color: 'error', icon: 'i-lucide-circle-alert' })
      avatarFile.value = undefined
      avatarPreview.value = undefined
      return
    }

    // 3. Safe — delete the old CF image first (ownership check uses current DB value),
    //    then persist the new URL
    const oldCfId = state.avatar ? getCloudflareId(state.avatar as string) : null
    if (oldCfId) {
      await deleteImage(oldCfId)
    }
    const url = getImageUrl(uploaded.id)
    await saveAvatarToDb(url)
    await refreshSession()
    state.avatar = url
    avatarPreview.value = undefined
    toast.add({ title: 'Avatar updated', color: 'success', icon: 'i-lucide-check-circle' })
  })

  return {
    avatarFile,
    avatarPreview,
    avatarUploading,
    avatarModerating,
    avatarRemoving,
    removeAvatar,
  }
}
