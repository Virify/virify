import * as z from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { createMessageNotification } from "~~/layers/database/server/utils/notification";
import { getUserNotificationPreferences } from "~~/layers/database/server/utils/user";
import { sendEnquiryNotificationEmail } from "~~/layers/email/server/email/send-enquiry-notification";

const replySchema = z.object({
  conversationId: z.coerce.number(),
  message: z.string().max(5000).optional(),
  userMediaId: z.number().int().positive().optional(),
  suppressNotification: z.boolean().optional(),
}).refine(
  (data) => data.message?.trim() || data.userMediaId,
  { message: 'A message or attachment is required' }
);

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { sendMessage, createNewMessageMessage, createAggregateUpdateMessage, createNotificationNewMessage, isUserViewingConversation, isUserOnline } = useWebSocketServer();

  try {
    const { conversationId, message, userMediaId, suppressNotification } = await readValidatedBody(event, replySchema.parse);
    const config = useRuntimeConfig();
    const senderId = user.id;

    // Verify the user is a participant in this conversation before allowing reply
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation not found",
      });
    }

    const isParticipant = conversation.sender.id === senderId || conversation.receiver.id === senderId;
    if (!isParticipant) {
      throw createError({
        statusCode: 403,
        statusMessage: "You do not have permission to reply to this conversation",
      });
    }

    const newMessage = await replyToConversation(conversationId, message?.trim() || null, senderId, userMediaId);

    const receiverId = getOtherParticipantId(senderId, newMessage);

    // Use content text for notification, or a fallback for media-only messages
    const notificationText = message?.trim() || '📎 Sent an attachment';

    // Create notification for the receiver with minimal listing data
    let listingData: { id: number; price: number | null; address: string | null; image: string | null; isRental: boolean } | undefined;
    
    if (conversation?.listing) {
      const listing = conversation.listing;
      listingData = {
        id: listing.id,
        price: listing.price ? Number(listing.price) : null,
        address: listing.property?.address?.fullAddress || null,
        image: getMainImageUrl(listing.property, config.public.CF_ACCOUNT_HASH as string, 'public'),
        isRental: !!listing.rentalListing,
      };
    }

    let createdNotification: Awaited<ReturnType<typeof createMessageNotification>> | null = null;
    const recipientViewing = isUserViewingConversation(receiverId, conversationId);
    if (!recipientViewing && suppressNotification !== true) {
      createdNotification = await createMessageNotification(
        receiverId,
        notificationText,
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

    // Send offline email if recipient is not connected to WebSocket
    if (!isUserOnline(receiverId)) {
      const recipientPrefs = await getUserNotificationPreferences(receiverId);
      if (recipientPrefs?.receiveEmailNotifications) {
        const baseUrl = config.public.EMAIL_BASE_URL;
        sendEnquiryNotificationEmail({
          to: recipientPrefs.email,
          senderName: newMessage.sender?.username || 'Someone',
          senderAvatar: newMessage.sender?.avatar ?? undefined,
          message: notificationText,
          conversationUrl: `${baseUrl}/dashboard/enquiries/${conversationId}`,
          isReply: true,
          listing: listingData ? {
            address: listingData.address || '',
            price: listingData.price ? `£${listingData.price.toLocaleString()}` : undefined,
            image: listingData.image ?? undefined,
          } : undefined,
        }).catch((err) => console.error('Failed to send reply notification email:', err));
      }
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
