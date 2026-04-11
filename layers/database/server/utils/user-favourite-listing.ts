/**
 * Get user favourite lookups (listing IDs only)
 * Used for checking if a listing is favourited without fetching full data
 * 
 * @param userId number
 * @returns Array of favourite listing IDs
 */
export async function getUserFavouriteLookups(userId: number): Promise<number[]> {
  const favourites = await prisma.userFavouriteListing.findMany({
    where: {
      userPreferences: {
        userId,
      },
    },
    select: {
      listingId: true,
    },
  });
  return favourites.map(f => f.listingId);
}

/**
 * Get user favourites with listing data only
 *
 * @param userId number
 * @param options - Pagination, sorting and filtering options
 * @returns list of favourite listings with total count
 */
export async function getUserFavourites(
  userId: number,
  options?: {
    skip?: number;
    take?: number;
    sort?: "newest" | "oldest" | "listing-newest" | "listing-oldest";
    filter?: "all" | "sale" | "rent";
  }
): Promise<{ favourites: UserFavouriteListingCard[], total: number }> {
  const { skip, take, sort = "newest", filter = "all" } = options || {};

  const whereClause: any = {
    userPreferences: {
      userId,
    },
  };

  // Add filter logic
  if (filter === "sale") {
    whereClause.listing = {
      saleListing: { isNot: null }
    };
  } else if (filter === "rent") {
    whereClause.listing = {
      rentalListing: { isNot: null }
    };
  }

  let orderBy: any
  if (sort === "listing-newest") {
    orderBy = { listing: { publishedAt: "desc" } }
  } else if (sort === "listing-oldest") {
    orderBy = { listing: { publishedAt: "asc" } }
  } else {
    orderBy = sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" }
  }

  const [favourites, total] = await Promise.all([
    prisma.userFavouriteListing.findMany({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        userPreferencesId: true,
        listing: {
          select: listingCardFields,
        },
      },
      skip,
      take,
      orderBy: orderBy as any,
    }),
    prisma.userFavouriteListing.count({
      where: whereClause,
    }),
  ]);

  return { favourites, total };
}

/**
 * Get recent favourites for a user (last 7 days)
 * Used for dashboard homepage recent favourites section
 * 
 * @param userId number
 * @param limit Maximum number of items to return (default 8)
 * @returns UserFavouriteListingCard[]
 */
export async function getRecentFavourites(userId: number, limit: number = 8): Promise<UserFavouriteListingCard[]> {
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
    take: limit,
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
