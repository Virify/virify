import type { Fullproperty } from "~~/shared/types/property";
import type { Property } from "../database/prisma/generated/client";
import type { PropertyInclude } from "../database/prisma/generated/models";

export const propertyInclude: PropertyInclude = {
  address: true,
  media: true,
  type: true,
  classification: true,
  bedroomFeatures: true,
  bathroomFeatures: true,
  parking: true,
  amenities: true,
  additionalFeatures: true,
  accessibilityFeatures: true,
  kitchenFeatures: true,
  reception: true,
  utility: true,
  outdoorSpace: true,
  energyAndUtilities: true,
  securityFeatures: true,
  storageFeatures: true,
  runningCosts: true,
};

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
