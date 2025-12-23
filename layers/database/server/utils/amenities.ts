import { Prisma } from "../database/prisma/generated/client";
import { AmenitiesCreateWithoutPropertyInput } from "../database/prisma/generated/models/Amenities";
/**
 * Get amenities for a property
 */
export async function getAmenitiesByPropertyId(propertyId: number) {
  return await prisma.amenities.findMany({
    where: { propertyId },
    orderBy: { distanceM: "asc" },
  });
}

/**
 * Create amenities for a property (simple approach - no transaction needed)
 */
export async function createAmenitiesForProperty(propertyId: number, amenitiesData: AmenitiesCreateWithoutPropertyInput[]): Promise<Prisma.PropertyGetPayload<{
  include: {
    amenities: true;
  };
}>> {
  return await prisma.property.update({
    where: { id: propertyId },
    data: {
      amenities: {
        deleteMany: {},
        create: amenitiesData,
      },
    },
    include: {
      amenities: true,
    },
  });
}

/**
 * Remove all amenities for a property
 * @param propertyId
 */
export async function deleteAmenitiesByPropertyId(propertyId: number): Promise<void> {
  await prisma.amenities.deleteMany({
    where: { propertyId },
  });
}

/**
 * Check if amenities exist for a property
 */
export async function checkAmenitiesExist(propertyId: number): Promise<boolean> {
  const count = await prisma.amenities.count({
    where: { propertyId },
  });
  return count > 0;
}

/**
 * Get amenities with property info in one query
 */
export async function getAmenitiesWithProperty(propertyId: number) {
  return await prisma.amenities.findMany({
    where: { propertyId },
    orderBy: { distanceM: "asc" },
    include: {
      property: {
        select: {
          id: true,
          listing: {
            select: { id: true },
          },
        },
      },
    },
  });
}
