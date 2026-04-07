/**
 * Nitro task to bust ALL server-side caches.
 * Clears: listing cache, per-user aggregates cache, and the general cache
 * (mortgage, price-paid, favs/notes/hidden-listings lookups, notification counts).
 *
 * Triggered via POST /api/admin/cache/bust
 */
export default defineTask({
  meta: {
    name: "cache:bust",
    description: "Clears all server-side caches (listing, aggregates, general)",
  },
  async run() {
    try {
      const [listingStorage, aggregatesStorage, generalStorage] = [
        useStorage("cache:listing"),
        useStorage("cache:aggregates"),
        useStorage("cache"),
      ];

      const [listingKeys, aggregateKeys, generalKeys] = await Promise.all([
        listingStorage.getKeys(),
        aggregatesStorage.getKeys(),
        generalStorage.getKeys(),
      ]);

      await Promise.all([
        listingStorage.clear(),
        aggregatesStorage.clear(),
        generalStorage.clear(),
      ]);

      console.log(`[cache:bust] Cleared ${listingKeys.length} listing, ${aggregateKeys.length} aggregate, ${generalKeys.length} general cache entries`);

      return {
        result: "success",
        cleared: {
          listing: listingKeys.length,
          aggregates: aggregateKeys.length,
          general: generalKeys.length,
        },
      };
    } catch (error) {
      console.error("[cache:bust] Failed to clear caches:", error);
      return {
        result: "error",
        error: (error as Error).message,
      };
    }
  },
});
