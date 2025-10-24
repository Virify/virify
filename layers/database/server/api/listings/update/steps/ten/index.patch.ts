import * as z from "zod";

/**
 * Schema for media assignment to rooms
 */
const mediaAssignmentSchema = z.object({
  cloudflareId: z.string(),
  description: z.string().max(500).nullable().optional(),
  // Room IDs (only one should be set, or none for general property images)
  bedroomId: z.number().int().positive().nullable().optional(),
  bathroomId: z.number().int().positive().nullable().optional(),
  kitchenId: z.number().int().positive().nullable().optional(),
  receptionId: z.number().int().positive().nullable().optional(),
  otherRoomId: z.number().int().positive().nullable().optional(),
  gardenId: z.number().int().positive().nullable().optional(),
  yardId: z.number().int().positive().nullable().optional(),
  landId: z.number().int().positive().nullable().optional(),
  outdoorSpaceId: z.number().int().positive().nullable().optional(),
});

const stepTenSchema = z.object({
  listingId: z.number().int().positive(),
  media: z.array(mediaAssignmentSchema),
});

/**
 * PATCH /api/draft-listings/update/steps/ten
 * Update step ten - Media/Images
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const { listingId, media } = await readValidatedBody(event, stepTenSchema.parse);

    // Verify draft ownership
    const existingDraft = await prisma.listing.findUnique({
      where: { id: listingId, userId: user.id },
      include: {
        property: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!existingDraft || !existingDraft.property) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Draft listing or property not found',
      });
    }

    const propertyId = existingDraft.property.id;

    // Delete all existing media for this property
    await prisma.media.deleteMany({
      where: { propertyId },
    });

    // Create new media records (propertyId is automatically set through the relation)
    const mediaToCreate = media.map((m) => ({
      image: m.cloudflareId,
      metadata: JSON.stringify({
        alt: m.description || 'Property image',
        description: m.description || null,
        cloudflareImageId: m.cloudflareId,
      }),
      // Assign to room if specified
      bedroomId: m.bedroomId || null,
      bathroomId: m.bathroomId || null,
      kitchenId: m.kitchenId || null,
      receptionId: m.receptionId || null,
      otherRoomId: m.otherRoomId || null,
      gardenId: m.gardenId || null,
      yardId: m.yardId || null,
      landId: m.landId || null,
      outdoorSpaceId: m.outdoorSpaceId || null,
    }));

    // Update draft with new media
    const result = await prisma.listing.update({
      where: { id: listingId, userId: user.id },
      data: {
        property: {
          update: {
            media: {
              create: mediaToCreate,
            },
          },
        },
        completedSteps: {
          set: Array.from(new Set([...(existingDraft.completedSteps || []), 10])),
        },
      },
      include: {
        property: {
          include: {
            media: true,
            bedroomFeatures: {
              include: {
                media: true,
              },
            },
            bathroomFeatures: {
              include: {
                media: true,
              },
            },
            kitchenFeatures: {
              include: {
                media: true,
              },
            },
            reception: {
              include: {
                media: true,
              },
            },
            otherRoom: {
              include: {
                media: true,
              },
            },
            outdoorSpace: {
              include: {
                garden: {
                  include: {
                    media: true,
                  },
                },
                yard: {
                  include: {
                    media: true,
                  },
                },
                land: {
                  include: {
                    media: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error('Step ten update error:', error);
    return errorResponse(error, event);
  }
});
