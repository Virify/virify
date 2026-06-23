import { z } from "zod";

const schema = z.object({
  userId: z.number().int(),
});

/**
 * DELETE /api/draft-listings/:id/share
 * Remove a user from the sharedUsers of a draft listing.
 * Only the owner of the draft may remove shared users.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const draftId = getRouterParam(event, "id");

  if (!draftId || isNaN(Number(draftId))) {
    throw createError({ statusCode: 400, message: "Invalid draft listing ID" });
  }

  const { userId } = await readValidatedBody(event, schema.parse);
  const draftIdNum = Number(draftId);

  const draft = await getDraftListingOwner(draftIdNum);

  if (!draft) {
    throw createError({ statusCode: 404, message: "Draft listing not found" });
  }

  if (draft.userId !== user.id) {
    throw createError({
      statusCode: 403,
      message: "You do not have permission to modify this draft listing",
    });
  }

  const updated = await removeSharedUserFromDraftListing(draftIdNum, userId);

  // Bust owner and admin draft listing caches so sharing changes are reflected immediately.
  await invalidateDraftListingsCache(user.id as number);

  return {
    success: true,
    sharedUsers: updated.sharedUsers,
  };
});
