import { getAllUserNotes } from "~~/layers/database/server/utils/user-note";
import * as z from "zod";

const notesQuerySchema = z.object({
  filter: z.enum(['all', 'sale', 'rent']).optional().default('all'),
  sort: z.enum(['newest', 'oldest']).optional().default('newest'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

/**
 * Get all of a user's notes with full listing data (paginated)
 * 
 * GET /api/user/notes/all/full
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const query = await getValidatedQuery(event, notesQuerySchema.parse);
    const skip = (query.page - 1) * query.limit;

    return await getAllUserNotes(userId, {
      skip,
      take: query.limit,
      sort: query.sort,
      filter: query.filter,
    });
  } catch (error) {
    console.error("Error fetching all notes:", error);
    return errorResponse(error, event);
  }
});
