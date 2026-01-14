import { getNotifications } from "~~/layers/database/server/utils/notification";
import * as z from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  includeRead: z.enum(['true', 'false']).optional().transform(v => v === 'true'),
});

/**
 * GET /api/notifications/
 * Get notifications for the authenticated user
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = await getValidatedQuery(event, querySchema.parse);
  const skip = (query.page - 1) * query.limit;

  return await getNotifications(user.id, {
    skip,
    take: query.limit,
    includeRead: query.includeRead,
  });
});
