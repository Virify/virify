export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const cacheKey = `notes:recent:${user.id}`;
    const storage = useStorage('cache');
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const result = await getRecentUserNotes(user.id as number);
    storage.setItem(cacheKey, result, { ttl: 30 }).catch(() => {});
    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
