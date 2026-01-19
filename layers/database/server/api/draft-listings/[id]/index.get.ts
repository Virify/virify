/**
 * GET /api/draft-listings/:id
 * Retrieve a single draft listing by ID.
 * Only returns the draft if it belongs to the authenticated user.
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

    const draftId = getRouterParam(event, 'id');
    
    if (!draftId || isNaN(Number(draftId))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid draft listing ID"
      });
    }

    const draftIdNum = Number(draftId);
    const draft = await getDraftListingById(draftIdNum);

    // Return 404 if draft doesn't exist or doesn't belong to the user
    if (!draft || draft.userId !== user.id) {
      throw createError({
        statusCode: 404,
        statusMessage: "Draft listing not found"
      });
    }

    return draft;
  } catch (error) {
    console.log(error);
    throw errorResponse(error, event);
  }
});
