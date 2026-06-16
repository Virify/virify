import { getOwnershipFilter } from "~~/server/utils/ownership";
import { z } from "zod";
/**
 * Step 9: Property Images API Endpoint
 *
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 * Handles: Upload images to Cloudflare (done client-side via direct upload),
 * store cloudflare IDs and room assignments in database,
 * associate images with specific rooms (bedrooms, bathrooms, etc.)
 */

const stepDataSchema = step9Schema
  .extend({
    draftId: z.number().int().positive().optional(),
    listingId: z.number().int().positive().optional(),
  })
  .refine((data) => data.draftId !== undefined || data.listingId !== undefined, {
    message: "Either draftId or listingId must be provided",
  });

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    const body = await readBody(event);
    const { draftId, listingId, property } = stepDataSchema.parse(body);

    const { media, description } = property;

    // LIVE LISTING - update Listing table
    if (listingId) {
      const existingListing = await prisma.listing.findUnique({
        where: { id: listingId, ...getOwnershipFilter(user) },
        include: {
          property: {
            include: {
              media: true,
            },
          },
        },
      });

      if (!existingListing || !existingListing.property) {
        throw createError({
          statusCode: 404,
          statusMessage: "Listing or property not found",
        });
      }

      const propertyId = existingListing.property.id;

      // Batch description + media updates in a single transaction
      await prisma.$transaction([
        prisma.property.update({
          where: { id: propertyId },
          data: { description },
        }),
        ...media.map((mediaItem, i) =>
          prisma.media.updateMany({
            where: { propertyId, image: mediaItem.cloudflareId },
            data: {
              sortOrder: i,
              metadata: JSON.stringify({
                alt: mediaItem.description || "Property image",
                description: mediaItem.description || null,
                cloudflareImageId: mediaItem.cloudflareId,
                filename: mediaItem.filename || null,
              }),
              bedroomId: mediaItem.bedroomId || null,
              bathroomId: mediaItem.bathroomId || null,
              kitchenId: mediaItem.kitchenId || null,
              receptionId: mediaItem.receptionId || null,
              otherRoomId: mediaItem.otherRoomId || null,
              gardenId: mediaItem.gardenId || null,
              yardId: mediaItem.yardId || null,
              landId: mediaItem.landId || null,
              outdoorSpaceId: mediaItem.outdoorSpaceId || null,
            },
          }),
        ),
      ]);

      return await prisma.listing
        .findUnique({
          where: { id: listingId, ...getOwnershipFilter(user) },
          include: {
            property: {
              include: {
                media: true,
                bedroomFeatures: { include: { media: true } },
                bathroomFeatures: { include: { media: true } },
                kitchenFeatures: { include: { media: true } },
                reception: { include: { media: true } },
                otherRoom: { include: { media: true } },
                outdoorSpace: {
                  include: {
                    garden: { include: { media: true } },
                    yard: { include: { media: true } },
                    land: { include: { media: true } },
                  },
                },
              },
            },
          },
        })
        .then(async (listing) => {
          // Invalidate listing detail cache and my-listings page cache
          await Promise.all([
            invalidateListingCache(listingId),
            invalidateMyListingsCache(user.id),
          ]);
          return listing;
        });
    }

    // DRAFT LISTING - update DraftListing table with completedSteps
    const existingDraft = await prisma.draftListing.findUnique({
      where: { id: draftId, ...getOwnershipFilter(user) },
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
        statusMessage: "Draft listing or property not found",
      });
    }

    const propertyId = existingDraft.property.id;

    // Batch description + media updates in a single transaction
    await prisma.$transaction([
      prisma.property.update({
        where: { id: propertyId },
        data: { description },
      }),
      ...media.map((mediaItem, i) =>
        prisma.media.updateMany({
          where: { propertyId, image: mediaItem.cloudflareId },
          data: {
            sortOrder: i,
            metadata: JSON.stringify({
              alt: mediaItem.description || "Property image",
              description: mediaItem.description || null,
              cloudflareImageId: mediaItem.cloudflareId,
              filename: mediaItem.filename || null,
            }),
            bedroomId: mediaItem.bedroomId || null,
            bathroomId: mediaItem.bathroomId || null,
            kitchenId: mediaItem.kitchenId || null,
            receptionId: mediaItem.receptionId || null,
            otherRoomId: mediaItem.otherRoomId || null,
            gardenId: mediaItem.gardenId || null,
            yardId: mediaItem.yardId || null,
            landId: mediaItem.landId || null,
            outdoorSpaceId: mediaItem.outdoorSpaceId || null,
          },
        }),
      ),
    ]);

    // Get current completedSteps to check if step 9 already exists
    const completedSteps = existingDraft.completedSteps || [];

    // Update draft with step completion
    const result = await prisma.draftListing.update({
      where: { id: draftId!, ...getOwnershipFilter(user) },
      data: {
        // Add step 9 to completedSteps if not already there
        ...(!completedSteps.includes(9) ? { completedSteps: { push: 9 } } : {}),
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

    await invalidateDraftListingsCache(user.id as number);
    return result;
  } catch (error) {
    console.error("Step nine update error:", error);
    return errorResponse(error, event);
  }
});
