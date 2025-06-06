/**
 * Get user item counts for notification purposes
 * These are the counts displayed in navigation badges
 *
 * @param userId - The ID of the user for whom to get item counts
 * @returns UserItemsAggregates - An object containing notification counts
 */
export async function getUserItemsAggregates(userId: number): Promise<UserItemsAggregates> {
  const [favourites, notes, enquiries] = await prisma.$transaction([
    prisma.userFavouriteListing.count({
      where: {
        userPreferences: {
          userId: userId,
        },
      },
    }),
    prisma.userNote.count({
      where: {
        userPreferences: {
          userId: userId,
        },
      },
    }),
    prisma.conversation.count({
      where: {
        receiverId: userId,
      },
    }),
  ]);

  return {
    favourites,
    notes,
    enquiries,
    // Include all the original ones even if not used yet
    notifications: 0,
    messages: 0,
    offers: 0,
    viewings: 0,
  };
}
