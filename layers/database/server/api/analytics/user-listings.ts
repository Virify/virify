import { getUserListingAnalytics } from "../../utils/analytics";
import type { UserAnalyticsSummary } from "../../../../../shared/types/analytics";

export default defineEventHandler(async (event) => {
  try {
    // Get current user
    const { user } = await getUserSession(event);

    if (!user?.id) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

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
