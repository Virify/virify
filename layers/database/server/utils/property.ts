import type { Fullproperty } from "~~/shared/types/property";
import type { Property } from "../database/prisma/generated/client";

export const propertyInclude = {
  address: true,
  media: {
    orderBy: { sortOrder: 'asc' as const },
  },
  type: true,
  classification: true,
  bedroomFeatures: {
    include: {
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
  bathroomFeatures: {
    include: {
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
  otherRoom: {
    include: {
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
  parking: true,
  amenities: true,
  additionalFeatures: true,
  accessibilityFeatures: true,
  kitchenFeatures: {
    include: {
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
  reception: {
    include: {
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
  utility: true,
  outdoorSpace: {
    include: {
      yard: {
        include: {
          media: {
            orderBy: { sortOrder: 'asc' as const },
          },
        },
      },
      garden: {
        include: {
          media: {
            orderBy: { sortOrder: 'asc' as const },
          },
        },
      },
      land: {
        include: {
          media: {
            orderBy: { sortOrder: 'asc' as const },
          },
        },
      },
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
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
