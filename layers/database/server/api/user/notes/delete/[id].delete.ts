import { deleteUserNote } from "../../../../utils/user-note";
import * as z from "zod";

const deleteSchema = z.object({
  listingId: z.coerce.number(),
});
/**
 * Delete a user's note for a listing
 *
 * @param event - The event object containing request data
 * @returns A success response or error
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  const { listingId } = await readValidatedBody(event, deleteSchema.parse);

  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing ID provided" });

    return await deleteUserNote(userId, listingId);
  } catch (error) {
    console.error("Error deleting note:", error);
    return errorResponse(error, event);
  }
});
