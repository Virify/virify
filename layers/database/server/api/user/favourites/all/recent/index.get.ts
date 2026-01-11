/**
 * Get recent user favourites (last 7 days, limited to 8 items)
 * Used for dashboard homepage
 * 
 * GET /api/user/favourites/all/recent
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const favourites = await getRecentFavourites(userId as number, 10);

    return favourites;
  } catch (error) {
    console.error("Error fetching recent favourites:", error);
    return errorResponse(error, event);
  }
});
