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

// ─── Paginated full-page cache busters ────────────────────────────────────────
// These sweep all pagination variants for a user using a key prefix so every
// page/filter/sort combination is invalidated together on mutation.

async function sweepPrefix(storage: ReturnType<typeof useStorage>, prefix: string): Promise<void> {
  const keys = await storage.getKeys(prefix);
  await Promise.all(keys.map((k) => storage.removeItem(k)));
}

/** Bust the recent favourites cache for a user. */
export async function invalidateFavouritesRecentCache(userId: number): Promise<void> {
  await useStorage("cache").removeItem(`favs:recent:${userId}`);
}

/** Bust all paginated favourites full-page cache entries for a user. */
export async function invalidateFavouritesFullCache(userId: number): Promise<void> {
  await sweepPrefix(useStorage("cache"), `favs:full:${userId}:`);
}

/** Bust all paginated notes full-page cache entries for a user. */
export async function invalidateNotesFullCache(userId: number): Promise<void> {
  await sweepPrefix(useStorage("cache"), `notes:full:${userId}:`);
}

/** Bust all paginated my-listings cache entries for a user. */
export async function invalidateMyListingsCache(userId: number): Promise<void> {
  await sweepPrefix(useStorage("cache"), `my-listings:${userId}:`);
}

/** Bust all paginated hidden-listings full-page cache entries for a user. */
export async function invalidateHiddenListingsFullCache(userId: number): Promise<void> {
  await sweepPrefix(useStorage("cache"), `hidden:full:${userId}:`);
}

/** Bust all paginated draft-listings cache entries for a user. */
export async function invalidateDraftListingsCache(userId: number): Promise<void> {
  await sweepPrefix(useStorage("cache"), `draft-listings:${userId}:`);
}

/** Bust all viewings cache entries for a user. */
export async function invalidateViewingsCache(userId: number): Promise<void> {
  await sweepPrefix(useStorage("cache"), `viewings:${userId}:`);
}

// ─── Single-key cache busters ─────────────────────────────────────────────────

/** Bust the saved locations list cache for a user. */
export async function invalidateLocationsCache(userId: number): Promise<void> {
  await useStorage("cache").removeItem(`locations:${userId}`);
}

/** Bust the sent-conversations listing-ID list cache for a user. */
export async function invalidateConversationSentCache(userId: number): Promise<void> {
  await useStorage("cache").removeItem(`conv:sent:${userId}`);
}

/** Bust the recently-viewed listings cache for a user. */
export async function invalidateRecentViewedCache(userId: number): Promise<void> {
  await useStorage("cache").removeItem(`recent-viewed:${userId}`);
}

/** Bust the property detail cache for a specific property. */
export async function invalidatePropertyCache(propertyId: number): Promise<void> {
  await useStorage("cache").removeItem(`property:${propertyId}`);
}
