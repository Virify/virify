import type { Fullproperty } from "~~/shared/types/property";
import type { Property } from "../database/prisma/generated/client";

export const propertyInclude = {
  address: true,
  media: true,
  type: true,
  classification: true,
  bedroomFeatures: {
    include: {
      media: true,
    },
  },
  bathroomFeatures: {
    include: {
      media: true,
    },
  },
  otherRoom: {
    include: {
      media: true,
    },
  },
  parking: true,
  amenities: true,
  additionalFeatures: true,
  accessibilityFeatures: true,
  kitchenFeatures: {
    include: {
      media: true,
    },
  },
  reception: {
    include: {
      media: true,
    },
  },
  utility: true,
  outdoorSpace: {
    include: {
      garden: {
        include: {
          media: true,
        },
      },
      land: {
        include: {
          media: true,
        },
      },
      yard: {
        include: {
          media: true,
        },
      },
      media: true,
    },
  },
  energyAndUtilities: true,
  securityFeatures: true,
  storageFeatures: true,
  runningCosts: true,
} as const;

/**
 * Get a property by ID
 *
 * @param id number
 * @returns Property
 */
export async function getPropertyById(id: number): Promise<Property | null> {
  return await prisma.property.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Get a full property by ID
 *
 * @param id number
 * @returns Property
 */
export async function getFullPropertyById(id: number): Promise<Fullproperty | null> {
  return await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      ...propertyInclude
    },
  });
}
