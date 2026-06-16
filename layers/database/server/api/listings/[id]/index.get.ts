/**
 * GET /api/listings/:id
 * Retrieve a single listing by ID for editing.
 * Only returns the listing if it belongs to the authenticated user.
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

    const listingId = getRouterParam(event, "id");

    if (!listingId || isNaN(Number(listingId))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid listing ID",
      });
    }

    const listingIdNum = Number(listingId);
    const listing = await getListingByIdForEdit(listingIdNum, user as any);

    // Return 404 if listing doesn't exist or doesn't belong to the user
    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Listing not found",
      });
    }

    return listing;
  } catch (error) {
    console.log(error);
    throw errorResponse(error, event);
  }
});
