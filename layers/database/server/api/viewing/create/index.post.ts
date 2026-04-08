import * as z from "zod";
import { createViewing } from "~~/layers/database/server/utils/viewing";
import { createNotification } from "~~/layers/database/server/utils/notification";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { getUserNotificationPreferences } from "~~/layers/database/server/utils/user";
import { sendViewingNotificationEmail } from "~~/layers/email/server/email/send-viewing-notification";

const schema = z.object({
  listingId: z.coerce.number(),
  ownerId: z.coerce.number(),
  proposedAt: z.string().datetime(),
  notes: z.string().max(1000).optional(),
  conversationId: z.coerce.number().optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const { listingId, ownerId, proposedAt, notes, conversationId } = await readValidatedBody(event, schema.parse);

    // Listing owners cannot request viewings of their own property
    if (user.id === ownerId) {
      throw createError({ statusCode: 403, statusMessage: "Listing owners cannot request viewings of their own property" });
    }

    // Block duplicate active viewing requests (PENDING or RESCHEDULED)
    const existingViewing = await prisma.viewing.findFirst({
      where: {
        listingId,
        requesterId: user.id as number,
        status: { in: ["PENDING", "RESCHEDULED"] },
      },
    });
    if (existingViewing) {
      throw createError({ statusCode: 409, statusMessage: "You already have an active viewing request for this property" });
    }

    // The requester is always the non-owner; recipient is always the listing owner
    const recipientId = ownerId;

    const viewing = await createViewing(user.id as number, ownerId, listingId, new Date(proposedAt), notes, conversationId);

    // Persist notification for the listing owner
    const notification = await createNotification({
      userId: recipientId,
      type: "VIEWING_REQUEST" as NotificationType,
      title: "New viewing request",
      message: notes ? notes.slice(0, 120) : `A viewing has been requested for ${new Date(proposedAt).toLocaleDateString("en-GB")}`,
      senderUsername: user.username ?? null,
      senderAvatar: user.avatar ?? null,
      listingId,
      conversationId: conversationId ?? null,
    });

    // Push real-time notification to the listing owner
    const { sendMessage, createNotificationNewMessage, isUserOnline } = useWebSocketServer();
    if (isUserOnline(recipientId)) {
      sendMessage(createNotificationNewMessage(notification as any, recipientId));
    }

    // Send offline email if the owner is not currently connected
    if (!isUserOnline(recipientId)) {
      const prefs = await getUserNotificationPreferences(recipientId);
      if (prefs?.receiveEmailNotifications) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.EMAIL_BASE_URL as string;
        sendViewingNotificationEmail({
          to: prefs.email,
          senderName: user.username ?? "Someone",
          senderAvatar: user.avatar ?? undefined,
          eventType: "requested",
          proposedAt: new Date(proposedAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          notes: notes,
          listing: viewing.listing
            ? {
                address: (viewing.listing as any).property?.address?.fullAddress ?? "",
                price: viewing.listing.price ? `£${Number(viewing.listing.price).toLocaleString()}` : undefined,
                image: (viewing.listing as any).property?.media?.[0]?.image ?? undefined,
              }
            : undefined,
          conversationUrl: `${baseUrl}/dashboard/${conversationId ? `enquiries/${conversationId}` : "viewings"}`,
        }).catch((err) => console.error("Failed to send viewing request email:", err));
      }
    }

    // Bust viewings cache for both requester and owner
    await Promise.all([invalidateViewingsCache(user.id as number), invalidateViewingsCache(ownerId)]);

    return viewing;
  } catch (error) {
    console.error("Error creating viewing:", error);
    return errorResponse(error, event);
  }
});
