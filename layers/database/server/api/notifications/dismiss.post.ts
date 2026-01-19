import { dismissNotification } from "~~/layers/database/server/utils/notification";
import * as z from "zod";

const bodySchema = z.object({
  notificationId: z.number(),
});

/**
 * POST /api/notifications/dismiss
 * Dismiss a single notification for the authenticated user
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readValidatedBody(event, bodySchema.parse);

  await dismissNotification(body.notificationId, user.id);

  return { success: true, message: "Notification dismissed" };
});
