/**
 * Delete a draft listing by ID
 * Removes the draft listing and all associated relations via cascade
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const draftId = getRouterParam(event, 'id');
    
    if (!draftId || isNaN(Number(draftId))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid draft listing ID"
      });
    }

    const draftIdNum = Number(draftId);

    // Delete the draft listing - only if it belongs to the authenticated user
    // Prisma will throw if the record doesn't exist
    await prisma.draftListing.delete({
      where: { 
        id: draftIdNum,
        userId: user.id
      }
    });

    return {
      success: true,
      message: "Draft listing deleted successfully",
      deletedId: draftIdNum
    };

  } catch (error) {
    console.error("Error deleting draft listing:", error);
    return errorResponse(error, event);
  }
});