import { getUserListingAnalytics } from "~~/layers/database/server/utils/analytics";
import type { UserAnalyticsSummary } from "~~/shared/types/analytics";

/**
 * Handler for GET /api/analytics/listing/all/
 * Returns analytics summary for all user's listings
 */
export default defineEventHandler(async (event): Promise<UserAnalyticsSummary> => {
  const { user } = await requireUserSession(event);
  try {
    if(!user.id) throw createError({
      statusCode: 401,
      message: "User not authenticated"
    });
    const analytics = await getUserListingAnalytics(user.id);
  
    return analytics as UserAnalyticsSummary;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch analytics",
    });
  }
});
