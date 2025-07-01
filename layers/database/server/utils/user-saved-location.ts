import type { UserLocation } from "@prisma/client";

/**
 * Get user saved locations
 * @param userId - The ID of the user
 * @returns A promise that resolves to an array of user saved locations
 */
export function getUserSavedLocations(userId: number): Promise<UserLocation[]> {
  return prisma.userLocation.findMany({
    where: {
      userPreferences: {
        userId: userId,
      },
    },
  });
}

/**
 * Get a user saved location by ID
 *
 * @param userId - The ID of the user
 * @param id - The ID of the location
 * @returns A promise that resolves to the user saved location
 */
export function getUserLocation(userId: number, location: string): Promise<UserLocation | null> {
  return prisma.userLocation.findFirst({
    where: {
      userPreferences: {
        userId: userId,
      },
      location: {
        equals: location,
        mode: "insensitive",
      },
    },
  });
}

/**
 * Create or update a user saved location
 *
 * @param userId - The ID of the user
 * @param id - The ID of the location
 * @param locationData - The data for the location
 * @returns A promise that resolves to the created or updated location
 */
export function updateUserSavedLocation(
  id: number | undefined,
  userId: number,
  locationData: {
    name: string;
    geocodingFeature: GeocodingFeature;
    lat: number;
    lon: number;
    location: string;
  }
): Promise<UserLocation> {
  if (id) {
    return prisma.userLocation.upsert({
      where: { id },
      create: { userPreferences: { connectOrCreate: { where: { userId: userId }, create: { userId: userId } } }, ...locationData },
      update: { ...locationData },
    });
  } else {
    return prisma.userLocation.create({
      data: {
        userPreferences: {
          connectOrCreate: { where: { userId: userId }, create: { userId: userId } },
        },
        ...locationData,
      },
    });
  }
}

/**
 * Deletes a user saved location from the database
 * 
 * @param id - The ID of the user saved location to delete
 * @param userId - The ID of the user
 * @returns A promise that resolves to the deleted user saved location
 */
export function deleteUserSavedLocation(id: number, userId: number): Promise<UserLocation> {
  return prisma.userLocation.delete({
    where: {
      id: id,
      userPreferences: {
        userId: userId,
      },
    },
  });
}
