import { getUserListingAnalytics } from "~~/layers/database/server/utils/analytics";
import type { UserAnalyticsSummary } from "~~/shared/types/analytics";

/**
 * Handler for GET /api/analytics/listing/all/
 * Returns analytics summary for all user's listings.
 * Cached per-user for 10 minutes (shares key with /api/analytics/all).
 */
export default defineEventHandler(async (event): Promise<UserAnalyticsSummary> => {
  const { user } = await requireUserSession(event);
  try {
    if(!user.id) throw createError({
      statusCode: 401,
      message: "User not authenticated"
    });

    // Reuse the same cache key as /api/analytics/all — identical data
    const cacheKey = `analytics:all:${user.id}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem<UserAnalyticsSummary>(cacheKey);
    if (cached) return cached;

    const analytics = await getUserListingAnalytics(user.id);
    storage.setItem(cacheKey, analytics, { ttl: 10 * 60 }).catch(() => {});
    return analytics as UserAnalyticsSummary;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch analytics",
    });
  }
});
