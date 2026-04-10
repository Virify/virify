import { cancelViewing } from "~~/layers/database/server/utils/viewing";
import { createNotification } from "~~/layers/database/server/utils/notification";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { getUserNotificationPreferences } from "~~/layers/database/server/utils/user";
import { sendViewingNotificationEmail } from "~~/layers/email/server/email/send-viewing-notification";

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const id = Number(getRouterParam(event, "id"));
    if (!id) throw createError({ statusCode: 400, statusMessage: "Missing viewing ID" });

    const cancelled = await cancelViewing(id, user.id as number);

    // Bust viewings + aggregates cache for both parties
    const otherPartyId = cancelled.requesterId === (user.id as number) ? cancelled.ownerId : cancelled.requesterId;
    await Promise.all([
      invalidateViewingsCache(user.id as number),
      invalidateViewingsCache(otherPartyId),
      invalidateAggregatesCache(user.id as number),
      invalidateAggregatesCache(otherPartyId),
    ]);

    // Persist a notification for the other party and push it live
    const listingAddress = (cancelled as any).listing?.property?.address?.fullAddress ?? null;
    const notification = await createNotification({
      userId: otherPartyId,
      type: "VIEWING_CANCELLED" as NotificationType,
      title: "Viewing cancelled",
      message: listingAddress
        ? `${user.username ?? "The other party"} has cancelled the viewing for ${listingAddress}.`
        : `${user.username ?? "The other party"} has cancelled the viewing.`,
      senderUsername: user.username ?? null,
      senderAvatar: user.avatar ?? null,
      listingId: cancelled.listingId,
      conversationId: cancelled.conversationId ?? null,
    });

    const { sendMessage, createAggregateUpdateMessage, createNotificationNewMessage, isUserOnline } = useWebSocketServer();
    if (isUserOnline(otherPartyId)) {
      sendMessage(createNotificationNewMessage(notification as any, otherPartyId));
    }

    // Send offline email to the other party
    if (!isUserOnline(otherPartyId)) {
      const prefs = await getUserNotificationPreferences(otherPartyId);
      if (prefs?.receiveEmailNotifications) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.EMAIL_BASE_URL as string;
        sendViewingNotificationEmail({
          to: prefs.email,
          senderName: user.username ?? "Someone",
          senderAvatar: user.avatar ?? undefined,
          eventType: "cancelled",
          proposedDates: (cancelled as any).proposedDates?.map((d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })) ?? [],
          preferredTimes: (cancelled as any).preferredTimes ?? undefined,
          notes: cancelled.notes ?? undefined,
          listing: listingAddress
            ? {
                address: listingAddress,
                price: (cancelled as any).listing?.price ? `£${Number((cancelled as any).listing.price).toLocaleString()}` : undefined,
                image: (cancelled as any).listing?.property?.media?.[0]?.image ?? undefined,
              }
            : undefined,
          conversationUrl: `${baseUrl}/dashboard/viewings`,
        }).catch((err) => console.error("Failed to send viewing cancellation email:", err));
      }
    }
    // Update sidebar badge counts for both parties
    sendMessage(createAggregateUpdateMessage("viewings", "remove", user.id as number));
    sendMessage(createAggregateUpdateMessage("viewings", "remove", otherPartyId));

    return cancelled;
  } catch (error) {
    console.error("Error cancelling viewing:", error);
    return errorResponse(error, event);
  }
});
