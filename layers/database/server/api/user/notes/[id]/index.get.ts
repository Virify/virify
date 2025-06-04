import { getUserNote } from "../../../../utils/user-note";
import * as z from "zod";

const getSchema = z.object({
  id: z.coerce.number(),
});
/**
 * Get a user's note for a listing
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  const { id: listingId } = await getValidatedRouterParams(event, getSchema.parse);

  try {
    const userId = session?.user?.id;
    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing ID provided" });

    const note = await getUserNote(userId, listingId);

    return { note };
  } catch (error) {
    console.error(error);
    return errorResponse(error, event);
  }
});
