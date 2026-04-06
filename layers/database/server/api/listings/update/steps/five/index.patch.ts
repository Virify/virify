import * as z from "zod";
import { BedSizeType, BedroomFeature, BathroomFeature } from "~~/layers/database/server/database/prisma/generated/enums";
import { invalidateListingCache } from "~~/layers/database/server/utils/cache";

// Validate payload to match Prisma Bedroom and Bathroom models and StepFive type (now includes both)
const bedroomBathroomSchema = z.object({
  listingId: z.number().int().positive(),
  property: z.object({
    totalFloors: z.coerce.number().int().min(0),
    bedroomFeatures: z
      .array(
        z.object({
          name: z.string().max(100),
          roomNumber: z.coerce.number().int().min(1),
          description: z.string().max(500).nullable().optional(),
          floor: z.coerce.number().int().min(1),
          bed: z.array(z.enum(Object.values(BedSizeType))).min(1),
          size: z.coerce.number().min(0).nullable().optional(),
          features: z.array(z.enum(Object.values(BedroomFeature) as [string, ...string[]])).optional(),
        })
      ),
    numberBedrooms: z.coerce.number().int().min(0),
    bathroomFeatures: z
      .array(
        z.object({
          name: z.string().max(100).nullable(),
          roomNumber: z.coerce.number().int().min(1),
          description: z.string().max(500).optional(),
          floor: z.coerce.number().int().min(1),
          size: z.coerce.number().min(0).nullable().optional(),
          features: z.array(z.enum(Object.values(BathroomFeature) as [string, ...string[]])).optional(),
        })
      ),
    numberBathrooms: z.coerce.number().int().min(0)
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { listingId, property } = await readValidatedBody(event, bedroomBathroomSchema.parse);

    const { bedroomFeatures, numberBedrooms, bathroomFeatures, numberBathrooms, totalFloors } = property;

    const result = await prisma.listing.update({
      where: { id: listingId, userId: user.id },
      data: {
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
                bed: b.bed,
                size: b.size ?? null,
                features: b.features as BedroomFeature[] ?? [],
              })),
            },
            bathroomFeatures: {
              deleteMany: {},
              create: bathroomFeatures.map((b) => ({
                name: b.name,
                roomNumber: b.roomNumber,
                description: b.description ?? null,
                floor: b.floor,
                size: b.size ?? null,
                features: b.features as BathroomFeature[] ?? [],
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

    // Invalidate cache after update
    await invalidateListingCache(listingId);

    return result;
  } catch (error) {
    return errorResponse(error, event);
  }
});
