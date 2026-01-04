import * as z from "zod";
import { BedSizeType, BedroomFeature, BathroomFeature } from "~~/layers/database/server/database/prisma/generated/enums";

// Validate payload to match Prisma Bedroom and Bathroom models and StepFive type (now includes both)
const bedroomBathroomSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    totalFloors: z.coerce.number().int().min(0),
    bedroomFeatures: z
      .array(
        z.object({
          name: z.string().max(100),
          roomNumber: z.coerce.number().int().min(1),
          description: z.string().max(500).nullable().optional(),
          floor: z.coerce.number().int().min(1),
          bed: z.array(z.enum(Object.values(BedSizeType) as [string, ...string[]])).min(1),
          features: z.array(z.enum(Object.values(BedroomFeature) as [string, ...string[]])).optional(),
          size: z.coerce.number().min(0).nullable().optional(),
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
          features: z.array(z.enum(Object.values(BathroomFeature) as [string, ...string[]])).optional(),
          size: z.coerce.number().min(0).nullable().optional(),
        })
      ),
    numberBathrooms: z.coerce.number().int().min(0)
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { draftId, property } = await readValidatedBody(event, bedroomBathroomSchema.parse);

    const { bedroomFeatures, numberBedrooms, bathroomFeatures, numberBathrooms, totalFloors } = property;

    const result = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
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
