import { getUserSavedLocations } from "~~/layers/database/server/utils/user-saved-location";

/**
 * GET /api/user/locations
 * Cached per user (10 min). Busted on location add/update/delete.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();
  try {
    if (!user.id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const cacheKey = `locations:${user.id}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const result = await getUserSavedLocations(user.id);
    storage.setItem(cacheKey, result, { ttl: 60 * 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
