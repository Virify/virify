/**
 * Records a view of a listing in the database
 *
 * @param listingId ID of the listing being viewed
 * @param userId Optional ID of the user viewing the listing
 * @param sessionId Optional session ID for tracking unique views
 * @returns The created ListingView record
 */
export async function recordListingView(listingId: number | string, userId?: number | null, sessionId?: string | null) {
  return prisma.listingView.create({
    data: {
      listingId: typeof listingId === "string" ? parseInt(listingId) : listingId,
      userId,
      sessionId,
    },
  });
}

/**
 * Get total views for a list of listings
 *
 * @param listingIds Array of listing IDs
 * @returns The total number of views
 */
export async function getListingViewsCount(listingIds: number[]) {
  return prisma.listingView.count({
    where: {
      listingId: {
        in: listingIds,
      },
    },
  });
}

/**
 * Get views for a list of listings in a specific date range
 *
 * @param listingIds Array of listing IDs
 * @param startDate Start date for the range
 * @param endDate End date for the range
 * @returns The number of views in the given date range
 */
export async function getListingViewsInDateRange(listingIds: number[], startDate: Date, endDate: Date) {
  return prisma.listingView.count({
    where: {
      listingId: {
        in: listingIds,
      },
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });
}

/**
 * Get listings owned by a specific user
 *
 * @param userId User ID
 * @returns Array of listing IDs owned by the user
 */
export async function getUserListingIds(userId: number) {
  const listings = await prisma.listing.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  return listings.map((listing) => listing.id);
}

/**
 * Get the count of the user's listings that have been favorited by other users
 *
 * @param userId User ID of the listing owner
 * @returns The number of the user's listings that have been favorited by others
 */
export async function getListingsFavoritedByOthersCount(userId: number) {
  const favoritedListingsCount = await prisma.listing.count({
    where: {
      userId: userId,
      UserFavouriteListing: {
        some: {
          userPreferences: {
            userId: {
              not: userId,
            },
          },
        },
      },
    },
  });

  return favoritedListingsCount;
}

/**
 * Get analytics summary for a user's listings
 *
 * @param userId User ID
 * @returns Summary of view counts and percentage change
 */
export async function getUserListingAnalytics(userId: number) {
  // Get user's listing IDs
  const listingIds = await getUserListingIds(userId);

  if (listingIds.length === 0) {
    return {
      totalViews: 0,
      previousMonthViews: 0,
      percentageChange: 0,
    };
  }

  // Get current date and previous periods
  const now = new Date();

  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const twoMonthsAgo = new Date(previousMonth);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);

  // Get total views
  const totalViews = await getListingViewsCount(listingIds);

  // Get previous month views
  const previousMonthViews = await getListingViewsInDateRange(listingIds, previousMonth, now);

  // Get views from the month before that for comparison
  const twoMonthsAgoViews = await getListingViewsInDateRange(listingIds, twoMonthsAgo, previousMonth);

  // Calculate percentage change
  let percentageChange = 0;
  if (twoMonthsAgoViews > 0) {
    percentageChange = Math.round(((previousMonthViews - twoMonthsAgoViews) / twoMonthsAgoViews) * 100);
  }

  const favoritedByOthersCount = await getListingsFavoritedByOthersCount(userId);

  const totalConversations = await prisma.conversation.count({
    where: {
      listing: {
        id: {
          in: listingIds,
        },
      },
    },
  });

  return {
    totalViews,
    previousMonthViews,
    percentageChange,
    favoritedByOthersCount,
    totalConversations,
  };
}
