import * as z from "zod";

const replySchema = z.object({
  conversationId: z.coerce.number(),
  receiverId: z.coerce.number(),
  message: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  try {
    const { conversationId, receiverId, message } = await readValidatedBody(event, replySchema.parse);

    const userId = session.user.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const conversation = await replyToConversation(conversationId, userId, receiverId, message);

    return conversation;
  } catch (error) {
    console.error("Error replying to conversation:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
