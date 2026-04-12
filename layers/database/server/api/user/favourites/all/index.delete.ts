/**
 * Delete all saved listings from user favourites
 * 
 * DELETE /api/user/favourites/all
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const result = await deleteAllFavourites(userId as number);

    // Invalidate lookups + full-page + recent cache so the next GET returns an empty set
    useStorage('cache').removeItem(`favs:lookups:${userId}`).catch(() => {});
    await invalidateFavouritesFullCache(userId as number);
    await invalidateFavouritesRecentCache(userId as number);

    return result;
  } catch (error) {
    console.error("Error deleting all favourites:", error);
    return errorResponse(error, event);
  }
});
