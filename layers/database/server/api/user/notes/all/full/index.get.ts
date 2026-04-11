import { getAllUserNotes } from "~~/layers/database/server/utils/user-note";
import * as z from "zod";

const notesQuerySchema = z.object({
  filter: z.enum(['all', 'sale', 'rent']).optional().default('all'),
  sort: z.enum(['newest', 'oldest', 'listing-newest', 'listing-oldest']).optional().default('newest'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

/**
 * Get all of a user's notes with full listing data (paginated)
 *
 * GET /api/user/notes/all/full
 * Cached per user+query params (5 min). Busted on note create/update/delete.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const query = await getValidatedQuery(event, notesQuerySchema.parse);
    const cacheKey = `notes:full:${userId}:${query.filter}:${query.sort}:${query.page}:${query.limit}`;
    const storage = useStorage('cache');

    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const skip = (query.page - 1) * query.limit;
    const result = await getAllUserNotes(userId, {
      skip,
      take: query.limit,
      sort: query.sort,
      filter: query.filter,
    });

    storage.setItem(cacheKey, result, { ttl: 60 * 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching all notes:", error);
    return errorResponse(error, event);
  }
});
