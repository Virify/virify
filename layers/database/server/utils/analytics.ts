import type { TrackSearch } from "@prisma/client";

/**
 * Get actual analytics aggregates for business intelligence
 * This returns real analytics data, not user notification counts
 *
 * @param userId - The ID of the user for whom to get analytics aggregates
 * @returns AnalyticsAggregates - An object containing business analytics metrics
 */
export async function getAnalyticsAggregates(userId: number): Promise<AnalyticsAggregates> {
  // TODO: Implement actual analytics queries
  // This should return business intelligence metrics, not user notification counts
  
  const [totalListings, totalEnquiries] = await prisma.$transaction([
    prisma.listing.count({
      where: {
        userId: userId,
      },
    }),
    prisma.conversation.count({
      where: {
        receiverId: userId,
      },
    }),
  ]);

  return {
    // Business metrics
    totalListings,
    totalEnquiries,
    
    // TODO: Implement these analytics when available
    totalPageViews: 0,
    uniqueVisitors: 0,
    averageSessionDuration: 0,
    activeListings: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalSearches: 0,
    conversionRate: 0,
    newUsersThisMonth: 0,
    newListingsThisMonth: 0,
  };
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
  // Get user's listing IDs first
  const listingIds = await getUserListingIds(userId);

  if (listingIds.length === 0) {
    return {
      totalViews: 0,
      previousMonthViews: 0,
      percentageChange: 0,
      favoritedByOthersCount: 0,
      totalConversations: 0,
    };
  }

  // Get current date and previous periods
  const now = new Date();

  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const twoMonthsAgo = new Date(previousMonth);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);

  const [
    totalViews,
    previousMonthViews,
    twoMonthsAgoViews,
    favoritedByOthersCount,
    totalConversations
  ] = await prisma.$transaction([
    // Total views for all user's listings
    prisma.listingView.count({
      where: {
        listingId: {
          in: listingIds,
        },
      },
    }),
    // Views in the previous month
    prisma.listingView.count({
      where: {
        listingId: {
          in: listingIds,
        },
        createdAt: {
          gte: previousMonth,
          lt: now,
        },
      },
    }),
    // Views from two months ago (for comparison)
    prisma.listingView.count({
      where: {
        listingId: {
          in: listingIds,
        },
        createdAt: {
          gte: twoMonthsAgo,
          lt: previousMonth,
        },
      },
    }),
    // Count of user's listings favorited by others
    prisma.listing.count({
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
    }),
    // Total conversations for user's listings
    prisma.conversation.count({
      where: {
        listing: {
          id: {
            in: listingIds,
          },
        },
      },
    }),
  ]);

  // Calculate percentage change
  let percentageChange = 0;
  if (twoMonthsAgoViews > 0) {
    percentageChange = Math.round(((previousMonthViews - twoMonthsAgoViews) / twoMonthsAgoViews) * 100);
  }

  return {
    totalViews,
    previousMonthViews,
    percentageChange,
    favoritedByOthersCount,
    totalConversations,
  };
}

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
 * Get recently viewed listings for a user
 * @param userId ID of the user to get recent viewed listings for
 * @param limit Maximum number of listings to return
 * @returns Array of recently viewed listings
 */
export async function getRecentViewedListings(userId: number, limit: number = 5) {
  return prisma.listingView.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      listing: {
        select: listingCardFields,
      },
    },
  });
}

/**
 * Tracks an AI search event
 * @param aiQuery The AI search query string
 * @param userId The ID of the user performing the search
 * @param location The location data associated with the search
 * @returns The created TrackSearch record
 */
export async function trackAiSearch(aiQuery: string, location: GeocodingFeature) {
  return prisma.trackSearch.upsert({
    where: {
      aiQuery_location: {
        aiQuery,
        location: location,
      },
    },
    create: {
      aiQuery,
      location: location,
      name: location.text,
      count: 1,
    },
    update: {
      count: {
        increment: 1,
      },
    },
  });
}

/**
 * Get trending AI searches based on the number of times they have been performed
 * @param limit Maximum number of trending AI searches to return
 * @returns 
 */
export async function getTrendingAiSearches(limit: number = 5): Promise<TrackSearch[]> {
  return prisma.trackSearch.findMany({
    orderBy: {
      count: "desc",
    },
    take: limit,
  });
}
