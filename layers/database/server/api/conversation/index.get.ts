import { getConversationsByUserId } from '~~/layers/database/server/utils/conversation';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const conversation = await getConversationsByUserId(user.id);
  return conversation;
});