import * as z from "zod";
import { prisma } from "~~/layers/database/server/utils/prisma-client";
import { updateViewingStatus } from "~~/layers/database/server/utils/viewing";
import { createNotification } from "~~/layers/database/server/utils/notification";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { getUserNotificationPreferences } from "~~/layers/database/server/utils/user";
import { sendViewingNotificationEmail } from "~~/layers/email/server/email/send-viewing-notification";

const schema = z.object({
  response: z.enum(["accept", "reject", "reschedule"]),
  counterProposedAt: z.string().datetime().optional(),
});

const statusMap = {
  accept: "ACCEPTED",
  reject: "REJECTED",
  reschedule: "RESCHEDULED",
} as const;

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const id = Number(getRouterParam(event, "id"));
    if (!id) throw createError({ statusCode: 400, statusMessage: "Missing viewing ID" });

    const { response, counterProposedAt } = await readValidatedBody(event, schema.parse);

    if (response === "reschedule" && !counterProposedAt) {
      throw createError({ statusCode: 400, statusMessage: "counterProposedAt is required when rescheduling" });
    }

    // Determine caller's role (owner can accept/reject/reschedule; requester can only accept a RESCHEDULED viewing)
    const existing = await prisma.viewing.findUnique({ where: { id }, select: { ownerId: true, requesterId: true, status: true } });
    if (!existing) throw createError({ statusCode: 404, statusMessage: "Viewing not found" });

    let role: 'owner' | 'requester';
    if (existing.ownerId === user.id) {
      role = 'owner';
    } else if (existing.requesterId === user.id) {
      if (response !== 'accept' || existing.status !== 'RESCHEDULED') {
        throw createError({ statusCode: 403, statusMessage: "Requesters may only accept a rescheduled viewing" });
      }
      role = 'requester';
    } else {
      throw createError({ statusCode: 403, statusMessage: "Not authorised" });
    }

    const updated = await updateViewingStatus(id, user.id as number, role, statusMap[response], counterProposedAt ? new Date(counterProposedAt) : undefined);

    // Notify the requester
    // Notify the OTHER party (whoever didn't take the action)
    const notifyUserId = role === 'owner' ? updated.requesterId : updated.ownerId;
    const notificationType = (response === "accept" ? "VIEWING_ACCEPTED" : response === "reject" ? "VIEWING_REJECTED" : "VIEWING_RESCHEDULED") as NotificationType;
    const notificationTitle = response === "accept" ? "Viewing confirmed" : response === "reject" ? "Viewing declined" : "Viewing time changed";
    const notificationMessage =
      response === "reschedule" && counterProposedAt
        ? `A new time has been proposed: ${new Date(counterProposedAt).toLocaleDateString("en-GB")}`
        : response === "accept"
          ? `${user.username ?? "The other party"} confirmed the viewing time`
          : "Your viewing request has been declined";

    const notification = await createNotification({
      userId: notifyUserId,
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      senderUsername: user.username ?? null,
      senderAvatar: user.avatar ?? null,
      listingId: updated.listingId,
      conversationId: updated.conversationId ?? null,
    });

    const { sendMessage, createNotificationNewMessage, createAggregateUpdateMessage, isUserOnline } = useWebSocketServer();
    const otherPartyIsOnline = isUserOnline(notifyUserId);
    if (otherPartyIsOnline) {
      sendMessage(createNotificationNewMessage(notification as any, notifyUserId));
    }

    // Send offline email for all response types
    if (!otherPartyIsOnline) {
      const prefs = await getUserNotificationPreferences(notifyUserId);
      if (prefs?.receiveEmailNotifications) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.EMAIL_BASE_URL as string;
        const eventType = response === "accept" ? "accepted" : response === "reject" ? "declined" : "rescheduled";
        sendViewingNotificationEmail({
          to: prefs.email,
          senderName: user.username ?? "Someone",
          senderAvatar: user.avatar ?? undefined,
          eventType,
          proposedDates: (updated as any).proposedDates?.map((d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })) ?? [],
          preferredTimes: (updated as any).preferredTimes ?? undefined,
          counterProposedAt: updated.counterProposedAt ? new Date(updated.counterProposedAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : undefined,
          notes: updated.notes ?? undefined,
          listing: (updated as any).listing
            ? {
                address: (updated as any).listing?.property?.address?.fullAddress ?? "",
                price: (updated as any).listing?.price ? `£${Number((updated as any).listing.price).toLocaleString()}` : undefined,
                image: (updated as any).listing?.property?.media?.[0]?.image ?? undefined,
              }
            : undefined,
          conversationUrl: `${baseUrl}/dashboard/${updated.conversationId ? `enquiries/${updated.conversationId}` : "viewings"}`,
        }).catch((err) => console.error("Failed to send viewing response email:", err));
      }
    }

    // Bust viewings + aggregates cache for both parties
    await Promise.all([
      invalidateViewingsCache(updated.ownerId),
      invalidateViewingsCache(updated.requesterId),
      invalidateAggregatesCache(updated.ownerId),
      invalidateAggregatesCache(updated.requesterId),
    ]);

    // For REJECTED/CANCELLED statuses the active count drops; for others it stays
    const operation = response === "reject" ? "remove" : "update";
    // Send live aggregate updates so sidebar badges refresh immediately for both parties
    sendMessage(createAggregateUpdateMessage("viewings", operation, updated.ownerId));
    sendMessage(createAggregateUpdateMessage("viewings", operation, updated.requesterId));

    return updated;
  } catch (error) {
    console.error("Error responding to viewing:", error);
    return errorResponse(error, event);
  }
});
