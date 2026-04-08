import * as z from "zod";
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

    const updated = await updateViewingStatus(id, user.id as number, statusMap[response], counterProposedAt ? new Date(counterProposedAt) : undefined);

    // Notify the requester
    const notificationType = (response === "accept" ? "VIEWING_ACCEPTED" : response === "reject" ? "VIEWING_REJECTED" : "VIEWING_RESCHEDULED") as NotificationType;
    const notificationTitle = response === "accept" ? "Viewing confirmed" : response === "reject" ? "Viewing declined" : "Viewing time changed";
    const notificationMessage =
      response === "reschedule" && counterProposedAt
        ? `A new time has been proposed: ${new Date(counterProposedAt).toLocaleDateString("en-GB")}`
        : response === "accept"
          ? "Your viewing request has been accepted"
          : "Your viewing request has been declined";

    const notification = await createNotification({
      userId: updated.requesterId,
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      senderUsername: user.username ?? null,
      senderAvatar: user.avatar ?? null,
      listingId: updated.listingId,
      conversationId: updated.conversationId ?? null,
    });

    const { sendMessage, createNotificationNewMessage, isUserOnline } = useWebSocketServer();
    if (isUserOnline(updated.requesterId)) {
      sendMessage(createNotificationNewMessage(notification as any, updated.requesterId));
    }

    // Send offline email for accept/reschedule — rejections are notification-only
    if (!isUserOnline(updated.requesterId) && response !== "reject") {
      const prefs = await getUserNotificationPreferences(updated.requesterId);
      if (prefs?.receiveEmailNotifications) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.EMAIL_BASE_URL as string;
        const eventType = response === "accept" ? "accepted" : "rescheduled";
        sendViewingNotificationEmail({
          to: prefs.email,
          senderName: user.username ?? "Someone",
          senderAvatar: user.avatar ?? undefined,
          eventType,
          proposedAt: new Date(updated.proposedAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
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

    // Bust viewings cache for both parties
    await Promise.all([invalidateViewingsCache(user.id as number), invalidateViewingsCache(updated.requesterId)]);

    return updated;
  } catch (error) {
    console.error("Error responding to viewing:", error);
    return errorResponse(error, event);
  }
});
