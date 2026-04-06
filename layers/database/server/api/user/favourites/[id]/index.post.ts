import * as zod from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const updateSchema = zod.object({
  listingId: zod.number().int().positive(),
});

/**
 * Save a listing to user's favourites
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();

  const { listingId } = await readValidatedBody(event, updateSchema.parse);
  try {
    if (!user.id) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const listings = await updateFavouriteListing(user.id, listingId);

    // Invalidate lookups cache so the next GET reflects the new favourite
    useStorage('cache').removeItem(`favs:lookups:${user.id}`).catch(() => {});

    // Broadcast aggregate update via WebSocket
    const aggregateMessage = createAggregateUpdateMessage("favourites", "add", user.id);
    sendMessage(aggregateMessage);

    return listings;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
