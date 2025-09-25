import * as z from "zod";

const stepTwoScehma = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    type: z.number().int().positive(),
    classification: z.number().int().positive(),
    constructionType: z.enum(["STANDARD", "NON_STANDARD"]).nullable().optional(),
    yearBuilt: z.coerce
      .number()
      .min(4)
      .max(new Date().getFullYear() || 2024)
      .nullable()
      .optional(),
    size: z.number().positive().nullable(),
    description: z.string().max(5000),
    totalFloors: z.number().int().min(1),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { draftId, property } = await readValidatedBody(event, stepTwoScehma.parse);

    return await prisma.draftListing.update({
      where: { id: draftId },
      data: {
        property: {
          upsert: {
            update: {
              type: { connect: { id: property.type } },
              classification: { connect: { id: property.classification } },
              constructionType: property.constructionType || null,
              yearBuilt: property.yearBuilt ? String(property.yearBuilt) : null,
              size: property.size || null,
              description: property.description,
            },
            create: {
              type: { connect: { id: property.type } },
              classification: { connect: { id: property.classification } },
              constructionType: property.constructionType || null,
              yearBuilt: property.yearBuilt ? String(property.yearBuilt) : null,
              size: property.size || null,
              description: property.description,
              totalFloors: property.totalFloors,
            },
          },
        },
      },
      include: {
        property: true,
      },
    });
  } catch (error) {
    console.error("Error fetching PPD test data:", error);
    return errorResponse(error, event);
  }
});
