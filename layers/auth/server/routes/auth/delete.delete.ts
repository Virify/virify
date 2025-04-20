/**
 * Handles the request to delete an owner account.
 *
 * @param event - The H3 event object representing the request.
 * @returns A standardized HTTP response indicating success or failure.
 */
export default defineEventHandler(async (event) => {
  const { successResponse, errorResponse } = useResponse();

  try {
    const session = await getUserSession(event);

    if (!session || !session.user?.id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const ownerId = session.user.id;
    const deleted = await deleteOwner(ownerId);

    if (!deleted) throw createError({ statusCode: 400, statusMessage: "Failed to delete user. User may not exist" });

    return successResponse("Deleted Successfully! Redirecting to homepage...");
  } catch (error) {
    return errorResponse(error, event);
  }
});
