import { markNotificationAsRead, markAllNotificationsAsRead, markConversationNotificationsAsRead } from "~~/layers/database/server/utils/notification";
import * as z from "zod";

const bodySchema = z.object({
  notificationId: z.number().optional(),
  conversationId: z.number().optional(),
  all: z.boolean().optional(),
}).refine(
  data => data.notificationId !== undefined || data.conversationId !== undefined || data.all === true,
  { message: 'Must provide notificationId, conversationId, or all=true' }
);

/**
 * POST /api/notifications/mark-read
 * Mark notification(s) as read
 * 
 * Body options:
 * - { notificationId: number } - Mark a single notification as read
 * - { conversationId: number } - Mark all notifications for a conversation as read
 * - { all: true } - Mark all notifications as read
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readValidatedBody(event, bodySchema.parse);

  if (body.all) {
    await markAllNotificationsAsRead(user.id);
  } else if (body.conversationId) {
    await markConversationNotificationsAsRead(body.conversationId, user.id);
  } else if (body.notificationId) {
    await markNotificationAsRead(body.notificationId, user.id);
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' });
  }

  // Bust the notification counts cache so the badge reflects the change immediately
  const storage = useStorage('cache');
  await storage.removeItem(`notif-counts:user:${user.id}`);

  return { success: true, message: 'Notification(s) marked as read' };
});
