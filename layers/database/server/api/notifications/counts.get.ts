import { getNotificationCounts } from "~~/layers/database/server/utils/notification";

/**
 * GET /api/notifications/counts
 * Get notification counts for the authenticated user.
 * Cached per-user for 15 seconds — same TTL as /api/notifications/aggregates.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const cacheKey = `notif-counts:user:${user.id}`;
  const storage = useStorage('cache');
  const cached = await storage.getItem(cacheKey);
  if (cached) return cached;

  const result = await getNotificationCounts(user.id);
  storage.setItem(cacheKey, result, { ttl: 15 }).catch(() => {});
  return result;
});
