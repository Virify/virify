import { z } from "zod";
import { step7Schema } from "~~/shared/utils/listing-step7-schema";
import {
  ParkingFeature,
  AccessibilityFeature,
  SecurityFeature,
  StorageFeature,
  UtilityFeature,
  BuildingFeature,
} from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Step 7: Additional Features API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 * Handles: Parking, Accessibility, Security, Storage, Utility room, Building/Additional features
 */

const stepDataSchema = step7Schema.extend({
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

    const { parking, accessibilityFeatures, securityFeatures, storageFeatures, utility, additionalFeatures } = property;

    const propertyUpdate = {
      // Parking
      parking: parking ? {
        upsert: {
          create: {
            description: parking.description ?? null,
            features: parking.features as ParkingFeature[] ?? [],
          },
          update: {
            description: parking.description ?? null,
            features: parking.features as ParkingFeature[] ?? [],
          },
        },
      } : undefined,
      
      // Accessibility
      accessibilityFeatures: accessibilityFeatures ? {
        upsert: {
          create: {
            description: accessibilityFeatures.description ?? null,
            features: accessibilityFeatures.features as AccessibilityFeature[] ?? [],
          },
          update: {
            description: accessibilityFeatures.description ?? null,
            features: accessibilityFeatures.features as AccessibilityFeature[] ?? [],
          },
        },
      } : undefined,
      
      // Security
      securityFeatures: securityFeatures ? {
        upsert: {
          create: {
            description: securityFeatures.description ?? null,
            features: securityFeatures.features as SecurityFeature[] ?? [],
          },
          update: {
            description: securityFeatures.description ?? null,
            features: securityFeatures.features as SecurityFeature[] ?? [],
          },
        },
      } : undefined,
      
      // Storage
      storageFeatures: storageFeatures ? {
        upsert: {
          create: {
            description: storageFeatures.description ?? null,
            features: storageFeatures.features as StorageFeature[] ?? [],
          },
          update: {
            description: storageFeatures.description ?? null,
            features: storageFeatures.features as StorageFeature[] ?? [],
          },
        },
      } : undefined,
      
      // Utility room
      utility: utility ? {
        upsert: {
          create: {
            description: utility.description ?? null,
            features: utility.features as UtilityFeature[] ?? [],
            size: utility.size ?? null,
          },
          update: {
            description: utility.description ?? null,
            features: utility.features as UtilityFeature[] ?? [],
            size: utility.size ?? null,
          },
        },
      } : undefined,
      
      // Additional/Building features
      additionalFeatures: additionalFeatures ? {
        upsert: {
          create: {
            description: additionalFeatures.description ?? null,
            petFriendly: additionalFeatures.petFriendly ?? true,
            moveInDate: additionalFeatures.moveInDate ?? null,
            features: additionalFeatures.features as BuildingFeature[] ?? [],
          },
          update: {
            description: additionalFeatures.description ?? null,
            petFriendly: additionalFeatures.petFriendly ?? true,
            moveInDate: additionalFeatures.moveInDate ?? null,
            features: additionalFeatures.features as BuildingFeature[] ?? [],
          },
        },
      } : undefined,
    };

    // LIVE LISTING - update Listing table
    if (listingId) {
      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: { property: { update: propertyUpdate } },
        include: {
          property: {
            include: {
              parking: true,
              accessibilityFeatures: true,
              securityFeatures: true,
              storageFeatures: true,
              utility: true,
              additionalFeatures: true,
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

    const result = await prisma.draftListing.update({
      where: { id: draftId!, userId: user.id },
      data: {
        // Add step 7 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(7) ? { completedSteps: { push: 7 } } : {}),
        property: { update: propertyUpdate },
      },
      include: {
        property: {
          include: {
            parking: true,
            accessibilityFeatures: true,
            securityFeatures: true,
            storageFeatures: true,
            utility: true,
            additionalFeatures: true,
          },
        },
      },
    });

    await invalidateDraftListingsCache(user.id as number);
    return result;
  } catch (error) {
    console.log("Error updating draft listing step seven:", error);
    return errorResponse(error, event);
  }
});
