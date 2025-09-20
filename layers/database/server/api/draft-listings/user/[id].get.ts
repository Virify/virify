/**
 * GET /api/draft-listings/user/:id
 * Retrieve all draft listings for a specific user.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();

  try {
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    return getDraftListingsByUserId(user.id);
  } catch (error) {
    console.log(error);
    throw errorResponse(error, event);
  }
});
