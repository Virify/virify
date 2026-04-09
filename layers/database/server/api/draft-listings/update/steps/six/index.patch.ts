import { z } from "zod";
import { step6Schema } from "~~/shared/utils/listing-step6-schema";
import { GardenFacing, GardenPosition, OutdoorSpaceFeature, LandFeature } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Step 6: Outdoor Spaces API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 * Uses deleteMany + create pattern to replace all existing outdoor space features.
 */

const stepDataSchema = step6Schema.extend({
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
}).refine(
  (data) => data.draftId !== undefined || data.listingId !== undefined,
  { message: "Either draftId or listingId must be provided" }
);

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { draftId, listingId, property } = stepDataSchema.parse(body);

    const { outdoorSpace } = property;

    const outdoorSpaceUpdate = {
      upsert: {
        create: {
          description: outdoorSpace.description ?? null,
          totalArea: outdoorSpace.totalArea ?? null,
          features: outdoorSpace.features as OutdoorSpaceFeature[] ?? [],
          garden: {
            create: outdoorSpace.garden.map((g) => ({
              name: g.name,
              description: g.description ?? null,
              facing: g.facing as GardenFacing | null,
              position: g.position as GardenPosition | null,
              features: g.features as OutdoorSpaceFeature[] ?? [],
              size: g.size ?? null,
            })),
          },
          yard: {
            create: outdoorSpace.yard.map((y) => ({
              name: y.name,
              description: y.description ?? null,
              facing: y.facing as GardenFacing | null,
              position: y.position as GardenPosition | null,
              features: y.features as OutdoorSpaceFeature[] ?? [],
              size: y.size ?? null,
            })),
          },
          land: {
            create: outdoorSpace.land.map((l) => ({
              name: l.name,
              description: l.description ?? null,
              features: l.features as LandFeature[] ?? [],
              size: l.size ?? null,
            })),
          },
        },
        update: {
          description: outdoorSpace.description ?? null,
          totalArea: outdoorSpace.totalArea ?? null,
          features: outdoorSpace.features as OutdoorSpaceFeature[] ?? [],
          garden: {
            deleteMany: {},
            create: outdoorSpace.garden.map((g) => ({
              name: g.name,
              description: g.description ?? null,
              facing: g.facing as GardenFacing | null,
              position: g.position as GardenPosition | null,
              features: g.features as OutdoorSpaceFeature[] ?? [],
              size: g.size ?? null,
            })),
          },
          yard: {
            deleteMany: {},
            create: outdoorSpace.yard.map((y) => ({
              name: y.name,
              description: y.description ?? null,
              facing: y.facing as GardenFacing | null,
              position: y.position as GardenPosition | null,
              features: y.features as OutdoorSpaceFeature[] ?? [],
              size: y.size ?? null,
            })),
          },
          land: {
            deleteMany: {},
            create: outdoorSpace.land.map((l) => ({
              name: l.name,
              description: l.description ?? null,
              features: l.features as LandFeature[] ?? [],
              size: l.size ?? null,
            })),
          },
        },
      },
    };

    // LIVE LISTING - update Listing table
    if (listingId) {
      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: {
          property: {
            update: {
              outdoorSpace: outdoorSpaceUpdate,
            },
          },
        },
        include: {
          property: {
            include: {
              outdoorSpace: {
                include: {
                  garden: true,
                  yard: true,
                  land: true,
                },
              },
            },
          },
        },
      });

      // Invalidate listing detail cache and my-listings page cache
      const storage = useStorage('cache:listing');
      await Promise.all([
        storage.removeItem(`listing:${listingId}`),
        invalidateMyListingsCache(user.id as number),
      ]);

      return result;
    }

    // DRAFT LISTING - update DraftListing table with completedSteps
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    const result = await prisma.draftListing.update({
      where: { id: draftId!, userId: user.id },
      data: {
        // Add step 6 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(6) ? { completedSteps: { push: 6 } } : {}),
        property: {
          update: {
            outdoorSpace: outdoorSpaceUpdate,
          },
        },
      },
      include: {
        property: {
          include: {
            outdoorSpace: {
              include: {
                garden: true,
                yard: true,
                land: true,
              },
            },
          },
        },
      },
    });

    await invalidateDraftListingsCache(user.id as number);
    return result;
  } catch (error) {
    console.log("Error updating draft listing step six:", error);
    return errorResponse(error, event);
  }
});
