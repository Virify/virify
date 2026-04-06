/**
 * Get recent user favourites (last 7 days, limited to 8 items)
 * Used for dashboard homepage.
 * Cached per-user for 30 seconds to absorb concurrent dashboard mounts.
 *
 * GET /api/user/favourites/all/recent
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);

  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `favs:recent:${userId}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const favourites = await getRecentFavourites(userId as number, 10);
    storage.setItem(cacheKey, favourites, { ttl: 30 }).catch(() => {});
    return favourites;
  } catch (error) {
    console.error("Error fetching recent favourites:", error);
    return errorResponse(error, event);
  }
});
