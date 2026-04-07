import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';

// ─── Hoisted mocks (must run before any imports) ──────────────────────────────

const mockToastAdd = vi.fn();
const mockRequestFetch = vi.fn();
const mockGetR2Url = 'https://pub-abc.r2.dev';

vi.mock('#imports', async () => {
  const vue = await import('vue');
  return {
    ref: vue.ref,
    readonly: vue.readonly,
    useToast: () => ({ add: mockToastAdd }),
    useRequestFetch: () => mockRequestFetch,
    useRuntimeConfig: () => ({
      public: { CF_R2_URL: mockGetR2Url },
    }),
  };
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useCloudflareR2', () => {
  describe('getFileUrl', () => {
    it('concatenates the public R2 base URL with the key', () => {
      const CF_R2_URL = mockGetR2Url;
      const getFileUrl = (key: string) => `${CF_R2_URL}/${key}`;

      expect(getFileUrl('user-media/1/abc.png')).toBe('https://pub-abc.r2.dev/user-media/1/abc.png');
    });

    it('preserves nested key paths', () => {
      const CF_R2_URL = mockGetR2Url;
      const getFileUrl = (key: string) => `${CF_R2_URL}/${key}`;

      expect(getFileUrl('user-media/42/some-uuid.pdf')).toBe('https://pub-abc.r2.dev/user-media/42/some-uuid.pdf');
    });
  });

  describe('uploadFile', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('returns the UserMediaRecord on success', async () => {
      const mockResult = {
        id: 1,
        key: 'user-media/1/abc.png',
        mediaType: 'IMAGE',
        mimeType: 'image/png',
        originalName: 'photo.png',
        size: 1024,
        createdAt: new Date(),
        url: 'https://pub-abc.r2.dev/user-media/1/abc.png',
      };
      mockRequestFetch.mockResolvedValueOnce(mockResult);

      const isUploading = ref(false);
      const uploadError = ref<string | null>(null);

      const uploadFile = async (file: File) => {
        isUploading.value = true;
        uploadError.value = null;
        try {
          const formData = new FormData();
          formData.append('file', file);
          return await mockRequestFetch('/api/r2/upload', { method: 'POST', body: formData });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to upload file';
          uploadError.value = message;
          mockToastAdd({ title: 'Upload failed', description: message, color: 'error', icon: 'i-lucide-file-x' });
          return null;
        } finally {
          isUploading.value = false;
        }
      };

      const file = new File(['content'], 'photo.png', { type: 'image/png' });
      const result = await uploadFile(file);

      expect(result).toEqual(mockResult);
      expect(isUploading.value).toBe(false);
      expect(uploadError.value).toBeNull();
    });

    it('sets uploadError and shows a toast on failure', async () => {
      mockRequestFetch.mockRejectedValueOnce(new Error('Network error'));

      const isUploading = ref(false);
      const uploadError = ref<string | null>(null);

      const uploadFile = async (file: File) => {
        isUploading.value = true;
        uploadError.value = null;
        try {
          const formData = new FormData();
          formData.append('file', file);
          return await mockRequestFetch('/api/r2/upload', { method: 'POST', body: formData });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to upload file';
          uploadError.value = message;
          mockToastAdd({ title: 'Upload failed', description: message, color: 'error', icon: 'i-lucide-file-x' });
          return null;
        } finally {
          isUploading.value = false;
        }
      };

      const file = new File(['content'], 'photo.png', { type: 'image/png' });
      const result = await uploadFile(file);

      expect(result).toBeNull();
      expect(uploadError.value).toBe('Network error');
      expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Upload failed',
        description: 'Network error',
        color: 'error',
      }));
      expect(isUploading.value).toBe(false);
    });

    it('resets isUploading to false even when an error is thrown', async () => {
      mockRequestFetch.mockRejectedValueOnce(new Error('Timeout'));

      const isUploading = ref(false);

      const uploadFile = async (file: File) => {
        isUploading.value = true;
        try {
          return await mockRequestFetch('/api/r2/upload', { method: 'POST', body: new FormData() });
        } catch {
          return null;
        } finally {
          isUploading.value = false;
        }
      };

      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      await uploadFile(file);

      expect(isUploading.value).toBe(false);
    });

    it('extracts the error message from a structured fetch error response', async () => {
      const fetchError = { data: { message: 'File exceeds the 10 MB size limit.' } };
      mockRequestFetch.mockRejectedValueOnce(fetchError);

      const uploadError = ref<string | null>(null);

      const uploadFile = async (file: File) => {
        try {
          return await mockRequestFetch('/api/r2/upload', { method: 'POST', body: new FormData() });
        } catch (error: unknown) {
          const message =
            (typeof error === 'object' && error !== null && 'data' in error &&
              typeof (error as { data?: { message?: string } }).data?.message === 'string')
              ? (error as { data: { message: string } }).data.message
              : (error instanceof Error ? error.message : 'Failed to upload file');
          uploadError.value = message;
          return null;
        }
      };

      const file = new File(['x'.repeat(11 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
      await uploadFile(file);

      expect(uploadError.value).toBe('File exceeds the 10 MB size limit.');
    });
  });

  describe('deleteFile', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('calls DELETE /api/r2/{mediaId}', async () => {
      mockRequestFetch.mockResolvedValueOnce(undefined);

      const deleteFile = async (mediaId: number) => {
        await mockRequestFetch(`/api/r2/${mediaId}`, { method: 'DELETE' });
      };

      await deleteFile(7);

      expect(mockRequestFetch).toHaveBeenCalledWith('/api/r2/7', { method: 'DELETE' });
    });

    it('silently catches errors and does not propagate (fire-and-forget pattern)', async () => {
      mockRequestFetch.mockRejectedValueOnce(new Error('Not found'));

      let caughtError: Error | null = null;

      const deleteFile = async (mediaId: number) => {
        try {
          await mockRequestFetch(`/api/r2/${mediaId}`, { method: 'DELETE' });
        } catch (error) {
          caughtError = error as Error;
          // intentionally swallowed
        }
      };

      await expect(deleteFile(99)).resolves.toBeUndefined();
      expect(caughtError).toBeInstanceOf(Error);
      expect((caughtError as unknown as Error).message).toBe('Not found');
    });
  });
});
