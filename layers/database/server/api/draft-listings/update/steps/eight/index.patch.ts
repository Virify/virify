import * as z from "zod";
import { BuildingFeature, ParkingFeature, SecurityFeature, AccessibilityFeature, StorageFeature, UtilityFeature } from "~~/layers/database/server/database/prisma/generated/enums";

// Validate payload for Step Eight - Property Features
const stepEightSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    additionalFeatures: z
      .object({
        description: z.string().max(5000).nullable().optional(),
        petFriendly: z.boolean().optional(),
        features: z.array(z.enum(Object.values(BuildingFeature) as [string, ...string[]])).optional(),
        moveInDate: z.coerce.date().nullable().optional(),
      })
      .nullable()
      .optional(),
    parking: z
      .object({
        description: z.string().max(5000).nullable().optional(),
        features: z.array(z.enum(Object.values(ParkingFeature) as [string, ...string[]])).optional(),
      })
      .nullable()
      .optional(),
    securityFeatures: z
      .object({
        description: z.string().max(5000).nullable().optional(),
        features: z.array(z.enum(Object.values(SecurityFeature) as [string, ...string[]])).optional(),
      })
      .nullable()
      .optional(),
    accessibilityFeatures: z
      .object({
        description: z.string().max(5000).nullable().optional(),
        features: z.array(z.enum(Object.values(AccessibilityFeature) as [string, ...string[]])).optional(),
      })
      .nullable()
      .optional(),
    storageFeatures: z
      .object({
        description: z.string().max(5000).nullable().optional(),
        features: z.array(z.enum(Object.values(StorageFeature) as [string, ...string[]])).optional(),
      })
      .nullable()
      .optional(),
    utility: z
      .object({
        description: z.string().max(5000).nullable().optional(),
        features: z.array(z.enum(Object.values(UtilityFeature) as [string, ...string[]])).optional(),
        size: z.coerce.number().min(0).nullable().optional(),
      })
      .nullable()
      .optional(),
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
            ...(property.additionalFeatures && {
              additionalFeatures: {
                upsert: {
                  create: {
                    description: property.additionalFeatures.description ?? null,
                    petFriendly: property.additionalFeatures.petFriendly ?? false,
                    features: property.additionalFeatures.features as BuildingFeature[] ?? [],
                    moveInDate: property.additionalFeatures.moveInDate ?? null,
                  },
                  update: {
                    description: property.additionalFeatures.description ?? null,
                    petFriendly: property.additionalFeatures.petFriendly ?? false,
                    features: property.additionalFeatures.features as BuildingFeature[] ?? [],
                    moveInDate: property.additionalFeatures.moveInDate ?? null,
                  },
                },
              },
            }),
            // Parking (optional)
            ...(property.parking && {
              parking: {
                upsert: {
                  create: {
                    description: property.parking.description ?? null,
                    features: property.parking.features as ParkingFeature[] ?? [],
                  },
                  update: {
                    description: property.parking.description ?? null,
                    features: property.parking.features as ParkingFeature[] ?? [],
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
                    features: property.securityFeatures.features as SecurityFeature[] ?? [],
                  },
                  update: {
                    description: property.securityFeatures.description ?? null,
                    features: property.securityFeatures.features as SecurityFeature[] ?? [],
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
                    features: property.accessibilityFeatures.features as AccessibilityFeature[] ?? [],
                  },
                  update: {
                    description: property.accessibilityFeatures.description ?? null,
                    features: property.accessibilityFeatures.features as AccessibilityFeature[] ?? [],
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
                    features: property.storageFeatures.features as StorageFeature[] ?? [],
                  },
                  update: {
                    description: property.storageFeatures.description ?? null,
                    features: property.storageFeatures.features as StorageFeature[] ?? [],
                  },
                },
              },
            }),
            // Utility Room (optional)
            ...(property.utility && {
              utility: {
                upsert: {
                  create: {
                    description: property.utility.description ?? null,
                    features: property.utility.features as UtilityFeature[] ?? [],
                    size: property.utility.size ?? null,
                  },
                  update: {
                    description: property.utility.description ?? null,
                    features: property.utility.features as UtilityFeature[] ?? [],
                    size: property.utility.size ?? null,
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
            utility: true,
          },
        },
      },
    });
  } catch (error) {
    return errorResponse(error, event);
  }
});
