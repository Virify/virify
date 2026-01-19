import { getNotificationCounts } from "~~/layers/database/server/utils/notification";

/**
 * GET /api/notifications/counts
 * Get notification counts for the authenticated user
 * Returns total unread count and breakdown by type
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  return await getNotificationCounts(user.id);
});
