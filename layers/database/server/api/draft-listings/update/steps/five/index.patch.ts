import { z } from "zod";
import { step5Schema } from "~~/shared/utils/listing-step5-schema";
import { OtherRoomType, ReceptionType, KitchenFeature, RoomFeature } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Step 5: Kitchens, Receptions & Other Rooms API Endpoint
 * 
 * This endpoint handles saving kitchen features, reception rooms, and other rooms for a draft listing.
 * It uses deleteMany + create pattern to replace all existing room features.
 */

// Extend step5Schema to require draftId for updates
const stepDataSchema = step5Schema.extend({
  draftId: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { draftId, property } = stepDataSchema.parse(body);

    const { kitchenFeatures, numberKitchens, reception, numberReceptions, otherRoom, numberOtherRooms, totalFloors } = property;

    // Get current completedSteps to check if step 5 already exists
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    if (!currentDraft) {
      throw createError({
        statusCode: 404,
        statusMessage: "Draft listing not found",
      });
    }

    // Prepare update data
    const updateData: any = {
      // Add step 5 to completedSteps if not already there
      ...(currentDraft && !currentDraft.completedSteps.includes(5) ? { completedSteps: { push: 5 } } : {}),
      property: {
        update: {
          totalFloors,
          numberKitchens: numberKitchens ?? kitchenFeatures.length,
          numberReceptions: numberReceptions ?? reception.length,
          numberOtherRooms: numberOtherRooms ?? otherRoom.length,
          kitchenFeatures: {
            deleteMany: {},
            create: kitchenFeatures.map((k) => ({
              name: k.name,
              roomNumber: k.roomNumber,
              description: k.description ?? null,
              floor: k.floor,
              size: k.size ?? null,
              features: (k.features ?? []) as KitchenFeature[],
            })),
          },
          reception: {
            deleteMany: {},
            create: reception.map((r) => ({
              name: r.name,
              roomNumber: r.roomNumber,
              description: r.description ?? null,
              floor: r.floor,
              size: r.size ?? null,
              type: r.type as ReceptionType,
              features: (r.features ?? []) as RoomFeature[],
            })),
          },
          otherRoom: {
            deleteMany: {},
            create: otherRoom.map((o) => ({
              name: o.name,
              roomNumber: o.roomNumber,
              description: o.description ?? null,
              floor: o.floor,
              size: o.size ?? null,
              type: o.type as OtherRoomType,
              features: (o.features ?? []) as RoomFeature[],
            })),
          },
        },
      },
    };

    return await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: updateData,
      include: {
        property: {
          include: {
            kitchenFeatures: true,
            reception: true,
            otherRoom: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('[Step5 PATCH] Error:', error);
    return errorResponse(error, event);
  }
});
