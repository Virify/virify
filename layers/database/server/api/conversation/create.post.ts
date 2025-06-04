import * as z from "zod";
import { createConversation } from "~~/layers/database/server/utils/conversation";
import { broadcastNewConversation } from "~~/layers/communication/server/utils/websocket-broadcaster";
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

    const conversation = await createConversation(userId, receiverId, message, listingId) as ConversationWithUserAndMessages;
    
    // Broadcast the new conversation to all participants via WebSocket
    // Exclude the creator since they already have the conversation in their UI
    broadcastNewConversation(conversation, userId);

    return conversation;
  } catch (error) {
    console.error("Error creating or updating conversation:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
