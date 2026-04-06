import * as zod from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { updateUserNote, getUserNote } from "../../../../utils/user-note";

/**
 * Zod automatically santizes the input
 */
const updateSchema = zod.object({
  listingId: zod.coerce.number(),
  note: zod.string(),
});

/**
 * Update a user's note for a listing
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();
  const { user } = await requireUserSession(event);
  const { listingId, note } = await readValidatedBody(event, updateSchema.parse);

  try {
    if (!user.id) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing ID provided" });

    // Check if note already exists (to determine if this is a create or update)
    const existingNote = await getUserNote(user.id, listingId);
    const isNewNote = !existingNote;

    const result = await updateUserNote(user.id, listingId, note);

    // Invalidate lookups cache so the next GET reflects the new/updated note
    useStorage('cache').removeItem(`notes:lookups:${user.id}`).catch(() => {});

    // Only broadcast aggregate update for new notes, not updates
    if (isNewNote) {
      const aggregateMessage = createAggregateUpdateMessage("notes", "add", user.id);
      sendMessage(aggregateMessage);
    }

    return result;
  } catch (error) {
    console.error(error);
    return errorResponse(error, event);
  }
});
