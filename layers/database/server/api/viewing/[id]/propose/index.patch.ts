import * as z from "zod";
import { prisma } from "~~/layers/database/server/utils/prisma-client";
import { updateViewingProposal } from "~~/layers/database/server/utils/viewing";
import { createNotification } from "~~/layers/database/server/utils/notification";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { getUserNotificationPreferences } from "~~/layers/database/server/utils/user";
import { sendViewingNotificationEmail } from "~~/layers/email/server/email/send-viewing-notification";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const schema = z.object({
  proposedDates: z.array(z.string().regex(dateOnlyRegex, "Each date must be in YYYY-MM-DD format")).min(1).max(10),
  preferredTimes: z.array(z.string().max(200)).min(1).max(4),
  notes: z.string().max(1000).optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const id = Number(getRouterParam(event, "id"));
    if (!id) throw createError({ statusCode: 400, statusMessage: "Missing viewing ID" });

    const { proposedDates, preferredTimes, notes } = await readValidatedBody(event, schema.parse);

    const proposedDateObjects = proposedDates.map((d) => new Date(d + "T12:00:00.000Z"));

    // First fetch the viewing to determine caller's role, then update
    const existing = await prisma.viewing.findUnique({ where: { id }, select: { requesterId: true, ownerId: true } });
    if (!existing) throw createError({ statusCode: 404, statusMessage: "Viewing not found" });

    const role = existing.ownerId === user.id ? 'owner' : 'requester';
    if (role === 'requester' && existing.requesterId !== user.id) {
      throw createError({ statusCode: 403, statusMessage: "Not authorised" });
    }

    const updated = await updateViewingProposal(id, user.id as number, role, proposedDateObjects, preferredTimes, notes);

    // Notify the OTHER party
    const notifyUserId = role === 'owner' ? updated.requesterId : updated.ownerId;
    const firstDate = new Date(updated.proposedDates[0]!).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const datesSummary =
      updated.proposedDates.length > 1
        ? `${firstDate} and ${updated.proposedDates.length - 1} other date${updated.proposedDates.length > 2 ? "s" : ""}`
        : firstDate;
    const notificationTitle = role === 'owner' ? "Owner proposed new dates" : "New viewing times suggested";
    const notificationMessage = role === 'owner'
      ? `${user.username ?? "The owner"} has proposed new viewing dates: ${datesSummary}`
      : `${user.username ?? "The requester"} has suggested new dates: ${datesSummary}`;

    const notification = await createNotification({
      userId: notifyUserId,
      type: "VIEWING_REQUEST" as NotificationType,
      title: notificationTitle,
      message: notificationMessage,
      senderUsername: user.username ?? null,
      senderAvatar: user.avatar ?? null,
      listingId: updated.listingId,
      conversationId: updated.conversationId ?? null,
    });

    const { sendMessage, createNotificationNewMessage, createAggregateUpdateMessage, isUserOnline } = useWebSocketServer();
    if (isUserOnline(notifyUserId)) {
      sendMessage(createNotificationNewMessage(notification as any, notifyUserId));
    }

    if (!isUserOnline(notifyUserId)) {
      const prefs = await getUserNotificationPreferences(notifyUserId);
      if (prefs?.receiveEmailNotifications) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.EMAIL_BASE_URL as string;
        sendViewingNotificationEmail({
          to: prefs.email,
          senderName: user.username ?? "Someone",
          senderAvatar: user.avatar ?? undefined,
          eventType: role === 'owner' ? "rescheduled" : "requested",
          proposedDates: proposedDateObjects.map((d) =>
            d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          ),
          preferredTimes,
          notes,
          listing: (updated as any).listing
            ? {
                address: (updated as any).listing?.property?.address?.fullAddress ?? "",
                price: (updated as any).listing?.price
                  ? `£${Number((updated as any).listing.price).toLocaleString()}`
                  : undefined,
                image: (updated as any).listing?.property?.media?.[0]?.image ?? undefined,
              }
            : undefined,
          conversationUrl: `${baseUrl}/dashboard/${updated.conversationId ? `enquiries/${updated.conversationId}` : "viewings"}`,
        }).catch((err) => console.error("Failed to send propose email:", err));
      }
    }

    await Promise.all([
      invalidateViewingsCache(user.id as number),
      invalidateViewingsCache(updated.ownerId),
      invalidateAggregatesCache(user.id as number),
      invalidateAggregatesCache(updated.ownerId),
    ]);

    sendMessage(createAggregateUpdateMessage("viewings", "update", user.id as number));
    sendMessage(createAggregateUpdateMessage("viewings", "update", updated.ownerId));

    return updated;
  } catch (error) {
    console.error("Error counter-proposing viewing:", error);
    return errorResponse(error, event);
  }
});
