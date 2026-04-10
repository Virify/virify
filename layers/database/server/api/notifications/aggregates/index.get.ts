/**
 * Handler for GET /api/notifications/aggregates/
 * Returns user notification counts for navigation badges.
 *
 * Per-user cache (5 minutes): busted on every badge-affecting mutation
 * (fav/note/hide add/delete, publish, archive, restore, mark-read).
 * TTL is a safety net for missed WS events only.
 */
export default defineEventHandler(async (event): Promise<UserItemsAggregates> => {
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `aggregates:user:${user.id}`;
    const storage = useStorage('cache:aggregates');

    const cached = await storage.getItem<UserItemsAggregates>(cacheKey);
    if (cached) return cached;

    const result = await getUserItemsAggregates(user.id as number);
    // Fire-and-forget cache write — don't block the response
    storage.setItem(cacheKey, result, { ttl: 5 * 60 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Error fetching user items aggregates:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
