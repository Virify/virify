import { getUserListingAnalytics } from "../../utils/analytics";
import type { UserAnalyticsSummary } from "../../../../../shared/types/analytics";

export default defineEventHandler(async (event) => {
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
