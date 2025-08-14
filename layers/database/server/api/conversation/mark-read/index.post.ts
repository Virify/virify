import * as z from "zod";
import { markMessageAsRead } from "../../../utils/conversation";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const markReadSchema = z.object({
  messageId: z.coerce.number(),
  conversationId: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { sendMessage, createMessageReadMessage, createAggregateUpdateMessage } = useWebSocketServer();

  try {
    const { messageId, conversationId } = await readValidatedBody(event, markReadSchema.parse);
    const userId = user.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    // Mark the message as read in the database
    const updatedMessage = await markMessageAsRead(messageId, userId);

    if (!updatedMessage) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden - You can only mark messages sent to you as read",
      });
    }

    // Send WebSocket notification to the message sender about read receipt
    const messageReadNotification = createMessageReadMessage(
      conversationId,
      messageId,
      updatedMessage.senderId // Send to the original sender of the message
    );

    sendMessage(messageReadNotification);

    // Send aggregate update to the reader (unreadMessages count decreased)
    const aggregateUpdate = createAggregateUpdateMessage(
      "unreadMessages",
      "remove",
      userId
    );

    sendMessage(aggregateUpdate);

    return updatedMessage;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to mark message as read",
    });
  }
});
