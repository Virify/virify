/**
 * Get user favourites with listing data only
 *
 * @param userId number
 * @returns list of favourite listings
 */
export async function getUserFavourites(userId: number): Promise<UserFavouriteListingCard[]> {
  return await prisma.userFavouriteListing.findMany({
    where: {
      userPreferences: {
        userId,
      },
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      userPreferencesId: true,
      listing: {
        select: listingCardFields,
      },
    },
  });
}

/**
 * Get recent favourites for a user
 * 
 * @param userId number
 * @returns UserFavouriteListingCard[]
 */
export async function getRecentFavourites(userId: number): Promise<UserFavouriteListingCard[]> {
  return await prisma.userFavouriteListing.findMany({
    where: {
      userPreferences: {
        userId,
      },
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      userPreferencesId: true,
      listing: {
        select: listingCardFields,
      },
    },
  });
}

/**
 * Add a listing to user favourites
 *
 * @param userId number
 * @param listingId number
 * @returns array of favourite listing IDs
 */
export async function updateFavouriteListing(userId: number, listingId: number): Promise<number[]> {
  const { userPreferencesId } = await prisma.userFavouriteListing.upsert({
    where: {
      userPreferencesId_listingId: {
        userPreferencesId: userId,
        listingId,
      },
    },
    create: {
      userPreferences: {
        connectOrCreate: {
          where: { userId },
          create: { userId },
        },
      },
      listing: {
        connect: { id: listingId },
      },
    },
    update: {
      userPreferences: {
        connect: { userId },
      },
      listing: {
        connect: { id: listingId },
      },
    },
    select: {
      userPreferencesId: true,
    },
  });

  const favourites = await prisma.userFavouriteListing.findMany({
    where: { userPreferencesId },
    select: { listingId: true },
  });

  return favourites.map((fav: { listingId: any; }) => fav.listingId);
}

/**
 * Remove a listing from the user's favourites
 *
 * @param userId number
 * @param listingId number
 * @returns array of remaining favourite listing IDs
 */
export async function deleteFavouriteListing(userId: number, listingId: number): Promise<{ count: number }> {
  return await prisma.userFavouriteListing.deleteMany({
    where: {
      userPreferences: {
        userId,
      },
      listingId,
    },
  });
}

/**
 * Remove all favourite listings for a user
 *
 * @param userId number
 */
export async function deleteAllFavourites(userId: number) {
  return await prisma.userFavouriteListing.deleteMany({
    where: {
      userPreferences: {
        userId,
      },
    },
  });
}
