import { ref } from 'vue';
import type { Ref } from 'vue';

/**
 * Uploaded image data returned from Cloudflare
 */
export interface UploadedImage {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
}

/**
 * Upload response from Cloudflare
 */
export interface UploadResponse {
  success: boolean;
  result?: UploadedImage;
  errors?: Array<{ code: number; message: string }>;
}

/**
 * Composable for managing Cloudflare image uploads via direct upload
 * 
 * Features:
 * - Get secure one-time upload URLs
 * - Upload images directly to Cloudflare (bypasses server)
 * - Delete images from Cloudflare
 * - Parallel upload support
 */
export const useCloudflare = () => {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);
  const toast = useToast();
  const { public: { CF_ACCOUNT_HASH } } = useRuntimeConfig();

  /**
   * Get the delivery URL for a Cloudflare image
   * @param id - Cloudflare image ID
   * @param variant - Image variant (defaults to 'public')
   */
  const getImageUrl = (id: string, variant = 'public'): string => {
    return `https://imagedelivery.net/${CF_ACCOUNT_HASH}/${id}/${variant}`;
  };

  /**
   * Get delivery URLs for multiple Cloudflare images
   * @param ids - Array of Cloudflare image IDs
   * @param variant - Image variant (defaults to 'public')
   */
  const getImageUrls = (ids: string[], variant = 'public'): string[] => {
    return ids.map(id => getImageUrl(id, variant));
  };

  /**
   * Upload an image to Cloudflare using direct upload
   * @param file - File to upload
   * @returns Upload response with Cloudflare image ID and variants
   */
  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      // Step 1: Get a secure one-time upload URL from our server
      const { uploadUrl } = await $fetch<{ uploadUrl: string }>('/api/cloudflare', {
        method: 'POST',
      });

      if (!uploadUrl) {
        throw new Error('No upload URL received from server');
      }

      // Step 2: Upload directly to Cloudflare (bypasses our server for speed)
      const formData = new FormData();
      formData.append('file', file);

      // Don't set Content-Type header - browser will set it with boundary automatically
      const cloudflareResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!cloudflareResponse.ok) {
        const errorText = await cloudflareResponse.text();
        console.error('Cloudflare upload failed:', errorText);
        throw new Error(`Upload failed: ${cloudflareResponse.status} ${cloudflareResponse.statusText}`);
      }

      const data = await cloudflareResponse.json() as UploadResponse;

      if (data.success && data.result) {
        return data.result;
      } else {
        const errorMessage = data.errors?.[0]?.message || 'Upload failed';
        uploadError.value = errorMessage;
        toast.add({ title: 'Error', description: `Failed to upload image: ${errorMessage}`, color: 'error', icon: 'i-lucide-image-off' });
        return null;
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Upload failed';
      uploadError.value = errorMessage;
      toast.add({ title: 'Error', description: `Error uploading image: ${errorMessage}`, color: 'error', icon: 'i-lucide-image-off' });
      console.error('Upload error:', error);
      return null;
    } finally {
      isUploading.value = false;
    }
  };

  /**
   * Upload multiple images to Cloudflare in parallel
   * @param files - Array of files to upload
   * @returns Array of uploaded image results
   */
  const uploadImages = async (files: File[]): Promise<(UploadedImage | null)[]> => {
    const uploadPromises = files.map(file => uploadImage(file));
    return Promise.all(uploadPromises);
  };

  /**
   * Delete an image from Cloudflare
   * @param cloudflareId - Cloudflare image ID to delete
   * @returns Success status
   */
  const deleteImage = async (cloudflareId: string): Promise<boolean> => {
    try {
      const response = await $fetch<{ success: boolean }>(`/api/cloudflare/${cloudflareId}`, {
        method: 'DELETE',
      });

      return response.success;
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.add({ title: 'Error', description: 'Failed to delete image', color: 'secondary', icon: 'i-lucide-image-off' });
      return false;
    }
  };

  /**
   * Delete multiple images from Cloudflare in parallel
   * @param cloudflareIds - Array of Cloudflare image IDs to delete
   * @returns Array of success statuses
   */
  const deleteImages = async (cloudflareIds: string[]): Promise<boolean[]> => {
    const deletePromises = cloudflareIds.map(id => deleteImage(id));
    return Promise.all(deletePromises);
  };

  return {
    isUploading: isUploading as Ref<boolean>,
    uploadError: uploadError as Ref<string | null>,
    getImageUrl,
    getImageUrls,
    uploadImage,
    uploadImages,
    deleteImage,
    deleteImages,
  };
};
