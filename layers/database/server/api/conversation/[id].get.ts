export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Conversation ID is required" });
  }

  const conversationId = Number(id);
  if (isNaN(conversationId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid Conversation ID" });
  }

  // Fetch the conversation ensuring the user is a participant
  const conversation = await findConversationForUser(conversationId, user.id);

  if (!conversation) {
    throw createError({ statusCode: 404, statusMessage: "Conversation not found" });
  }

  return conversation;
});
