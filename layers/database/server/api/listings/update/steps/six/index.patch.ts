import * as z from "zod";

import { FireplaceType, OtherRoomType, ReceptionType } from "~~/layers/database/server/database/prisma/generated/enums";

const stepSixSchema = z.object({
  listingId: z.number().int().positive(),
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
          modern: z.boolean().optional(),
          openPlan: z.boolean().optional(),
          whiteGoods: z.boolean().optional(),
          breakfastBar: z.boolean().optional(),
          island: z.boolean().optional(),
          utilityAccess: z.boolean().optional(),
          pantry: z.boolean().optional(),
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
          type: z.nativeEnum(ReceptionType),
          fireplace: z.nativeEnum(FireplaceType).nullable().optional(),
          conservatory: z.boolean().optional(),
          openPlan: z.boolean().optional(),
          openConcept: z.boolean().optional(),
          balcony: z.boolean().optional(),
          bayWindow: z.boolean().optional(),
          builtInShelving: z.boolean().optional(),
          hasView: z.boolean().optional(),
          patioDoors: z.boolean().optional(),
          builtInStorage: z.boolean().optional(),
          servingHatch: z.boolean().optional(),
          barArea: z.boolean().optional(),
          soundProofing: z.boolean().optional(),
          accousticPanels: z.boolean().optional(),
          stoneFlooring: z.boolean().optional(),
          hardwoodFlooring: z.boolean().optional(),
          builtInDesk: z.boolean().optional(),
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
          type: z.nativeEnum(OtherRoomType),
          fireplace: z.nativeEnum(FireplaceType).nullable().optional(),
          openPlan: z.boolean().optional(),
          openConcept: z.boolean().optional(),
          balcony: z.boolean().optional(),
          bayWindow: z.boolean().optional(),
          builtInShelving: z.boolean().optional(),
          hasView: z.boolean().optional(),
          patioDoors: z.boolean().optional(),
          builtInStorage: z.boolean().optional(),
          servingHatch: z.boolean().optional(),
          barArea: z.boolean().optional(),
          soundProofing: z.boolean().optional(),
          accousticPanels: z.boolean().optional(),
          stoneFlooring: z.boolean().optional(),
          hardwoodFlooring: z.boolean().optional(),
          builtInDesk: z.boolean().optional(),
        })
      ),
    numberOtherRooms: z.coerce.number().int().min(0).optional(),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { listingId, property } = await readValidatedBody(event, stepSixSchema.parse);

    const { kitchenFeatures, numberKitchens, reception, numberReceptions, otherRoom, numberOtherRooms, totalFloors } = property;

    const result = await prisma.listing.update({
      where: { id: listingId, userId: user.id },
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
                modern: k.modern ?? true,
                openPlan: k.openPlan ?? false,
                whiteGoods: k.whiteGoods ?? false,
                breakfastBar: k.breakfastBar ?? false,
                island: k.island ?? false,
                utilityAccess: k.utilityAccess ?? false,
                pantry: k.pantry ?? false,
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
                type: r.type,
                fireplace: r.fireplace ?? null,
                conservatory: r.conservatory ?? false,
                openPlan: r.openPlan ?? false,
                openConcept: r.openConcept ?? false,
                balcony: r.balcony ?? false,
                bayWindow: r.bayWindow ?? false,
                builtInShelving: r.builtInShelving ?? false,
                hasView: r.hasView ?? false,
                patioDoors: r.patioDoors ?? false,
                builtInStorage: r.builtInStorage ?? false,
                servingHatch: r.servingHatch ?? false,
                barArea: r.barArea ?? false,
                soundProofing: r.soundProofing ?? false,
                accousticPanels: r.accousticPanels ?? false,
                stoneFlooring: r.stoneFlooring ?? false,
                hardwoodFlooring: r.hardwoodFlooring ?? false,
                builtInDesk: r.builtInDesk ?? false,
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
                type: o.type,
                fireplace: o.fireplace ?? null,
                openPlan: o.openPlan ?? false,
                openConcept: o.openConcept ?? false,
                balcony: o.balcony ?? false,
                bayWindow: o.bayWindow ?? false,
                builtInShelving: o.builtInShelving ?? false,
                hasView: o.hasView ?? false,
                patioDoors: o.patioDoors ?? false,
                builtInStorage: o.builtInStorage ?? false,
                servingHatch: o.servingHatch ?? false,
                barArea: o.barArea ?? false,
                soundProofing: o.soundProofing ?? false,
                accousticPanels: o.accousticPanels ?? false,
                stoneFlooring: o.stoneFlooring ?? false,
                hardwoodFlooring: o.hardwoodFlooring ?? false,
                builtInDesk: o.builtInDesk ?? false,
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
