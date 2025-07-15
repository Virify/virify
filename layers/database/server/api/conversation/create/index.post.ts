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
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  const { sendMessage, createNewConversationMessage, createAggregateUpdateMessage } = useWebSocketServer();
  try {
    const { listingId, receiverId, message } = await readValidatedBody(event, conversationSchema.parse);

    const userId = user.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    if(userId === receiverId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot create a conversation with yourself",
      });
    }

    const conversation = (await createConversation(userId, receiverId, message, listingId)) as ConversationWithUserAndMessages;

    // Send the new conversation to the receiver (exclude creator)
    const messageToSend = createNewConversationMessage(conversation, [receiverId], userId);
    sendMessage(messageToSend);

    // Send aggregate update for conversations count
    const aggregateMessage = createAggregateUpdateMessage("enquiries", "add", userId);
    sendMessage(aggregateMessage);

    return conversation;
  } catch (error) {
    console.error("Error creating or updating conversation:", error);
    return errorResponse(error, event);
  }
});
