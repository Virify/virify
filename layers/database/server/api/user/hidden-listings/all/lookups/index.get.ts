/**
 * Get lightweight hidden listing lookups (listing IDs the user has hidden).
 * Cached per-user for 60 seconds; invalidated on hide/unhide.
 *
 * GET /api/user/hidden-listings/all/lookups
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);

  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `hidden-listings:lookups:${userId}`;
    const storage = useStorage("cache");
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const result = await getUserHiddenListingLookups(userId as number);
    storage.setItem(cacheKey, result, { ttl: 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching hidden listing lookups:", error);
    return errorResponse(error, event);
  }
});
