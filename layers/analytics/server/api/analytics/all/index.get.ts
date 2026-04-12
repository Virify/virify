import { getUserListingAnalytics } from "~~/layers/database/server/utils/analytics";
import type { UserAnalyticsSummary } from "~~/shared/types/analytics";

/**
 * Handler for GET /api/analytics/all/
 * Returns all analytics data for the user.
 * Cached per-user for 10 minutes (TTL-only — analytics data is latency-tolerant).
 */
export default defineEventHandler(async (event): Promise<UserAnalyticsSummary> => {
  const { user } = await requireUserSession(event);
  try {
    if(!user.id) throw createError({
      statusCode: 401,
      message: "User not authenticated"
    });

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
