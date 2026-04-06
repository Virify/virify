import { getUserNoteLookups } from "~~/layers/database/server/utils/user-note";

/**
 * Get lightweight notes lookups (listing IDs and note content only)
 * Used for checking if listings have notes and displaying note content without fetching full listing data.
 * Cached per-user for 60 seconds; invalidated on any note create/update/delete.
 *
 * GET /api/user/notes/all/lookups
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `notes:lookups:${userId}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const result = await getUserNoteLookups(userId as number);
    storage.setItem(cacheKey, result, { ttl: 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching note lookups:", error);
    return errorResponse(error, event);
  }
});
