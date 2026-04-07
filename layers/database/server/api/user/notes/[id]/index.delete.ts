import { deleteUserNote } from "../../../../utils/user-note";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import * as z from "zod";

const deleteSchema = z.object({
  listingId: z.coerce.number(),
});
/**
 * Delete a user's note for a listing
 *
 * @param event - The event object containing request data
 * @returns A success response or error
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();
  const { user } = await requireUserSession(event);
  const { listingId } = await readValidatedBody(event, deleteSchema.parse);

  try {

    if (!user.id) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing ID provided" });

    const result = await deleteUserNote(user.id, listingId);

    // Invalidate lookups cache so the next GET reflects the deletion
    useStorage('cache').removeItem(`notes:lookups:${user.id}`).catch(() => {});
    // Invalidate aggregates cache (safety net if WebSocket update is missed)
    await invalidateAggregatesCache(user.id as number);

    // Broadcast aggregate update via WebSocket
    const aggregateMessage = createAggregateUpdateMessage("notes", "remove", user.id);
    sendMessage(aggregateMessage);

    return result;
  } catch (error) {
    console.error("Error deleting note:", error);
    return errorResponse(error, event);
  }
});
