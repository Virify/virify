import { z } from 'zod';
import { invalidateListingCache } from '~~/layers/database/server/utils/listing-cache';

/**
 * DELETE /api/draft-listings/[id]/media
 * Delete media images from a draft or live listing (bulk delete)
 * Also deletes from Cloudflare
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 */

const requestSchema = z.object({
  cloudflareIds: z.array(z.string()).min(1),
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    // Get ID from route param as fallback (for backwards compatibility)
    const routeId = parseInt(getRouterParam(event, 'id') || '0');

    const body = await readBody(event);
    const parsed = requestSchema.parse(body);
    const { cloudflareIds } = parsed;
    
    // Use body params if provided, otherwise fall back to route param (draft)
    const draftId = parsed.draftId ?? (parsed.listingId ? undefined : routeId);
    const listingId = parsed.listingId;

    if (!draftId && !listingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either draftId or listingId must be provided',
      });
    }

    let propertyId: number;

    if (listingId) {
      // LIVE LISTING
      const existingListing = await prisma.listing.findUnique({
        where: { id: listingId, userId: user.id },
        include: { property: true },
      });

      if (!existingListing || !existingListing.property) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Listing or property not found',
        });
      }

      propertyId = existingListing.property.id;
    } else {
      // DRAFT LISTING
      const existingDraft = await prisma.draftListing.findUnique({
        where: { id: draftId, userId: user.id },
        include: { property: true },
      });

      if (!existingDraft || !existingDraft.property) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Draft listing or property not found',
        });
      }

      propertyId = existingDraft.property.id;
    }

    const config = useRuntimeConfig();

    // Delete from Cloudflare in parallel
    const deletePromises = cloudflareIds.map(async (imageId) => {
      try {
        const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${config.CF_ACCOUNT_ID}/images/v1/${imageId}`;
        const response = await fetch(cloudflareUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${config.CF_IMAGES_API_KEY}`,
          },
        });

        const data = await response.json();
        
        // Check if error is "not found" - that's OK, already deleted
        if (!data.success) {
          const errorMessage = data.errors?.[0]?.message || '';
          const isNotFound = errorMessage.toLowerCase().includes('not found') || response.status === 404;
          
          if (!isNotFound) {
            console.warn(`Failed to delete Cloudflare image ${imageId}:`, data.errors);
          }
        }

        return { id: imageId, success: true };
      } catch (error) {
        console.warn(`Error deleting Cloudflare image ${imageId}:`, error);
        return { id: imageId, success: false };
      }
    });

    await Promise.all(deletePromises);

    // Delete from database
    const deleteResult = await prisma.media.deleteMany({
      where: {
        propertyId,
        image: { in: cloudflareIds },
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
    console.error('Media delete error:', error);
    return errorResponse(error, event);
  }
});
