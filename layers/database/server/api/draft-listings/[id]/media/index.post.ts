import { z } from 'zod';

/**
 * POST /api/draft-listings/[id]/media
 * Add media images to a draft listing (bulk create)
 * Called automatically after Cloudflare upload completes
 */

const mediaItemSchema = z.object({
  cloudflareId: z.string(),
  filename: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  bedroomId: z.number().nullable().optional(),
  bathroomId: z.number().nullable().optional(),
  kitchenId: z.number().nullable().optional(),
  receptionId: z.number().nullable().optional(),
  otherRoomId: z.number().nullable().optional(),
  gardenId: z.number().nullable().optional(),
  yardId: z.number().nullable().optional(),
  landId: z.number().nullable().optional(),
  isGeneral: z.boolean().optional(),
});

const requestSchema = z.object({
  media: z.array(mediaItemSchema).min(1),
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
    const { media } = requestSchema.parse(body);

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

    // Create media records
    const mediaToCreate = media.map((m) => ({
      propertyId,
      image: m.cloudflareId,
      metadata: JSON.stringify({
        alt: m.description || 'Property image',
        description: m.description || null,
        cloudflareImageId: m.cloudflareId,
        filename: m.filename || null,
      }),
      bedroomId: m.bedroomId || null,
      bathroomId: m.bathroomId || null,
      kitchenId: m.kitchenId || null,
      receptionId: m.receptionId || null,
      otherRoomId: m.otherRoomId || null,
      gardenId: m.gardenId || null,
      yardId: m.yardId || null,
      landId: m.landId || null,
      outdoorSpaceId: null,
    }));

    // Bulk create
    await prisma.media.createMany({
      data: mediaToCreate,
    });

    // Return created media
    const createdMedia = await prisma.media.findMany({
      where: {
        propertyId,
        image: { in: media.map(m => m.cloudflareId) },
      },
    });

    return {
      success: true,
      media: createdMedia,
    };
  } catch (error) {
    console.error('Media create error:', error);
    return errorResponse(error, event);
  }
});
