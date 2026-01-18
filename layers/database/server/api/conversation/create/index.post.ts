import * as z from "zod";
import { nanoid } from "nanoid";
import { createConversation } from "~~/layers/database/server/utils/conversation";
import { createEnquiryNotification } from "~~/layers/database/server/utils/notification";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import type { ConversationWithMinimalListing } from "~~/shared/types/conversation";

const conversationSchema = z.object({
  listingId: z.coerce.number().optional(),
  receiverId: z.coerce.number(),
  message: z.string(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  const { sendMessage, createNewConversationMessage, createAggregateUpdateMessage, createNotificationNewMessage, isUserViewingConversation } = useWebSocketServer();
  
  try {
    const { listingId, receiverId, message } = await readValidatedBody(event, conversationSchema.parse);

    const userId = user.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    if (userId === receiverId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot create a conversation with yourself",
      });
    }

    // Create the conversation
    const conversation = (await createConversation(userId, receiverId, message, listingId)) as ConversationWithMinimalListing;
    const firstMessage = conversation.messages[0];

    // Track enquiry if it's related to a listing
    if (listingId) {
      // Fire-and-forget tracking (server-side)
      $fetch('/api/analytics/track/enquiry', {
        method: 'POST',
        body: {
          listingId,
          sessionId: nanoid(),
          timestamp: Date.now(),
        },
      }).catch(() => {/* Silent fail */});
    }

    // Persist notification to DB (for when user is offline)
    let listingData: { id: number; price: number | null; address: string | null; image: string | null; isRental: boolean } | undefined;
    
    if (conversation.listing) {
      const listing = conversation.listing;
      listingData = {
        id: listing.id,
        price: listing.price ? Number(listing.price) : null,
        address: listing.property?.address?.fullAddress || null,
        image: getMainImageUrl(listing.property),
        isRental: !!listing.rentalListing,
      };
    }

    let createdNotification: Awaited<ReturnType<typeof createEnquiryNotification>> | null = null;
    const recipientViewing = isUserViewingConversation(receiverId, conversation.id);
    if (!recipientViewing) {
      createdNotification = await createEnquiryNotification(
        receiverId,
        message,
        conversation.sender?.username || null,
        conversation.sender?.avatar || null,
        conversation.id,
        firstMessage.id,
        listingData
      );
    }

    // Send WebSocket messages for real-time updates
    // 1. Send the new conversation to the receiver (client will show toast)
    const messageToSend = createNewConversationMessage(conversation, [receiverId], userId);
    sendMessage(messageToSend);

    // 2. Send aggregate update for enquiry counts
    const aggregateMessage = createAggregateUpdateMessage("enquiries", "add", receiverId);
    sendMessage(aggregateMessage);

    // 3. Emit notification_new for the created notification
    if (createdNotification) {
      const notifMsg = createNotificationNewMessage(createdNotification, receiverId);
      sendMessage(notifMsg);
    }

    return conversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return errorResponse(error, event);
  }
});
