/**
 * Get user favourites
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const { errorResponse } = useResponse();
  try {
    const userId = session?.user?.id;
    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    const result = await getUserFavourites(userId as number);
    return result;
  } catch (error) {
    console.log(error)
    errorResponse(error, event);
  }
});
