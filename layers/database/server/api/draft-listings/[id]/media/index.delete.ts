import { z } from 'zod';

/**
 * DELETE /api/draft-listings/[id]/media
 * Delete media images from a draft listing (bulk delete)
 * Also deletes from Cloudflare
 */

const requestSchema = z.object({
  cloudflareIds: z.array(z.string()).min(1),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    const draftId = parseInt(getRouterParam(event, 'id') || '0');
    
    if (!draftId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Draft ID is required',
      });
    }

    const body = await readBody(event);
    const { cloudflareIds } = requestSchema.parse(body);

    // Verify draft ownership and get property ID
    const existingDraft = await prisma.draftListing.findUnique({
      where: { id: draftId, userId: user.id },
      include: {
        property: true,
      },
    });

    if (!existingDraft || !existingDraft.property) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Draft listing or property not found',
      });
    }

    const propertyId = existingDraft.property.id;
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

    return {
      success: true,
      deleted: deleteResult.count,
    };
  } catch (error) {
    console.error('Media delete error:', error);
    return errorResponse(error, event);
  }
});
