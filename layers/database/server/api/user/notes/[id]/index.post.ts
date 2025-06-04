import * as zod from "zod";
import { updateUserNote } from "../../../../utils/user-note";

/**
 * Zod automatically santizes the input
 */
const updateSchema = zod.object({
  listingId: zod.coerce.number(),
  note: zod.string(),
});

/**
 * Update a user's note for a listing
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  const { listingId, note } = await readValidatedBody(event, updateSchema.parse);

  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing ID provided" });

    return await updateUserNote(userId, listingId, note);
  } catch (error) {
    console.error(error);
    return errorResponse(error, event);
  }
});
