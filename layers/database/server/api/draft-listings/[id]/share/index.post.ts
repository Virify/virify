import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

/**
 * POST /api/draft-listings/:id/share
 * Add a user to the sharedUsers of a draft listing by exact email match.
 * Only the owner of the draft may share it.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const draftId = getRouterParam(event, "id");

  if (!draftId || isNaN(Number(draftId))) {
    throw createError({ statusCode: 400, message: "Invalid draft listing ID" });
  }

  const { email } = await readValidatedBody(event, schema.parse);
  const draftIdNum = Number(draftId);

  const draft = await getDraftListingOwner(draftIdNum);

  if (!draft) {
    throw createError({ statusCode: 404, message: "Draft listing not found" });
  }

  if (draft.userId !== user.id) {
    throw createError({
      statusCode: 403,
      message: "You do not have permission to share this draft listing",
    });
  }

  const targetUser = await findUser(email);

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      message: "No Virify account found with that email address",
    });
  }

  if (targetUser.id === user.id) {
    throw createError({
      statusCode: 422,
      message: "You cannot share a listing with yourself",
    });
  }

  const updated = await addSharedUserToDraftListing(draftIdNum, targetUser.id);

  // Bust owner and admin draft listing caches so sharing changes are reflected immediately.
  await invalidateDraftListingsCache(user.id as number);

  return {
    success: true,
    sharedUsers: updated.sharedUsers,
  };
});
