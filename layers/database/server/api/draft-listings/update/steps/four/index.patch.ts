import * as z from "zod";
import { BedSizeType, BedroomFeature, BathroomFeature } from "~~/layers/database/server/database/prisma/generated/enums";
import { step4PropertySchema } from "~~/shared/utils/listing-step4-schema";

/**
 * Step 4: Bedrooms & Bathrooms API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 * Uses deleteMany + create pattern to replace all existing room features.
 */

const bedroomBathroomSchema = z.object({
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
  property: step4PropertySchema,
}).refine(
  (data) => data.draftId !== undefined || data.listingId !== undefined,
  { message: "Either draftId or listingId must be provided" }
);

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const { draftId, listingId, property } = await readValidatedBody(event, bedroomBathroomSchema.parse);

    const { bedroomFeatures, numberBedrooms, bathroomFeatures, numberBathrooms, totalFloors } = property;

    const propertyUpdate = {
      update: {
        totalFloors,
        numberBedrooms: numberBedrooms ?? bedroomFeatures.length,
        numberBathrooms: numberBathrooms ?? bathroomFeatures.length,
        bedroomFeatures: {
          deleteMany: {},
          create: bedroomFeatures.map((b) => ({
            name: b.name,
            roomNumber: b.roomNumber,
            description: b.description ?? null,
            floor: b.floor,
            bed: b.bed as BedSizeType[],
            features: (b.features ?? []) as BedroomFeature[],
            size: b.size ?? null,
          })),
        },
        bathroomFeatures: {
          deleteMany: {},
          create: bathroomFeatures.map((b) => ({
            name: b.name,
            roomNumber: b.roomNumber,
            description: b.description ?? null,
            floor: b.floor,
            features: (b.features ?? []) as BathroomFeature[],
            size: b.size ?? null,
          })),
        },
      },
    };

    // LIVE LISTING - update Listing table
    if (listingId) {
      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: { property: propertyUpdate },
        include: {
          property: {
            include: {
              bedroomFeatures: true,
              bathroomFeatures: true,
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
        // Add step 4 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(4) ? { completedSteps: { push: 4 } } : {}),
        property: propertyUpdate,
      },
      include: {
        property: {
          include: {
            bedroomFeatures: true,
            bathroomFeatures: true,
          },
        },
      },
    });
    
    await invalidateDraftListingsCache(user.id as number);
    return result;
  } catch (error) {
    return errorResponse(error, event);
  }
});
