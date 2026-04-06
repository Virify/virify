import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';

// $fetch is a Nuxt global — stub it before any imports resolve
const fetchMock = vi.fn();
vi.stubGlobal('$fetch', fetchMock);

vi.mock('#imports', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useUserSession: () => ({ loggedIn: ref(true) }),
    useRequestFetch: () => fetchMock,
    useToast: () => ({ add: vi.fn() }),
    ref,
    computed: actual.computed,
    watch: actual.watch,
  };
});

// createSharedComposable caches the instance — reset modules each test for isolation
beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('useMyListings', () => {
  describe('archiveListing', () => {
    it('calls DELETE /api/user/my-listings/:id', async () => {
      fetchMock.mockResolvedValueOnce({});
      const { useMyListings } = await import('../../../app/composables/useMyListings');
      const { archiveListing } = useMyListings();
      await archiveListing(5);
      expect(fetchMock).toHaveBeenCalledWith('/api/user/my-listings/5', { method: 'DELETE' });
    });

    it('removes the listing from local state', async () => {
      fetchMock.mockResolvedValueOnce({});
      const { useMyListings } = await import('../../../app/composables/useMyListings');
      const { listings, total, archiveListing } = useMyListings();
      listings.value = [{ id: 5 } as any, { id: 6 } as any];
      total.value = 2;

      await archiveListing(5);

      expect(listings.value).toHaveLength(1);
      expect(listings.value[0]!.id).toBe(6);
      expect(total.value).toBe(1);
    });

    it('rethrows on failure', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));
      const { useMyListings } = await import('../../../app/composables/useMyListings');
      const { archiveListing } = useMyListings();
      await expect(archiveListing(5)).rejects.toThrow();
    });
  });

  describe('restoreListing', () => {
    it('calls POST /api/listing/restore with the listing ID in the body', async () => {
      fetchMock.mockResolvedValueOnce({ success: true });
      const { useMyListings } = await import('../../../app/composables/useMyListings');
      const { restoreListing } = useMyListings();
      await restoreListing(10);
      expect(fetchMock).toHaveBeenCalledWith('/api/listing/restore', {
        method: 'POST',
        body: { listingId: 10 },
      });
    });

    it('removes the listing from the local archived view', async () => {
      fetchMock.mockResolvedValueOnce({ success: true });
      const { useMyListings } = await import('../../../app/composables/useMyListings');
      const { listings, total, restoreListing } = useMyListings();
      listings.value = [{ id: 10 } as any, { id: 11 } as any];
      total.value = 2;

      await restoreListing(10);

      expect(listings.value).toHaveLength(1);
      expect(listings.value[0]!.id).toBe(11);
      expect(total.value).toBe(1);
    });

    it('does not remove anything from local state if ID is not found', async () => {
      fetchMock.mockResolvedValueOnce({ success: true });
      const { useMyListings } = await import('../../../app/composables/useMyListings');
      const { listings, total, restoreListing } = useMyListings();
      listings.value = [{ id: 99 } as any];
      total.value = 1;

      await restoreListing(999);

      expect(listings.value).toHaveLength(1);
      expect(total.value).toBe(1);
    });
  });
});
