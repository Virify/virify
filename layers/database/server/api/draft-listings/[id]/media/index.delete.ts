import { getOwnershipFilter } from "~~/server/utils/ownership";
import { z } from "zod";

/**
 * DELETE /api/draft-listings/[id]/media
 * Delete media images from a draft or live listing (bulk delete)
 * Also deletes from Cloudflare
 *
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 */

const requestSchema = z.object({
  cloudflareIds: z.array(z.string()).min(1),
  mediaType: z.enum(["image", "floorPlan"]).optional().default("image"),
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    // Get ID from route param as fallback (for backwards compatibility)
    const routeId = parseInt(getRouterParam(event, "id") || "0");

    const body = await readBody(event);
    const parsed = requestSchema.parse(body);
    const { cloudflareIds, mediaType } = parsed;

    // Use body params if provided, otherwise fall back to route param (draft)
    const draftId = parsed.draftId ?? (parsed.listingId ? undefined : routeId);
    const listingId = parsed.listingId;

    if (!draftId && !listingId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Either draftId or listingId must be provided",
      });
    }

    let propertyId: number;

    if (listingId) {
      // LIVE LISTING
      const existingListing = await prisma.listing.findUnique({
        where: { id: listingId, ...getOwnershipFilter(user) },
        include: { property: true },
      });

      if (!existingListing || !existingListing.property) {
        throw createError({
          statusCode: 404,
          statusMessage: "Listing or property not found",
        });
      }

      propertyId = existingListing.property.id;
    } else {
      // DRAFT LISTING
      const existingDraft = await prisma.draftListing.findUnique({
        where: { id: draftId, ...getOwnershipFilter(user) },
        include: { property: true },
      });

      if (!existingDraft || !existingDraft.property) {
        throw createError({
          statusCode: 404,
          statusMessage: "Draft listing or property not found",
        });
      }

      propertyId = existingDraft.property.id;
    }

    // Delete from Cloudflare in parallel
    await deleteCloudflareImages(cloudflareIds);

    // Delete from database
    const deleteResult = await prisma.media.deleteMany({
      where: {
        propertyId,
        ...(mediaType === "floorPlan" ?
          { floorPlan: { in: cloudflareIds } }
        : { image: { in: cloudflareIds } }),
      },
    });

    // Invalidate cache for live listings
    if (listingId) {
      await invalidateListingCache(listingId);
    }

    return {
      success: true,
      deleted: deleteResult.count,
    };
  } catch (error) {
    console.error("Media delete error:", error);
    return errorResponse(error, event);
  }
});
