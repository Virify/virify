import { z } from "zod";
import { step5Schema } from "~~/shared/utils/listing-step5-schema";
import { OtherRoomType, ReceptionType, KitchenFeature, RoomFeature } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Step 5: Kitchens, Receptions & Other Rooms API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 * Uses deleteMany + create pattern to replace all existing room features.
 */

const stepDataSchema = step5Schema.extend({
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
}).refine(
  (data) => data.draftId !== undefined || data.listingId !== undefined,
  { message: "Either draftId or listingId must be provided" }
);

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { draftId, listingId, property } = stepDataSchema.parse(body);

    const { kitchenFeatures, numberKitchens, reception, numberReceptions, otherRoom, numberOtherRooms, totalFloors } = property;

    const propertyUpdate = {
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
    };

    // LIVE LISTING - update Listing table
    if (listingId) {
      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: { property: propertyUpdate },
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

      // Invalidate listing cache so modal shows fresh data
      const storage = useStorage('cache:listing');
      await storage.removeItem(`listing:${listingId}`);

      return result;
    }

    // DRAFT LISTING - update DraftListing table with completedSteps
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

    const draftResult = await prisma.draftListing.update({
      where: { id: draftId!, userId: user.id },
      data: {
        // Add step 5 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(5) ? { completedSteps: { push: 5 } } : {}),
        property: propertyUpdate,
      },
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
    await invalidateDraftListingsCache(user.id as number);
    return draftResult;
  } catch (error) {
    console.error('[Step5 PATCH] Error:', error);
    return errorResponse(error, event);
  }
});
