import { render } from "@vue-email/render";
import viewingNotification from "../../components/email/templates/viewing-notification.vue";
import { sesSender } from "../utils/ses-sender";

export interface SendViewingNotificationOptions {
  /** Email address of the recipient */
  to: string;
  /** Display name of the person who triggered the event */
  senderName: string;
  /** Avatar URL of the sender */
  senderAvatar?: string;
  /** The type of viewing event */
  eventType: "requested" | "accepted" | "rescheduled" | "declined" | "cancelled";
  /** Pre-formatted proposed date strings (e.g. ["12 Jun 2025", "14 Jun 2025"]) */
  proposedDates: string[];
  /** Time preferences selected by the buyer (e.g. ["Mornings", "Evenings"]) */
  preferredTimes?: string[];
  /** Pre-formatted counter-proposed date/time (reschedule only) */
  counterProposedAt?: string;
  /** Optional notes attached to the viewing */
  notes?: string;
  /** Full URL to the conversation or viewings page */
  conversationUrl: string;
  /** Optional listing details */
  listing?: {
    address: string;
    price?: string;
    image?: string;
  };
}

/**
 * Sends a viewing event notification email to an offline user.
 * Only call this when the recipient is not connected to the WebSocket.
 */
export async function sendViewingNotificationEmail(options: SendViewingNotificationOptions) {
  const {
    to,
    senderName,
    senderAvatar,
    eventType,
    proposedDates,
    preferredTimes,
    counterProposedAt,
    notes,
    conversationUrl,
    listing,
  } = options;

  const html = await render(viewingNotification, {
    senderName,
    senderAvatar,
    eventType,
    proposedDates,
    preferredTimes,
    counterProposedAt,
    notes,
    conversationUrl,
    listingAddress: listing?.address,
    listingPrice: listing?.price,
    listingImage: listing?.image,
  });

  const subjects: Record<typeof eventType, string> = {
    requested: `${senderName} has requested a viewing — Virify`,
    accepted: `Your viewing has been confirmed — Virify`,
    rescheduled: `${senderName} has proposed a new viewing time — Virify`,
    declined: `Your viewing request was declined — Virify`,
    cancelled: `${senderName} has cancelled the viewing — Virify`,
  };

  return await sesSender(html, subjects[eventType], to);
}
