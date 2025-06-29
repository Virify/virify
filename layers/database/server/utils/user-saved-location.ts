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