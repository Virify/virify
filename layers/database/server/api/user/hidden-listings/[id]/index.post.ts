import * as zod from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const hideSchema = zod.object({
  listingId: zod.coerce.number(),
  reason: zod.string().optional(),
});

/**
 * Hide a listing for the authenticated user
 *
 * POST /api/user/hidden-listings/:id
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  const { listingId, reason } = await readValidatedBody(event, hideSchema.parse);
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();

  try {
    if (!user.id) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing ID provided" });

    await hideListingForUser(user.id, listingId, reason);

    // Invalidate lookups + full-page cache and aggregates badge
    useStorage("cache").removeItem(`hidden-listings:lookups:${user.id}`).catch(() => {});
    await invalidateHiddenListingsFullCache(user.id as number);
    await invalidateAggregatesCache(user.id as number);

    // Broadcast aggregate update via WebSocket so other tabs update immediately
    sendMessage(createAggregateUpdateMessage("hiddenListings", "add", user.id));

    return { success: true };
  } catch (error) {
    console.error("Error hiding listing:", error);
    return errorResponse(error, event);
  }
});
