import * as z from "zod";

import { OtherRoomType, ReceptionType, KitchenFeature, RoomFeature } from "~~/layers/database/server/database/prisma/generated/enums";

const stepSixSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    totalFloors: z.coerce.number().int().min(0),
    kitchenFeatures: z
      .array(
        z.object({
          name: z.string().max(100),
          roomNumber: z.coerce.number().int().min(1),
          description: z.string().max(500).nullable().optional(),
          floor: z.coerce.number().int().min(1),
          size: z.coerce.number().min(0).nullable().optional(),
          features: z.array(z.enum(Object.values(KitchenFeature) as [string, ...string[]])).optional(),
        })
      ),
    numberKitchens: z.coerce.number().int().min(0).optional(),
    reception: z
      .array(
        z.object({
          name: z.string().max(100),
          roomNumber: z.coerce.number().int().min(1),
          description: z.string().max(500).nullable().optional(),
          floor: z.coerce.number().int().min(1),
          size: z.coerce.number().min(0).nullable().optional(),
          type: z.enum(Object.values(ReceptionType) as [string, ...string[]]),
          features: z.array(z.enum(Object.values(RoomFeature) as [string, ...string[]])).optional(),
        })
      ),
    numberReceptions: z.coerce.number().int().min(0).optional(),
    otherRoom: z
      .array(
        z.object({
          name: z.string().max(100),
          roomNumber: z.coerce.number().int().min(1),
          description: z.string().max(500).nullable().optional(),
          floor: z.coerce.number().int().min(1),
          size: z.coerce.number().min(0).nullable().optional(),
          type: z.enum(Object.values(OtherRoomType) as [string, ...string[]]),
          features: z.array(z.enum(Object.values(RoomFeature) as [string, ...string[]])).optional(),
        })
      ),
    numberOtherRooms: z.coerce.number().int().min(0).optional(),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { draftId, property } = await readValidatedBody(event, stepSixSchema.parse);

    const { kitchenFeatures, numberKitchens, reception, numberReceptions, otherRoom, numberOtherRooms, totalFloors } = property;

    const result = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
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
    return result;
  } catch (error) {
    console.log("Error updating draft listing:", error);
    return errorResponse(error, event);
  }
});
