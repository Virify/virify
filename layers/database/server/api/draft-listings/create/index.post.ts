import * as z from "zod";
import { ListingTier } from "../../../database/prisma/generated/enums";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { useFeatureFlag } from "~~/server/utils/useFeatureFlag";

const CreateSchema = z.object({
  tier: z.enum(ListingTier),
});

export default defineEventHandler(async (event) => {
  const { tier } = await readValidatedBody(event, CreateSchema.parse);
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();

  try {
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const { createListing } = await useFeatureFlag(event);
    if (!createListing) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: only agents and admins can create listings",
      });
    }

    const createdListing = await createDraftListing(user.id, tier);
    const { invalidateDraftListingsCache, invalidateAggregatesCache } = await import("~~/layers/database/server/utils/cache");
    await Promise.all([
      invalidateDraftListingsCache(user.id as number),
      invalidateAggregatesCache(user.id as number),
    ]);
    // Notify client to update draft count badge
    try {
      const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();
      sendMessage(createAggregateUpdateMessage("draftListings", "add", user.id as number));
    } catch {
      // Non-critical
    }
    return createdListing;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
