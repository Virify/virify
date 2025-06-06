/**
 * Handler for GET /api/notifications/aggregates/
 * Returns user notification counts for navigation badges
 */
export default defineEventHandler(async (event): Promise<UserItemsAggregates> => {
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    return await getUserItemsAggregates(user.id as number);
  } catch (error) {
    console.error("Error fetching user items aggregates:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
