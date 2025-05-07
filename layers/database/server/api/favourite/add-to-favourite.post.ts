import type { UserSession } from "#auth-utils";

/**
 * Add a listing to the user's favourites from the UserFavourites table
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = (await getUserSession(event)) as UserSession;
  const { listing } = await readBody(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    console.log("userId", userId);
    console.log("listing", listing);

    const updateFavourite = await addFavouriteFromUserFavourites(userId, listing);

    return {
      statusCode: 200,
      message: "Favourites updated successfully",
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
