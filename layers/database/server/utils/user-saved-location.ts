/**
 * Get user saved locations
 * @param userId - The ID of the user
 * @returns A promise that resolves to an array of user saved locations
 */
export function getUserSavedLocations(userId: number) {
  return prisma.userLocation.findMany({
    where: {
      userPreferences: {
        userId: userId,
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
export function createUserSavedLocation(
  userId: number,
  locationData: {
    name: string;
    geocodingFeature: GeocodingFeature;
    lat: number;
    lon: number;
    location: string;
  }
) {
  return prisma.userLocation.create({
    data: {
      userPreferencesId: userId,
      ...locationData,
    },
  });
}
