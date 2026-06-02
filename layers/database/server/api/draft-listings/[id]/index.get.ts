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

    const draftId = getRouterParam(event, "id");

    if (!draftId || isNaN(Number(draftId))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid draft listing ID",
      });
    }

    const draftIdNum = Number(draftId);
    const draft = await getDraftListingById(draftIdNum);

    if (!draft) {
      throw createError({
        statusCode: 404,
        statusMessage: "Draft listing not found",
      });
    }

    // Allow access if the user is the owner or a shared user
    const isOwner = draft.userId === user.id;
    const isSharedUser = draft.sharedUsers.some((u) => u.id === user.id);

    if (!isOwner && !isSharedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: "Draft listing not found",
      });
    }

    return draft;
  } catch (error) {
    console.log(error);
    throw errorResponse(error, event);
  }
});
