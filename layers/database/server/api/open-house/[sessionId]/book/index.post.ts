import * as z from "zod";
import { createNotification } from "~~/layers/database/server/utils/notification";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import {
  invalidateViewingsCache,
  invalidateAggregatesCache,
} from "~~/layers/database/server/utils/cache";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const schema = z.object({
  slotTime: z.string().regex(timeRegex, "Slot time must be HH:mm"),
  conversationId: z.coerce.number().optional(),
});

/** Enquirer: book a 15-min slot in an open house session — creates a Viewing with ACCEPTED status */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const sessionId = Number(getRouterParam(event, "sessionId"));
    if (!sessionId || isNaN(sessionId))
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid session ID",
      });

    const { slotTime, conversationId } = await readValidatedBody(
      event,
      schema.parse,
    );

    // Load the session with its existing bookings
    const session = await prisma.openHouseSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        listingId: true,
        date: true,
        startTime: true,
        endTime: true,
        slotMins: true,
        listing: { select: { userId: true } },
        bookings: {
          where: { status: { in: ["ACCEPTED", "PENDING"] } },
          select: { preferredTimes: true },
        },
      },
    });
    if (!session)
      throw createError({
        statusCode: 404,
        statusMessage: "Session not found",
      });

    const ownerId = session.listing.userId;
    if (!ownerId)
      throw createError({
        statusCode: 400,
        statusMessage: "Listing has no owner",
      });
    if ((user.id as number) === ownerId)
      throw createError({
        statusCode: 403,
        statusMessage: "Listing owners cannot book their own open house",
      });

    // Validate slot is within the session window
    const [sh, sm] = session.startTime.split(":").map(Number);
    const [eh, em] = session.endTime.split(":").map(Number);
    const [slotH, slotM] = slotTime.split(":").map(Number);
    const startTotal = sh! * 60 + sm!;
    const endTotal = eh! * 60 + em!;
    const slotTotal = slotH! * 60 + slotM!;
    if (slotTotal < startTotal || slotTotal + session.slotMins > endTotal) {
      throw createError({
        statusCode: 400,
        statusMessage: "Slot is outside the session window",
      });
    }

    // Build label e.g. "10:15–10:30"
    const slotLabel = slotLabelFromTime(slotTime, session.slotMins);

    // Check slot is not already taken
    const takenSlots = session.bookings.flatMap((b) => b.preferredTimes);
    if (takenSlots.includes(slotLabel))
      throw createError({
        statusCode: 409,
        statusMessage: "This slot has already been booked",
      });

    // Build booking datetime (session date + slot start hour/minute)
    const d = session.date;
    const bookingDate = new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        slotH!,
        slotM!,
        0,
      ),
    );

    const viewingSelect = {
      id: true,
      listingId: true,
      requesterId: true,
      ownerId: true,
      conversationId: true,
      openHouseSessionId: true,
      proposedDates: true,
      preferredTimes: true,
      counterProposedAt: true,
      lastProposedBy: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      listing: {
        select: {
          id: true,
          price: true,
          property: {
            select: {
              address: { select: { fullAddress: true } },
              media: { select: { image: true }, take: 1 },
            },
          },
        },
      },
      requester: { select: { id: true, username: true, avatar: true } },
      owner: { select: { id: true, username: true, avatar: true } },
    } as const;

    const viewing = await prisma.viewing.create({
      data: {
        requesterId: user.id as number,
        ownerId,
        listingId: session.listingId,
        proposedDates: [bookingDate],
        preferredTimes: [slotLabel],
        status: "ACCEPTED",
        openHouseSessionId: sessionId,
        conversationId: conversationId ?? null,
        lastProposedBy: "requester",
      },
      select: viewingSelect,
    });

    // Persist notification for the owner
    const notification = await createNotification({
      userId: ownerId,
      type: "VIEWING_REQUEST" as NotificationType,
      title: "Open house slot booked",
      message: `${user.username ?? "Someone"} booked the ${slotLabel} slot`,
      senderUsername: user.username ?? null,
      senderAvatar: user.avatar ?? null,
      listingId: session.listingId,
      conversationId: conversationId ?? null,
    });

    // Push real-time updates
    const {
      sendMessage,
      createNotificationNewMessage,
      createAggregateUpdateMessage,
      isUserOnline,
    } = useWebSocketServer();
    if (isUserOnline(ownerId))
      sendMessage(createNotificationNewMessage(notification as any, ownerId));
    sendMessage(
      createAggregateUpdateMessage("viewings", "add", user.id as number),
    );
    sendMessage(createAggregateUpdateMessage("viewings", "add", ownerId));

    await Promise.all([
      invalidateViewingsCache(user.id as number),
      invalidateViewingsCache(ownerId),
      invalidateAggregatesCache(user.id as number),
      invalidateAggregatesCache(ownerId),
    ]);

    return viewing;
  } catch (error) {
    return errorResponse(error, event);
  }
});
