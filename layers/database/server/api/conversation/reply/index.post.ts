import * as z from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const replySchema = z.object({
  conversationId: z.coerce.number(),
  message: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  try {
    const { conversationId, message } = await readValidatedBody(event, replySchema.parse);
    const senderId = session.user.id;

    if (!senderId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const newMessage = await replyToConversation(conversationId, message, senderId);

    // Send WebSocket notification to all participants (sender and receiver)
    const { sendMessage, createNewMessageMessage } = useWebSocketServer();
    const receiverId = newMessage.senderId === senderId ? newMessage.receiverId : newMessage.senderId;

    const messageToSend = createNewMessageMessage(
      conversationId,
      newMessage,
      [senderId, receiverId], // Send to both participants
      senderId
    );

    sendMessage(messageToSend);

    return newMessage;
  } catch (error) {
    console.error("Error replying to conversation:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
