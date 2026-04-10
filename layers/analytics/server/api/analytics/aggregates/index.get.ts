import { getAnalyticsAggregates } from "~~/layers/database/server/utils/analytics";
import type { AnalyticsAggregates } from "~~/shared/types/analytics";

/**
 * Handler for GET /api/analytics/aggregates/
 * Returns the analytics aggregates for various user metrics.
 * Cached per-user for 5 minutes (TTL-only — analytics data is latency-tolerant).
 */
export default defineEventHandler(async (event): Promise<AnalyticsAggregates> => {
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `analytics:aggregates:${user.id}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem<AnalyticsAggregates>(cacheKey);
    if (cached) return cached;

    const result = await getAnalyticsAggregates(user.id as number);
    storage.setItem(cacheKey, result, { ttl: 5 * 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching analytics aggregates:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
