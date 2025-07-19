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
 * Create or update amenities for a property (replaces existing ones)
 */
export async function createAmenitiesForProperty(propertyId: number, amenitiesData: AmenityData[]) {
  // Use transaction to ensure atomicity
  return await prisma.$transaction(async (tx: any) => {
    // Delete existing amenities for this property
    await tx.amenities.deleteMany({
      where: { propertyId }
    })

    // Create new amenities
    const createdAmenities = await Promise.all(
      amenitiesData.map(amenity => 
        tx.amenities.create({
          data: {
            ...amenity,
            propertyId
          }
        })
      )
    )

    return createdAmenities
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