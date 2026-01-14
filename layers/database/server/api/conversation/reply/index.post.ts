import * as z from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const replySchema = z.object({
  conversationId: z.coerce.number(),
  message: z.string(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { sendMessage, createNewMessageMessage, createAggregateUpdateMessage } = useWebSocketServer();

  try {
    const { conversationId, message } = await readValidatedBody(event, replySchema.parse);
    const senderId = user.id;

    if (!senderId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const newMessage = await replyToConversation(conversationId, message, senderId);
    const conversation = await getConversation(conversationId);

    const receiverId = getOtherParticipantId(senderId, newMessage);

    const messageToSend = createNewMessageMessage(conversationId, newMessage, [senderId, receiverId], senderId, conversation);

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
