import * as zod from "zod";

const updateSchema = zod.object({
  listingId: zod.number().int().positive(),
  note: zod.string().optional(),
});

/**
 * Update a user's favourite listing
 * 
 * **optional** note
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await getUserSession(event);
  const { listingId, note } = await readValidatedBody(event, updateSchema.parse);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const listings = await updateFavouriteListing(userId, listingId, note);

    return listings;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
