import type { AmenityType, AmenitySubtype } from '../database/prisma/generated/enums'

export interface AmenityData {
  type: AmenityType
  subtype?: AmenitySubtype
  name: string
  distanceM: number
  description?: string | null
  location?: any
}

/**
 * Get amenities for a property
 */
export async function getAmenitiesByPropertyId(propertyId: number) {
  return await prisma.amenities.findMany({
    where: { propertyId },
    orderBy: { distanceM: 'asc' }
  })
}

/**
 * Create amenities for a property (simple approach - no transaction needed)
 */
export async function createAmenitiesForProperty(propertyId: number, amenitiesData: AmenityData[]) {
  // Update the property to create and connect the amenities
  return await prisma.property.update({
    where: { id: propertyId },
    data: {
      amenities: {
        createMany: {
          data: amenitiesData
        }
      }
    },
    include: {
      amenities: true
    }
  })
}

/**
 * Check if amenities exist for a property
 */
export async function checkAmenitiesExist(propertyId: number): Promise<boolean> {
  const count = await prisma.amenities.count({
    where: { propertyId }
  })
  return count > 0
}

/**
 * Get amenities with property info in one query
 */
export async function getAmenitiesWithProperty(propertyId: number) {
  return await prisma.amenities.findMany({
    where: { propertyId },
    orderBy: { distanceM: 'asc' },
    include: {
      property: {
        select: {
          id: true,
          listing: {
            select: { id: true }
          }
        }
      }
    }
  })
}