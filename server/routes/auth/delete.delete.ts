/**
 * Handles the request to delete an owner account.
 *
 * @param event - The H3 event object representing the request.
 * @returns A standardized HTTP response indicating success or failure.
 */
export default defineEventHandler(async (event) => {
  const { successResponse, errorResponse } = useResponse();

  try {
    // Retrieve the user session
    const session = await getUserSession(event);

    // Ensure the session and user exist
    if (!session || !session.user?.id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    // Extract the owner ID from the session
    const ownerId = session.user.id;

    // Attempt to delete the owner
    const deleted = await deleteOwner(ownerId);

    // Throw an error if the owner was not deleted
    if (!deleted) throw createError({ statusCode: 400, statusMessage: "Failed to delete user. User may not exist" });

    // Return a success response
    return successResponse("Deleted Successfully! Redirecting to homepage...");
  } catch (error) {
    return errorResponse(error, event);
  }
});
