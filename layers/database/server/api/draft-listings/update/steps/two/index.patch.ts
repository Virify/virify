import { z } from "zod";
import { step2Schema } from "~~/shared/utils/listing-step2-schema";

// Extend step2Schema to require draftId for updates
const stepDataSchema = step2Schema.extend({
  draftId: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { draftId, property } = stepDataSchema.parse(body);

    return await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        property: {
          upsert: {
            update: {
              type: { connect: { id: property.type } },
              classification: { connect: { id: property.classification } },
              constructionType: property.constructionType || null,
              yearBuilt: property.yearBuilt && property.yearBuilt !== '0' ? property.yearBuilt : null,
              size: property.size || null,
              description: property.description,
              totalFloors: property.totalFloors,
            },
            create: {
              type: { connect: { id: property.type } },
              classification: { connect: { id: property.classification } },
              constructionType: property.constructionType || null,
              yearBuilt: property.yearBuilt && property.yearBuilt !== '0' ? property.yearBuilt : null,
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
