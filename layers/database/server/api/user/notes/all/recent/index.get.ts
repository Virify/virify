/**
 * Get recent user notes (last 7 days, limited to 8 items)
 * Used for dashboard homepage.
 * Cached per-user for 30 seconds to absorb concurrent dashboard mounts.
 *
 * GET /api/user/notes/all/recent
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);

  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `notes:recent:${userId}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const notes = await getRecentUserNotes(userId as number, 8);
    storage.setItem(cacheKey, notes, { ttl: 2 * 60 }).catch(() => {});
    return notes;
  } catch (error) {
    console.error("Error fetching recent notes:", error);
    return errorResponse(error, event);
  }
});
