import * as z from "zod";

// Validate payload for Step Eight - Property Features
const stepEightSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    additionalFeatures: z.object({
      description: z.string().max(5000),
      petFriendly: z.boolean().optional(),
      pool: z.boolean().optional(),
      internet: z.boolean().optional(),
      concierge: z.boolean().optional(),
      shop: z.boolean().optional(),
      gym: z.boolean().optional(),
      moveInDate: z.coerce.date().nullable().optional(),
    }),
    parking: z.object({
      description: z.string().max(5000).nullable().optional(),
      garage: z.boolean().optional(),
      driveway: z.boolean().optional(),
      permitParking: z.boolean().optional(),
      onStreet: z.boolean().optional(),
      noParking: z.boolean().optional(),
      carport: z.boolean().optional(),
      allocatedParking: z.boolean().optional(),
      evCharging: z.boolean().optional(),
    }).nullable().optional(),
    securityFeatures: z.object({
      description: z.string().max(5000).nullable().optional(),
      gatedCommunity: z.boolean().optional(),
      cctv: z.boolean().optional(),
      alarmSystem: z.boolean().optional(),
      neighborhoodWatch: z.boolean().optional(),
      intercomSystem: z.boolean().optional(),
      security: z.boolean().optional(),
      reception: z.boolean().optional(),
    }).nullable().optional(),
    accessibilityFeatures: z.object({
      description: z.string().max(5000).nullable().optional(),
      wheelchairFriendly: z.boolean().optional(),
      stepFreeAccess: z.boolean().optional(),
      wideDoorways: z.boolean().optional(),
      wetRoom: z.boolean().optional(),
      handrails: z.boolean().optional(),
      elevator: z.boolean().optional(),
      stairs: z.boolean().optional(),
      accessibleParking: z.boolean().optional(),
    }).nullable().optional(),
    storageFeatures: z.object({
      description: z.string().max(5000).nullable().optional(),
      attic: z.boolean().optional(),
      basement: z.boolean().optional(),
      separateDressing: z.boolean().optional(),
      underStairsStorage: z.boolean().optional(),
    }).nullable().optional(),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { draftId, property } = await readValidatedBody(event, stepEightSchema.parse);

    return await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        property: {
          update: {
            // Additional Features (required)
            additionalFeatures: {
              upsert: {
                create: {
                  description: property.additionalFeatures.description,
                  petFriendly: property.additionalFeatures.petFriendly ?? false,
                  pool: property.additionalFeatures.pool ?? false,
                  internet: property.additionalFeatures.internet ?? false,
                  concierge: property.additionalFeatures.concierge ?? false,
                  shop: property.additionalFeatures.shop ?? false,
                  gym: property.additionalFeatures.gym ?? false,
                  moveInDate: property.additionalFeatures.moveInDate ?? null,
                },
                update: {
                  description: property.additionalFeatures.description,
                  petFriendly: property.additionalFeatures.petFriendly ?? false,
                  pool: property.additionalFeatures.pool ?? false,
                  internet: property.additionalFeatures.internet ?? false,
                  concierge: property.additionalFeatures.concierge ?? false,
                  shop: property.additionalFeatures.shop ?? false,
                  gym: property.additionalFeatures.gym ?? false,
                  moveInDate: property.additionalFeatures.moveInDate ?? null,
                },
              },
            },
            // Parking (optional)
            ...(property.parking && {
              parking: {
                upsert: {
                  create: {
                    description: property.parking.description ?? null,
                    garage: property.parking.garage ?? false,
                    driveway: property.parking.driveway ?? false,
                    permitParking: property.parking.permitParking ?? false,
                    onStreet: property.parking.onStreet ?? false,
                    noParking: property.parking.noParking ?? false,
                    carport: property.parking.carport ?? false,
                    allocatedParking: property.parking.allocatedParking ?? false,
                    evCharging: property.parking.evCharging ?? false,
                  },
                  update: {
                    description: property.parking.description ?? null,
                    garage: property.parking.garage ?? false,
                    driveway: property.parking.driveway ?? false,
                    permitParking: property.parking.permitParking ?? false,
                    onStreet: property.parking.onStreet ?? false,
                    noParking: property.parking.noParking ?? false,
                    carport: property.parking.carport ?? false,
                    allocatedParking: property.parking.allocatedParking ?? false,
                    evCharging: property.parking.evCharging ?? false,
                  },
                },
              },
            }),
            // Security Features (optional)
            ...(property.securityFeatures && {
              securityFeatures: {
                upsert: {
                  create: {
                    description: property.securityFeatures.description ?? null,
                    gatedCommunity: property.securityFeatures.gatedCommunity ?? false,
                    cctv: property.securityFeatures.cctv ?? false,
                    alarmSystem: property.securityFeatures.alarmSystem ?? false,
                    neighborhoodWatch: property.securityFeatures.neighborhoodWatch ?? false,
                    intercomSystem: property.securityFeatures.intercomSystem ?? false,
                    security: property.securityFeatures.security ?? false,
                    reception: property.securityFeatures.reception ?? false,
                  },
                  update: {
                    description: property.securityFeatures.description ?? null,
                    gatedCommunity: property.securityFeatures.gatedCommunity ?? false,
                    cctv: property.securityFeatures.cctv ?? false,
                    alarmSystem: property.securityFeatures.alarmSystem ?? false,
                    neighborhoodWatch: property.securityFeatures.neighborhoodWatch ?? false,
                    intercomSystem: property.securityFeatures.intercomSystem ?? false,
                    security: property.securityFeatures.security ?? false,
                    reception: property.securityFeatures.reception ?? false,
                  },
                },
              },
            }),
            // Accessibility Features (optional)
            ...(property.accessibilityFeatures && {
              accessibilityFeatures: {
                upsert: {
                  create: {
                    description: property.accessibilityFeatures.description ?? null,
                    wheelchairFriendly: property.accessibilityFeatures.wheelchairFriendly ?? false,
                    stepFreeAccess: property.accessibilityFeatures.stepFreeAccess ?? false,
                    wideDoorways: property.accessibilityFeatures.wideDoorways ?? false,
                    wetRoom: property.accessibilityFeatures.wetRoom ?? false,
                    handrails: property.accessibilityFeatures.handrails ?? false,
                    elevator: property.accessibilityFeatures.elevator ?? false,
                    stairs: property.accessibilityFeatures.stairs ?? false,
                    accessibleParking: property.accessibilityFeatures.accessibleParking ?? false,
                  },
                  update: {
                    description: property.accessibilityFeatures.description ?? null,
                    wheelchairFriendly: property.accessibilityFeatures.wheelchairFriendly ?? false,
                    stepFreeAccess: property.accessibilityFeatures.stepFreeAccess ?? false,
                    wideDoorways: property.accessibilityFeatures.wideDoorways ?? false,
                    wetRoom: property.accessibilityFeatures.wetRoom ?? false,
                    handrails: property.accessibilityFeatures.handrails ?? false,
                    elevator: property.accessibilityFeatures.elevator ?? false,
                    stairs: property.accessibilityFeatures.stairs ?? false,
                    accessibleParking: property.accessibilityFeatures.accessibleParking ?? false,
                  },
                },
              },
            }),
            // Storage Features (optional)
            ...(property.storageFeatures && {
              storageFeatures: {
                upsert: {
                  create: {
                    description: property.storageFeatures.description ?? null,
                    attic: property.storageFeatures.attic ?? false,
                    basement: property.storageFeatures.basement ?? false,
                    separateDressing: property.storageFeatures.separateDressing ?? false,
                    underStairsStorage: property.storageFeatures.underStairsStorage ?? false,
                  },
                  update: {
                    description: property.storageFeatures.description ?? null,
                    attic: property.storageFeatures.attic ?? false,
                    basement: property.storageFeatures.basement ?? false,
                    separateDressing: property.storageFeatures.separateDressing ?? false,
                    underStairsStorage: property.storageFeatures.underStairsStorage ?? false,
                  },
                },
              },
            }),
          },
        },
      },
      include: {
        property: {
          include: {
            additionalFeatures: true,
            parking: true,
            securityFeatures: true,
            accessibilityFeatures: true,
            storageFeatures: true,
          },
        },
      },
    });
  } catch (error) {
    return errorResponse(error, event);
  }
});
