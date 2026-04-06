/**
 * Get lightweight favourites lookups (listing IDs only)
 * Used for checking if listings are favourited without fetching full data
 * Cached per-user for 60 seconds; invalidated on any favourite add/remove.
 *
 * GET /api/user/favourites/all/lookups
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `favs:lookups:${userId}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const result = await getUserFavouriteLookups(userId as number);
    storage.setItem(cacheKey, result, { ttl: 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching favourite lookups:", error);
    return errorResponse(error, event);
  }
});
