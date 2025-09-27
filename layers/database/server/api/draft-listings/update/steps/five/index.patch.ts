import * as z from "zod";

// Validate payload to match Prisma Bedroom model and StepFive type
const bedroomSchema = z.object({
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
          bed: z.array(z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING", "SUPER_KING"])).min(1),
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
      )
      .min(1),
    numberBedrooms: z.coerce.number().int().min(1)
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { draftId, property } = await readValidatedBody(event, bedroomSchema.parse);

    const { bedroomFeatures, numberBedrooms, totalFloors } = property;

    const result = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        property: {
          update: {
            totalFloors,
            numberBedrooms: numberBedrooms ?? bedroomFeatures.length,
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
          },
        },
      },
      include: {
        property: {
          include: {
            bedroomFeatures: true,
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
