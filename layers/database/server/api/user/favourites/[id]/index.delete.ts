import * as zod from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const deleteSchema = zod.object({
  listingId: zod.number().int().positive(),
});

/**
 * Remove a specific saved listing from user's favourites
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();

  try {
    if (!user.id) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const { listingId } = await readValidatedBody(event, deleteSchema.parse);

    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing provided" });

    const result = await deleteFavouriteListing(user.id as number, listingId);

    // Invalidate lookups cache so the next GET reflects the removal
    useStorage('cache').removeItem(`favs:lookups:${user.id}`).catch(() => {});

    // Broadcast aggregate update via WebSocket
    const aggregateMessage = createAggregateUpdateMessage("favourites", "remove", user.id);
    sendMessage(aggregateMessage);

    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
