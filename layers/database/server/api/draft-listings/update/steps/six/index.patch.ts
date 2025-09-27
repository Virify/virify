import * as z from "zod";

// Validate payload to match Prisma Bathroom model and StepSix type
const bathroomSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    totalFloors: z.coerce.number().int().min(0),
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
      )
      .min(1),
    numberBathrooms: z.coerce.number().int().min(1)
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { draftId, property } = await readValidatedBody(event, bathroomSchema.parse);

    const { bathroomFeatures, numberBathrooms, totalFloors } = property;

    const result = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        property: {
          update: {
            totalFloors,
            numberBathrooms: numberBathrooms ?? bathroomFeatures.length,
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
            bathroomFeatures: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Error updating draft listing:", error);
    return errorResponse(error, event);
  }
});
