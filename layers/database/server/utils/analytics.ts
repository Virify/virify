import type { ListingType, TrackSearch } from "../database/prisma/generated/client";

export interface TrackSearchParams {
  listingType: string;
  query: string;
  location: GeocodingFeature;
  radius: number;
  resultCount: number;
  userId?: number;
}

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

  return listings.map((listing: { id: any; }) => listing.id);
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
export async function getRecentViewedListings(userId: number, limit: number = 6): Promise<RecentlyViewed[]> {
  return prisma.listingView.findMany({
    where: {
      userId,
    },
    distinct: ['listingId'],
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
 * Tracks a search with location, radius, query, results, and optional user
 * 
 * @param params Search tracking parameters
 * @returns The created or updated track record
 */
export async function trackSearch(params: TrackSearchParams): Promise<TrackSearch> {
  const { listingType, query, location, radius, resultCount, userId } = params;
  
  const listingTypeUpper = listingType.toLocaleUpperCase();
  const locationId = location.id || '';
  const locationPlaceName = location.place_name_en || location.place_name;
  const locationText = location.text;
  const [locationLon, locationLat] = location.geometry.coordinates;
  
  // Check if this search combination already exists
  const existing = await prisma.trackSearch.findUnique({
    where: {
      listingType_locationPlaceName_radius_query: {
        listingType: listingTypeUpper as ListingType,
        locationPlaceName,
        radius,
        query,
      },
    },
  });
  
  if (existing) {
    // Update existing record - increment count and add userId if not already present
    const userIds = existing.userIds;
    if (userId && !userIds.includes(userId)) {
      userIds.push(userId);
    }
    
    return prisma.trackSearch.update({
      where: { id: existing.id },
      data: {
        listingType: listingTypeUpper as ListingType,
        count: { increment: 1 }, // Increment search count
        resultCount, // Update with latest result count
        locationId, // Update locationId in case it was missing
        userIds,
      },
    });
  }
  
  // Create new record with count = 1
  return prisma.trackSearch.create({
    data: {
      listingType: listingTypeUpper as ListingType,
      locationId,
      locationPlaceName,
      locationText,
      locationLat,
      locationLon,
      radius,
      query,
      resultCount,
      count: 1,
      userIds: userId ? [userId] : [],
    },
  });
}


/**
 * Get trending searches based on unique user count
 * @param limit Maximum number of trending searches to return
 * @returns Trending searches sorted by user count
 */
export async function getTrendingSearches(limit: number = 10): Promise<TrackSearch[]> {
  const searches = await prisma.trackSearch.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: limit * 3, // Get more to sort by userIds length
  });
  
  // Sort by number of unique users and take top results
  return searches
    .sort((a, b) => b.userIds.length - a.userIds.length)
    .slice(0, limit);
}

/**
 * Get trending locations based on search count
 * Note: Caching is handled at the API endpoint level using Nitro's defineCachedEventHandler
 * @param limit Maximum number of trending locations to return
 * @returns Trending location names with search counts
 */
export async function getTrendingLocations(limit: number = 5) {
  // Get top locations with their IDs - can't use groupBy with locationId since it varies
  // So we get all searches, aggregate by locationText, and pick the best locationId for each
  const searches = await prisma.trackSearch.findMany({
    where: {
      locationId: { not: '' }, // Only include searches with valid locationId
    },
    orderBy: {
      count: 'desc',
    },
    take: 100, // Get enough to aggregate
  });
  
  // Aggregate by locationText, keeping the highest count entry for each
  const locationMap = new Map<string, typeof searches[0]>();
  for (const search of searches) {
    const key = search.locationText.toLowerCase();
    const existing = locationMap.get(key);
    if (!existing || search.count > existing.count) {
      locationMap.set(key, search);
    }
  }
  
  // Sort by count and take top N
  const sorted = Array.from(locationMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  return sorted.map(s => ({
    locationId: s.locationId, // For geocoding on frontend
    name: s.locationText,
    placeName: s.locationPlaceName,
    lat: s.locationLat,
    lon: s.locationLon,
    count: s.count,
  }));
}
