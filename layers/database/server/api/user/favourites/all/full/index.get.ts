import * as z from "zod";

const favouritesQuerySchema = z.object({
  filter: z.enum(['all', 'sale', 'rent']).optional().default('all'),
  sort: z.enum(['newest', 'oldest']).optional().default('newest'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

/**
 * Get user saved listings (favourites) with full listing data (paginated)
 *
 * GET /api/user/favourites/all/full
 * Cached per user+query params (5 min). Busted on fav add/remove/clear.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const query = await getValidatedQuery(event, favouritesQuerySchema.parse);
    const cacheKey = `favs:full:${userId}:${query.filter}:${query.sort}:${query.page}:${query.limit}`;
    const storage = useStorage('cache');

    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const skip = (query.page - 1) * query.limit;
    const result = await getUserFavourites(userId as number, {
      skip,
      take: query.limit,
      sort: query.sort,
      filter: query.filter,
    });

    storage.setItem(cacheKey, result, { ttl: 300 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return errorResponse(error, event);
  }
});
