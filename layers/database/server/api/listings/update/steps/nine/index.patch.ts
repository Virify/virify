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

// Media item with optional DB id for precise updates
const mediaItemWithIdSchema = z.object({
  id: z.number().int().positive().optional(),
  cloudflareId: z.string(),
  description: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  bedroomId: z.number().nullable().optional(),
  bathroomId: z.number().nullable().optional(),
  kitchenId: z.number().nullable().optional(),
  receptionId: z.number().nullable().optional(),
  otherRoomId: z.number().nullable().optional(),
  gardenId: z.number().nullable().optional(),
  yardId: z.number().nullable().optional(),
  landId: z.number().nullable().optional(),
  outdoorSpaceId: z.number().nullable().optional(),
  isGeneral: z.boolean().optional(),
});

/** All room ID sets for one property, keyed by type */
interface PropertyRooms {
  bedroomIds: Set<number>;
  bathroomIds: Set<number>;
  kitchenIds: Set<number>;
  receptionIds: Set<number>;
  otherRoomIds: Set<number>;
  gardenIds: Set<number>;
  yardIds: Set<number>;
  landIds: Set<number>;
}

/** Load the real DB room IDs for a property so we can validate client-sent FKs */
async function loadPropertyRooms(propertyId: number): Promise<PropertyRooms> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      bedroomFeatures: { select: { id: true } },
      bathroomFeatures: { select: { id: true } },
      kitchenFeatures: { select: { id: true } },
      reception: { select: { id: true } },
      otherRoom: { select: { id: true } },
      outdoorSpace: {
        include: {
          garden: { select: { id: true } },
          yard: { select: { id: true } },
          land: { select: { id: true } },
        },
      },
    },
  });

  return {
    bedroomIds: new Set(property?.bedroomFeatures.map((r) => r.id) ?? []),
    bathroomIds: new Set(property?.bathroomFeatures.map((r) => r.id) ?? []),
    kitchenIds: new Set(property?.kitchenFeatures.map((r) => r.id) ?? []),
    receptionIds: new Set(property?.reception.map((r) => r.id) ?? []),
    otherRoomIds: new Set(property?.otherRoom.map((r) => r.id) ?? []),
    gardenIds: new Set(property?.outdoorSpace?.garden.map((r) => r.id) ?? []),
    yardIds: new Set(property?.outdoorSpace?.yard.map((r) => r.id) ?? []),
    landIds: new Set(property?.outdoorSpace?.land.map((r) => r.id) ?? []),
  };
}

/**
 * Resolve a client-supplied room FK against the real DB IDs for this property.
 * Returns null if the ID doesn't exist in the DB (e.g. a fallback roomNumber was sent).
 */
function resolveRoomId(
  id: number | null | undefined,
  validIds: Set<number>,
): number | null {
  if (!id) return null;
  return validIds.has(id) ? id : null;
}

/**
 * Build the Prisma data payload for a media update.
 * Validates all room FKs against the real DB IDs to prevent P2003 errors.
 */
function buildMediaData(
  mediaItem: z.infer<typeof mediaItemWithIdSchema>,
  sortOrder: number,
  rooms: PropertyRooms,
) {
  return {
    sortOrder,
    metadata: JSON.stringify({
      alt: mediaItem.description || "Property image",
      description: mediaItem.description ?? "",
      cloudflareImageId: mediaItem.cloudflareId,
      filename: mediaItem.filename || null,
    }),
    bedroomId: resolveRoomId(mediaItem.bedroomId, rooms.bedroomIds),
    bathroomId: resolveRoomId(mediaItem.bathroomId, rooms.bathroomIds),
    kitchenId: resolveRoomId(mediaItem.kitchenId, rooms.kitchenIds),
    receptionId: resolveRoomId(mediaItem.receptionId, rooms.receptionIds),
    otherRoomId: resolveRoomId(mediaItem.otherRoomId, rooms.otherRoomIds),
    gardenId: resolveRoomId(mediaItem.gardenId, rooms.gardenIds),
    yardId: resolveRoomId(mediaItem.yardId, rooms.yardIds),
    landId: resolveRoomId(mediaItem.landId, rooms.landIds),
    outdoorSpaceId: null,
  };
}

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

      // Load real DB room IDs so we can validate client-sent FKs (prevents P2003)
      const rooms = await loadPropertyRooms(propertyId);

      // Batch description + media updates in a single transaction.
      // Use update-by-id when the DB id is known (always the case after our
      // loader/upload fixes). Fall back to updateMany by cloudflareId for any
      // legacy records that don't carry an id.
      await prisma.$transaction([
        prisma.property.update({
          where: { id: propertyId },
          data: { description },
        }),
        ...media.map((mediaItem, i) => {
          const data = buildMediaData(mediaItem as any, i, rooms);
          const id = (mediaItem as any).id as number | undefined;
          if (id) {
            return prisma.media.update({ where: { id }, data });
          }
          return prisma.media.updateMany({
            where: { propertyId, image: mediaItem.cloudflareId },
            data,
          });
        }),
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

    // Load real DB room IDs so we can validate client-sent FKs (prevents P2003)
    const rooms = await loadPropertyRooms(propertyId);

    // Batch description + media updates in a single transaction.
    // Use update-by-id when the DB id is known (always the case after our
    // loader/upload fixes). Fall back to updateMany by cloudflareId for any
    // legacy records that don't carry an id.
    await prisma.$transaction([
      prisma.property.update({
        where: { id: propertyId },
        data: { description },
      }),
      ...media.map((mediaItem, i) => {
        const data = buildMediaData(mediaItem as any, i, rooms);
        const id = (mediaItem as any).id as number | undefined;
        if (id) {
          return prisma.media.update({ where: { id }, data });
        }
        return prisma.media.updateMany({
          where: { propertyId, image: mediaItem.cloudflareId },
          data,
        });
      }),
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
