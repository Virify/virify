import * as z from "zod";
import { BedSizeType, BedroomFeature, BathroomFeature } from "~~/layers/database/server/database/prisma/generated/enums";
import { step4PropertySchema } from "~~/shared/utils/listing-step4-schema";

/**
 * Step 4: Bedrooms & Bathrooms API Endpoint
 * 
 * This endpoint handles saving bedroom and bathroom features for a draft listing.
 * It uses deleteMany + create pattern to replace all existing room features.
 */

// Validate payload - reuse shared schema
const bedroomBathroomSchema = z.object({
  draftId: z.number().int().positive(),
  property: step4PropertySchema,
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const { draftId, property } = await readValidatedBody(event, bedroomBathroomSchema.parse);

    const { bedroomFeatures, numberBedrooms, bathroomFeatures, numberBathrooms, totalFloors } = property;

    // Get current completedSteps to check if step 4 already exists
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    const result = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        // Add step 4 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(4) ? { completedSteps: { push: 4 } } : {}),
        property: {
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
        },
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
    
    return result;
  } catch (error) {
    return errorResponse(error, event);
  }
});
