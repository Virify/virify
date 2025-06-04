/**
 * Get the counts of various account items for a user.
 *
 * @param userId - The ID of the user for whom to get account counts
 * @returns AccountCounts - An object containing counts of various account items
 */
export async function getAccountCounts(userId: number): Promise<AccountCounts> {
  const [enquiries, listings, favourites, notes] = await prisma.$transaction([
    prisma.conversation.count({
      where: {
        receiverId: userId,
      },
    }),
    prisma.listing.count({
      where: {
        userId: userId,
      },
    }),
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
  ]);

  return {
    enquiries,
    listings,
    favourites,
    notes,
  };
}
