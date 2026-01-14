import * as z from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { createMessageNotification } from "~~/layers/database/server/utils/notification";

const replySchema = z.object({
  conversationId: z.coerce.number(),
  message: z.string(),
  suppressNotification: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { sendMessage, createNewMessageMessage, createAggregateUpdateMessage, createNotificationNewMessage, isUserViewingConversation } = useWebSocketServer();

  try {
    const { conversationId, message, suppressNotification } = await readValidatedBody(event, replySchema.parse);
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

    // Create notification for the receiver with minimal listing data
    let listingData: { id: number; price: number | null; address: string | null; image: string | null; isRental: boolean } | undefined;
    
    if (conversation?.listing) {
      const listing = conversation.listing;
      listingData = {
        id: listing.id,
        price: listing.price ? Number(listing.price) : null,
        address: listing.property?.address?.fullAddress || null,
        image: listing.property?.media?.[0]?.image || null,
        isRental: !!listing.rentalListing,
      };
    }

    let createdNotification: Awaited<ReturnType<typeof createMessageNotification>> | null = null;
    const recipientViewing = isUserViewingConversation(receiverId, conversationId);
    if (!suppressNotification && !recipientViewing) {
      createdNotification = await createMessageNotification(
        receiverId,
        message,
        newMessage.sender?.username || null,
        newMessage.sender?.avatar || null,
        conversationId,
        newMessage.id,
        listingData
      );
    }

    const messageToSend = createNewMessageMessage(conversationId, newMessage, [senderId, receiverId], senderId, conversation);
    sendMessage(messageToSend);

    // Emit notification_new if we created one
    if (createdNotification) {
      const notifMsg = createNotificationNewMessage(createdNotification, receiverId);
      sendMessage(notifMsg);
    }

    return newMessage;
  } catch (error) {
    console.error("Error replying to conversation:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
