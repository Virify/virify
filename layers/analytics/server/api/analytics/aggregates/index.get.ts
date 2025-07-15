import { getAnalyticsAggregates } from "~~/layers/database/server/utils/analytics";
import type { AnalyticsAggregates } from "~~/shared/types/analytics";

/**
 * Handler for GET /api/analytics/aggregates/
 * Returns the analytics aggregates for various user metrics
 */
export default defineEventHandler(async (event): Promise<AnalyticsAggregates> => {
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    return await getAnalyticsAggregates(user.id as number);
  } catch (error) {
    console.error("Error fetching analytics aggregates:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
