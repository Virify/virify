import * as z from "zod";
import { createConversation } from "~~/layers/database/server/utils/conversation";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";

const conversationSchema = z.object({
  listingId: z.coerce.number().optional(),
  receiverId: z.coerce.number(),
  message: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event);
    const { listingId, receiverId, message } = await readValidatedBody(event, conversationSchema.parse);

    const userId = session.user.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const conversation = (await createConversation(userId, receiverId, message, listingId)) as ConversationWithUserAndMessages;

    // Get WebSocket server instance
    const { sendMessage } = useWebSocketServer();

    // Send the new conversation to the receiver (exclude creator) - use format expected by client
    const messageToSend = {
      type: "new_conversation",
      to: [receiverId],
      from: userId,
      conversation: conversation,
      timestamp: new Date().toISOString(),
    };

    sendMessage(messageToSend);

    return conversation;
  } catch (error) {
    console.error("Error creating or updating conversation:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
