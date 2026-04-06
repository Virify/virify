/**
 * Server-side cache invalidation utilities (Nitro/unstorage).
 * Cannot be used in client code — useStorage is Nitro-only.
 */

/**
 * Invalidate the cache for a specific listing.
 * Call this whenever a listing is updated.
 */
export async function invalidateListingCache(listingId: number): Promise<void> {
  const storage = useStorage("cache:listing");
  await storage.removeItem(`listing:${listingId}`);
}

/**
 * Invalidate cache for multiple listings at once.
 */
export async function invalidateListingCaches(listingIds: number[]): Promise<void> {
  const storage = useStorage("cache:listing");
  await Promise.all(listingIds.map((id) => storage.removeItem(`listing:${id}`)));
}

/**
 * Invalidate the short-TTL aggregates cache for a user.
 * Call this whenever an action changes badge counts (archive, restore, publish, etc.)
 * so the next fetchUserItemsAggregates() call hits the DB and returns fresh counts.
 */
export async function invalidateAggregatesCache(userId: number): Promise<void> {
  const storage = useStorage("cache:aggregates");
  await storage.removeItem(`aggregates:user:${userId}`);
}
