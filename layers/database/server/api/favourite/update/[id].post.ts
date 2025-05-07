/**
 * Add a listing to the user's favourites from the UserFavourites table
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await getUserSession(event);
  const { listing } = await readBody(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const listings = await addFavouriteFromUserFavourites(userId, listing);

    return listings;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
