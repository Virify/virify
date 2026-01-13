/**
 * Get lightweight favourites lookups (listing IDs only)
 * Used for checking if listings are favourited without fetching full data
 * 
 * GET /api/user/favourites/all/lookups
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    return await getUserFavouriteLookups(userId as number);
  } catch (error) {
    console.error("Error fetching favourite lookups:", error);
    return errorResponse(error, event);
  }
});
