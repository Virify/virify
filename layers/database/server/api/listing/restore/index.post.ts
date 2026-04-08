import * as z from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const restoreSchema = z.object({
  listingId: z.number().int().positive(),
});

/**
 * POST /api/listing/restore
 *
 * Removes the archived flag from a listing so it appears back in My Listings
 * (unpublished). No data is moved — just clears archived/archivedAt and ensures
 * published is false.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    const { listingId } = await readValidatedBody(event, restoreSchema.parse);

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, userId: user.id, archived: true },
      select: { id: true },
    });

    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Archived listing not found or you don't have permission to restore it",
      });
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        archived: false,
        archivedAt: null,
        published: false,
      },
    });

    await invalidateListingCache(listingId);
    await invalidateMyListingsCache(user.id as number);
    await invalidateAggregatesCache(user.id as number);

    try {
      const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();
      sendMessage(createAggregateUpdateMessage("listings", "add", user.id as number));
      sendMessage(createAggregateUpdateMessage("archivedListings", "remove", user.id as number));
    } catch {
      // Non-critical
    }

    return { success: true };
  } catch (error) {
    return errorResponse(error, event);
  }
});
