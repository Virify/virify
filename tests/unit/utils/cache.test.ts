import { describe, it, expect, vi, beforeEach } from 'vitest';

// useStorage is a Nitro global — mock it on globalThis before importing the module
const storageMocks = {
  'cache:listing': { removeItem: vi.fn().mockResolvedValue(undefined) },
  'cache:aggregates': { removeItem: vi.fn().mockResolvedValue(undefined) },
};

vi.stubGlobal('useStorage', (namespace: string) => storageMocks[namespace as keyof typeof storageMocks]);

describe('cache utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('invalidateListingCache', () => {
    it('removes the correct cache key for a listing', async () => {
      const { invalidateListingCache } = await import('../../../layers/database/server/utils/cache');
      await invalidateListingCache(42);
      expect(storageMocks['cache:listing'].removeItem).toHaveBeenCalledOnce();
      expect(storageMocks['cache:listing'].removeItem).toHaveBeenCalledWith('listing:42');
    });

    it('does not touch the aggregates namespace', async () => {
      const { invalidateListingCache } = await import('../../../layers/database/server/utils/cache');
      await invalidateListingCache(99);
      expect(storageMocks['cache:aggregates'].removeItem).not.toHaveBeenCalled();
    });
  });

  describe('invalidateListingCaches', () => {
    it('removes a key for each listing ID', async () => {
      const { invalidateListingCaches } = await import('../../../layers/database/server/utils/cache');
      await invalidateListingCaches([1, 2, 3]);
      expect(storageMocks['cache:listing'].removeItem).toHaveBeenCalledTimes(3);
      expect(storageMocks['cache:listing'].removeItem).toHaveBeenCalledWith('listing:1');
      expect(storageMocks['cache:listing'].removeItem).toHaveBeenCalledWith('listing:2');
      expect(storageMocks['cache:listing'].removeItem).toHaveBeenCalledWith('listing:3');
    });

    it('does nothing when given an empty array', async () => {
      const { invalidateListingCaches } = await import('../../../layers/database/server/utils/cache');
      await invalidateListingCaches([]);
      expect(storageMocks['cache:listing'].removeItem).not.toHaveBeenCalled();
    });
  });

  describe('invalidateAggregatesCache', () => {
    it('removes the correct cache key for a user', async () => {
      const { invalidateAggregatesCache } = await import('../../../layers/database/server/utils/cache');
      await invalidateAggregatesCache(7);
      expect(storageMocks['cache:aggregates'].removeItem).toHaveBeenCalledOnce();
      expect(storageMocks['cache:aggregates'].removeItem).toHaveBeenCalledWith('aggregates:user:7');
    });

    it('does not touch the listing namespace', async () => {
      const { invalidateAggregatesCache } = await import('../../../layers/database/server/utils/cache');
      await invalidateAggregatesCache(7);
      expect(storageMocks['cache:listing'].removeItem).not.toHaveBeenCalled();
    });
  });
});

