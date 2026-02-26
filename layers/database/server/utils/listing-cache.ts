/**
 * Utility functions for managing listing cache
 */

/**
 * Invalidate the cache for a specific listing
 * Call this whenever a listing is updated
 */
export async function invalidateListingCache(listingId: number): Promise<void> {
  const storage = useStorage("cache:listing");
  const cacheKey = `listing:${listingId}`;
  await storage.removeItem(cacheKey);
}

/**
 * Invalidate cache for multiple listings
 */
export async function invalidateListingCaches(listingIds: number[]): Promise<void> {
  const storage = useStorage("cache:listing");
  await Promise.all(
    listingIds.map(id => storage.removeItem(`listing:${id}`))
  );
}
