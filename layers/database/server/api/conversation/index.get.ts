import * as z from "zod";

const conversationQuerySchema = z.object({
  filter: z.enum(['all', 'unread']).optional().default('all'),
  direction: z.enum(['all', 'sent', 'received']).optional().default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

/**
 * Fetch conversations for the authenticated user
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = await getValidatedQuery(event, conversationQuerySchema.parse);
  const skip = (query.page - 1) * query.limit;

  return await getConversationsByUserId(user.id, { 
    filter: query.filter, 
    direction: query.direction,
    skip,
    take: query.limit 
  });
});