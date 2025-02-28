/**
 * Handles the request to delete an owner account.
 * 
 * @param event - The H3 event object representing the request.
 * @returns A standardized HTTP response indicating success or failure.
 */
export default defineEventHandler(async (event) => {
  const { successResponse, internalServerError } = useResponse();

  try {
    // Retrieve the user session
    const session = await getUserSession(event);

    // Ensure the session and user exist
    if (!session || !session.user?.id) {
      throw new Error("Failed to retrieve user session");
    }

    const ownerId = session.user.id;

    // Attempt to delete the owner
    const deleted = await deleteOwner(ownerId);

    if (!deleted) {
      throw new Error("Failed to delete owner. Owner may not exist.");
    }

    // Return a success response
    return successResponse("Owner deleted successfully");
  } catch (error) {
    // Return an internal server error response
    return internalServerError(error as Error);
  }
});
