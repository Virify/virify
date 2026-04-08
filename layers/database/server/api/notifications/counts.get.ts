import { getNotificationCounts } from "~~/layers/database/server/utils/notification";

/**
 * GET /api/notifications/counts
 * Get notification counts for the authenticated user.
 * Cached per-user for 2 minutes. Busted on mark-read and dismiss.
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
  storage.setItem(cacheKey, result, { ttl: 2 * 60 }).catch(() => {});
  return result;
});
