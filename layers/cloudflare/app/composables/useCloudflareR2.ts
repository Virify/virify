/**
 * Composable for uploading, deleting, and serving files from Cloudflare R2.
 * All uploads are server-proxied and run moderation before persisting.
 */
export const useCloudflareR2 = () => {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);
  const toast = useToast();
  const requestFetch = useRequestFetch();
  const { public: { CF_R2_URL } } = useRuntimeConfig();

  /**
   * Get the public URL for an R2 file by its storage key.
   */
  const getFileUrl = (key: string): string => {
    return `${CF_R2_URL}/${key}`;
  };

  /**
   * Upload a file to R2 via the server endpoint.
   * The server validates MIME type, size, and runs moderation before persisting.
   * Returns the created UserMedia record, or null if upload/moderation failed.
   */
  const uploadFile = async (file: File): Promise<UserMediaRecord | null> => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await requestFetch<UserMediaRecord & { url: string }>('/api/r2/upload', {
        method: 'POST',
        body: formData,
      });

      return result;
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error !== null && 'data' in error && typeof (error as { data?: { message?: string } }).data?.message === 'string')
          ? (error as { data: { message: string } }).data.message
          : (error instanceof Error ? error.message : 'Failed to upload file');

      uploadError.value = message;
      toast.add({
        title: 'Upload failed',
        description: message,
        color: 'error',
        icon: 'i-lucide-file-x',
      });
      return null;
    } finally {
      isUploading.value = false;
    }
  };

  /**
   * Delete a file from R2 and remove its DB record by UserMedia.id.
   * Ownership is verified server-side.
   */
  const deleteFile = async (mediaId: number): Promise<void> => {
    try {
      await requestFetch(`/api/r2/${mediaId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete R2 file:', error);
    }
  };

  return {
    isUploading: readonly(isUploading),
    uploadError: readonly(uploadError),
    getFileUrl,
    uploadFile,
    deleteFile,
  };
};
