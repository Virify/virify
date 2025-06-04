/**
 * Delete all saved listings from user favourites
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
    console.log(error);
    return errorResponse(error, event);
  }
});
