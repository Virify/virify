/**
 * Fetch listing IDs for which the authenticated user has already opened a conversation.
 *
 * GET /api/conversation/sent
 * Cached per user (10 min). Busted when user creates a new conversation.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const cacheKey = `conv:sent:${user.id}`;
  const storage = useStorage('cache');
  const cached = await storage.getItem(cacheKey);
  if (cached) return cached;

  const result = await getSentConversationListingIds(user.id);
  storage.setItem(cacheKey, result, { ttl: 60 * 60 }).catch(() => {});
  return result;
});