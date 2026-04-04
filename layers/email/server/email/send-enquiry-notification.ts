import { render } from "@vue-email/render";
import enquiryNotification from "../../components/email/templates/enquiry-notification.vue";
import { sesSender } from "../utils/ses-sender";

export interface SendEnquiryNotificationOptions {
  /** Email address of the recipient */
  to: string;
  /** Display name of the person who sent the message/enquiry */
  senderName: string;
  /** Avatar URL of the sender */
  senderAvatar?: string;
  /** The message text */
  message: string;
  /** Full URL to the conversation page */
  conversationUrl: string;
  /** Whether this is a reply to an existing enquiry (vs a new enquiry) */
  isReply?: boolean;
  /** Optional listing details */
  listing?: {
    address: string;
    price?: string;
    image?: string;
  };
}

/**
 * Sends an enquiry or reply notification email to an offline user.
 * Only call this when the recipient is not connected to the WebSocket.
 */
export async function sendEnquiryNotificationEmail(options: SendEnquiryNotificationOptions) {
  const { to, senderName, senderAvatar, message, conversationUrl, isReply = false, listing } = options;

  const html = await render(enquiryNotification, {
    senderName,
    senderAvatar,
    message,
    conversationUrl,
    isReply,
    listingAddress: listing?.address,
    listingPrice: listing?.price,
    listingImage: listing?.image,
  });

  const subject = isReply
    ? `${senderName} replied to your enquiry — Virify`
    : `New enquiry from ${senderName} — Virify`;

  return await sesSender(html, subject, to);
}
