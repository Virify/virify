import * as z from "zod";
import { BedSizeType } from "~~/layers/database/server/database/prisma/generated/enums";

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
          bed: z.array(z.enum(Object.values(BedSizeType))).min(1),
          size: z.coerce.number().min(0).nullable().optional(),
          enSuite: z.boolean().optional(),
          builtInStorage: z.boolean().optional(),
          walkInWardrobe: z.boolean().optional(),
          bayWindow: z.boolean().optional(),
          balcony: z.boolean().optional(),
          hasView: z.boolean().optional(),
          patioDoors: z.boolean().optional(),
          builtInDesk: z.boolean().optional(),
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
          toilet: z.boolean().optional(),
          enSuite: z.boolean().optional(),
          bathtub: z.boolean().optional(),
          walkInShower: z.boolean().optional(),
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
                bed: b.bed,
                size: b.size ?? null,
                enSuite: b.enSuite ?? false,
                builtInStorage: b.builtInStorage ?? false,
                walkInWardrobe: b.walkInWardrobe ?? false,
                bayWindow: b.bayWindow ?? false,
                balcony: b.balcony ?? false,
                hasView: b.hasView ?? false,
                patioDoors: b.patioDoors ?? false,
                builtInDesk: b.builtInDesk ?? false,
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
                toilet: b.toilet ?? false,
                enSuite: b.enSuite ?? false,
                bathtub: b.bathtub ?? false,
                walkInShower: b.walkInShower ?? false,
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
