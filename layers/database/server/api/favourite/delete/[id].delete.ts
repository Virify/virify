export default defineEventHandler(async (event) => {

  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  const userId = session?.user?.id;
  try {

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    const { listing } = await readBody(event);

    if (!listing) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing provided" });

    const result = await deleteFavouriteFromUserFavourites(userId as number, listing);

    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
}
);