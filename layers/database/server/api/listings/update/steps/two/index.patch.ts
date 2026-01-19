import * as z from "zod";
import { ConstructionType } from "~~/layers/database/server/database/prisma/generated/enums";

const stepTwoScehma = z.object({
  listingId: z.number().int().positive(),
  property: z.object({
    type: z.number().int().positive(),
    classification: z.number().int().positive(),
    constructionType: z.enum(Object.values(ConstructionType)).nullable().optional(),
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
  const { user } = await requireUserSession(event);
  try {
    const { listingId, property } = await readValidatedBody(event, stepTwoScehma.parse);

    return await prisma.listing.update({
      where: { id: listingId, userId: user.id },
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
              totalFloors: property.totalFloors,
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
    return errorResponse(error, event);
  }
});
