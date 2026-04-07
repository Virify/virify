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
 * Composable for managing Cloudflare Images uploads via direct upload.
 *
 * Features:
 * - Get secure one-time upload URLs
 * - Upload images directly to Cloudflare (bypasses server)
 * - Delete images from Cloudflare
 * - Parallel upload support
 */
export const useCloudflareImages = () => {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);
  const toast = useToast();
  const { public: { CF_ACCOUNT_HASH } } = useRuntimeConfig();

  const getImageUrl = (id: string, variant = 'public'): string => {
    return `https://imagedelivery.net/${CF_ACCOUNT_HASH}/${id}/${variant}`;
  };

  const getImageUrls = (ids: string[], variant = 'public'): string[] => {
    return ids.map(id => getImageUrl(id, variant));
  };

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      const { uploadUrl } = await $fetch<{ uploadUrl: string }>('/api/cloudflare', {
        method: 'POST',
      });

      if (!uploadUrl) {
        throw new Error('No upload URL received from server');
      }

      const formData = new FormData();
      formData.append('file', file);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      uploadError.value = errorMessage;
      toast.add({ title: 'Error', description: errorMessage, color: 'error', icon: 'i-lucide-image-off' });
      return null;
    } finally {
      isUploading.value = false;
    }
  };

  const uploadImages = async (files: File[]): Promise<(UploadedImage | null)[]> => {
    return Promise.all(files.map(file => uploadImage(file)));
  };

  const deleteImage = async (cloudflareId: string): Promise<boolean> => {
    try {
      await $fetch(`/api/cloudflare/${cloudflareId}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  };

  const deleteImages = async (ids: string[]): Promise<void> => {
    await Promise.all(ids.map(id => deleteImage(id)));
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
