/**
 * Delete a draft listing by ID
 * Removes the draft listing and all associated relations via cascade.
 * Also deletes any Cloudflare images uploaded for this draft.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const draftId = getRouterParam(event, "id");

    if (!draftId || isNaN(Number(draftId))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid draft listing ID",
      });
    }

    const draftIdNum = Number(draftId);

    // Fetch draft with media so we can clean up Cloudflare images
    const draft = await prisma.draftListing.findUnique({
      where: { id: draftIdNum, userId: user.id },
      include: { property: { include: { media: true } } },
    });

    if (!draft) {
      throw createError({
        statusCode: 404,
        statusMessage: "Draft listing not found",
      });
    }

    // Delete Cloudflare images — failures are logged but never block the DB delete
    const cloudflareIds =
      draft.property?.media
        .map((m) => m.image)
        .filter((id): id is string => !!id) ?? [];
    await deleteCloudflareImages(cloudflareIds);

    // Delete the draft listing — cascade handles all DB relations
    await prisma.draftListing.delete({
      where: {
        id: draftIdNum,
        userId: user.id,
      },
    });

    await Promise.all([
      invalidateDraftListingsCache(user.id as number),
      invalidateAggregatesCache(user.id as number),
    ]);

    return {
      success: true,
      message: "Draft listing deleted successfully",
      deletedId: draftIdNum,
    };
  } catch (error) {
    console.error("Error deleting draft listing:", error);
    return errorResponse(error, event);
  }
});
