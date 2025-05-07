
/**
 * Delete all listings from user favourites
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  const userId = session?.user?.id;
  try {
    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const result = await deleteAllFavouritesFromUserFavourites(userId as number);

    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
}
);