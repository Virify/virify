import { getRecentViewedListings } from "~~/layers/database/server/utils/analytics";

/**
 * Fetches recent viewed listings for the authenticated user
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  try {
    if (!user.id) throw createError({statusCode: 401, statusMessage: "User ID is required"});

    return await getRecentViewedListings(user.id);
  } catch (error) {
    console.error("Error fetching recent viewed listings:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
