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

    return result;
  } catch (error) {
    console.error("Error deleting all favourites:", error);
    return errorResponse(error, event);
  }
});
