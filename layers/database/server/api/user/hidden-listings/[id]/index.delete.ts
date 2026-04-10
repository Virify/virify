import * as zod from "zod";

const unhideSchema = zod.object({
  listingId: zod.coerce.number(),
});

/**
 * Unhide a listing for the authenticated user
 *
 * DELETE /api/user/hidden-listings/:id
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  const { listingId } = await readValidatedBody(event, unhideSchema.parse);

  try {
    if (!user.id) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing ID provided" });

    await unhideListingForUser(user.id, listingId);

    // Invalidate lookups + full-page cache and aggregates badge
    useStorage("cache").removeItem(`hidden-listings:lookups:${user.id}`).catch(() => {});
    await invalidateHiddenListingsFullCache(user.id as number);
    await invalidateAggregatesCache(user.id as number);

    return { success: true };
  } catch (error) {
    console.error("Error unhiding listing:", error);
    return errorResponse(error, event);
  }
});
