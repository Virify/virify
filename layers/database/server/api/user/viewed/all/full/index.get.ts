import * as z from "zod";

const viewedQuerySchema = z.object({
  filter: z.enum(["all", "sale", "rent"]).optional().default("all"),
  sort: z.enum(["newest", "oldest", "listing-newest", "listing-oldest"]).optional().default("newest"),
  period: z.enum(["30", "60", "all"]).optional().default("30"),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

/**
 * Get user viewed listings with full listing data (paginated)
 *
 * GET /api/user/viewed/all/full
 * Cached per user+query params (5 min).
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const query = await getValidatedQuery(event, viewedQuerySchema.parse);
    const cacheKey = `viewed:full:${userId}:${query.filter}:${query.sort}:${query.period}:${query.page}:${query.limit}`;
    const storage = useStorage("cache");

    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const skip = (query.page - 1) * query.limit;
    const result = await getViewedListingsPaginated(userId as number, {
      skip,
      take: query.limit,
      sort: query.sort,
      filter: query.filter,
      period: query.period,
    });

    storage.setItem(cacheKey, result, { ttl: 30 * 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching viewed listings:", error);
    return errorResponse(error, event);
  }
});
