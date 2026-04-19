import type { ListingType, TrackSearch } from "../database/prisma/generated/client";

export interface TrackSearchParams {
  listingType: string;
  query: string;
  location: GeocodingFeature;
  radius: number;
  resultCount: number;
  userId?: number;
  usedTerms?: string[];
  ignoredTerms?: string[];
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

  return listings.map((listing: { id: any }) => listing.id);
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
 * SELLER ANALYTICS - Individual performant functions
 */

/**
 * Get total views for user's listings
 */
export async function getTotalListingViews(userId: number): Promise<number> {
  const listingIds = await getUserListingIds(userId);
  if (listingIds.length === 0) return 0;

  return await prisma.listingView.count({
    where: { listingId: { in: listingIds } },
  });
}

/**
 * Get views for user's listings in a specific date range
 */
export async function getListingViewsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<number> {
  const listingIds = await getUserListingIds(userId);
  if (listingIds.length === 0) return 0;

  return await prisma.listingView.count({
    where: {
      listingId: { in: listingIds },
      createdAt: { gte: startDate, lt: endDate },
    },
  });
}

/**
 * Get active listings count
 */
export async function getActiveListingsCount(userId: number): Promise<number> {
  return await prisma.listing.count({
    where: {
      userId,
      published: true,
      archived: false,
    },
  });
}

/**
 * Get total enquiries received on user's listings
 */
export async function getReceivedEnquiriesCount(userId: number): Promise<number> {
  return await prisma.conversation.count({
    where: { receiverId: userId },
  });
}

/**
 * BUYER/SEARCHER ANALYTICS - Individual performant functions
 */

/**
 * Get total enquiries sent by user
 */
export async function getSentEnquiriesCount(userId: number): Promise<number> {
  return await prisma.conversation.count({
    where: { senderId: userId },
  });
}

/**
 * Get sent enquiries that received replies
 */
export async function getSentEnquiriesWithRepliesCount(userId: number): Promise<number> {
  return await prisma.conversation.count({
    where: {
      senderId: userId,
      messages: {
        some: {
          senderId: { not: userId }, // Reply from someone else
        },
      },
    },
  });
}

/**
 * Get total favourites by user
 */
export async function getUserFavouritesCount(userId: number): Promise<number> {
  return await prisma.userFavouriteListing.count({
    where: {
      userPreferences: { userId },
    },
  });
}

/**
 * Get total notes by user
 */
export async function getUserNotesCount(userId: number): Promise<number> {
  return await prisma.userNote.count({
    where: {
      userPreferences: { userId },
    },
  });
}

/**
 * Get recently viewed listings count (last 30 days)
 */
export async function getRecentlyViewedCount(userId: number): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await prisma.listingView.groupBy({
    by: ["listingId"],
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  return result.length;
}

/**
 * COMPREHENSIVE ANALYTICS - Optimized single query
 * Get complete analytics summary for a user (both seller and buyer metrics)
 *
 * @param userId User ID
 * @returns Complete analytics summary
 */
export async function getUserListingAnalytics(userId: number) {
  // Get user's listing IDs first
  const listingIds = await getUserListingIds(userId);

  // Get current date and previous periods
  const now = new Date();
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const twoMonthsAgo = new Date(previousMonth);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    // Seller metrics
    totalViews,
    previousMonthViews,
    twoMonthsAgoViews,
    favoritedByOthersCount,
    totalConversations,
    totalListings,
    activeListings,
    listingsWithNotes,
    // Buyer metrics
    sentEnquiries,
    sentEnquiriesWithReplies,
    totalFavourites,
    totalNotes,
    recentlyViewedCount,
  ] = await Promise.all([
    // SELLER METRICS
    // Total views for all user's listings
    listingIds.length > 0
      ? prisma.listingView.count({
          where: { listingId: { in: listingIds } },
        })
      : Promise.resolve(0),
    // Views in the previous month
    listingIds.length > 0
      ? prisma.listingView.count({
          where: {
            listingId: { in: listingIds },
            createdAt: { gte: previousMonth, lt: now },
          },
        })
      : Promise.resolve(0),
    // Views from two months ago (for comparison)
    listingIds.length > 0
      ? prisma.listingView.count({
          where: {
            listingId: { in: listingIds },
            createdAt: { gte: twoMonthsAgo, lt: previousMonth },
          },
        })
      : Promise.resolve(0),
    // Count of user's listings favorited by others
    prisma.listing.count({
      where: {
        userId: userId,
        UserFavouriteListing: {
          some: {
            userPreferences: {
              userId: { not: userId },
            },
          },
        },
      },
    }),
    // Total conversations for user's listings (enquiries received)
    prisma.conversation.count({
      where: { receiverId: userId },
    }),
    // Total listings count
    prisma.listing.count({
      where: { userId: userId },
    }),
    // Active listings (published and not archived)
    prisma.listing.count({
      where: {
        userId: userId,
        published: true,
        archived: false,
      },
    }),
    // Listings that have notes from other users
    prisma.listing.count({
      where: {
        userId: userId,
        UserNote: {
          some: {
            userPreferences: {
              userId: { not: userId },
            },
          },
        },
      },
    }),
    // BUYER/SEARCHER METRICS
    // Total enquiries sent by user
    prisma.conversation.count({
      where: { senderId: userId },
    }),
    // Sent enquiries that received replies
    prisma.conversation.count({
      where: {
        senderId: userId,
        messages: {
          some: {
            senderId: { not: userId },
          },
        },
      },
    }),
    // Total favourites by user
    prisma.userFavouriteListing.count({
      where: {
        userPreferences: { userId },
      },
    }),
    // Total notes by user
    prisma.userNote.count({
      where: {
        userPreferences: { userId },
      },
    }),
    // Recently viewed listings (last 30 days, unique)
    prisma.listingView
      .groupBy({
        by: ["listingId"],
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      })
      .then((result) => result.length),
  ]);

  // Calculate percentage change
  let percentageChange = 0;
  if (twoMonthsAgoViews > 0) {
    percentageChange = Math.round(((previousMonthViews - twoMonthsAgoViews) / twoMonthsAgoViews) * 100);
  }

  // Calculate average views per listing
  const averageViewsPerListing = totalListings > 0 ? Math.round(totalViews / totalListings) : 0;

  return {
    // Seller analytics
    totalViews,
    previousMonthViews,
    percentageChange,
    favoritedByOthersCount,
    totalConversations,
    totalListings,
    activeListings,
    listingsWithNotes,
    averageViewsPerListing,
    // Buyer analytics
    sentEnquiries,
    sentEnquiriesWithReplies,
    totalFavourites,
    totalNotes,
    recentlyViewedCount,
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
  const view = await prisma.listingView.create({
    data: {
      listingId: typeof listingId === "string" ? parseInt(listingId) : listingId,
      userId,
      sessionId,
    },
  });

  // Clean up views older than 90 days for this user (fire-and-forget)
  if (userId) {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    prisma.listingView
      .deleteMany({
        where: {
          userId,
          createdAt: { lt: ninetyDaysAgo },
        },
      })
      .catch(() => {});
  }

  return view;
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
    distinct: ["listingId"],
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
 * Get paginated viewed listings for a user (distinct by listingId)
 * @param userId ID of the user
 * @param options Pagination, sort, and filter options
 * @returns Object with viewedListings array and total count
 */
export async function getViewedListingsPaginated(
  userId: number,
  options?: {
    skip?: number;
    take?: number;
    sort?: "newest" | "oldest" | "listing-newest" | "listing-oldest";
    filter?: "all" | "sale" | "rent";
    period?: "30" | "60" | "all";
  },
): Promise<{ viewedListings: RecentlyViewed[]; total: number }> {
  const { skip, take, sort = "newest", filter = "all", period = "30" } = options || {};

  const whereClause: any = { userId };

  // Apply date range filter
  if (period !== "all") {
    const days = parseInt(period);
    const since = new Date();
    since.setDate(since.getDate() - days);
    whereClause.createdAt = { gte: since };
  }

  if (filter === "sale") {
    whereClause.listing = { saleListing: { isNot: null } };
  } else if (filter === "rent") {
    whereClause.listing = { rentalListing: { isNot: null } };
  }

  let orderBy: any
  if (sort === "listing-newest") {
    orderBy = { listing: { publishedAt: "desc" } }
  } else if (sort === "listing-oldest") {
    orderBy = { listing: { publishedAt: "asc" } }
  } else {
    orderBy = sort === "oldest" ? { createdAt: "asc" as const } : { createdAt: "desc" as const }
  }

  // Get distinct listing IDs first for accurate total count
  const distinctIds = await prisma.listingView.findMany({
    where: whereClause,
    distinct: ["listingId"],
    select: { listingId: true },
  });

  const total = distinctIds.length;

  const viewedListings = await prisma.listingView.findMany({
    where: whereClause,
    distinct: ["listingId"],
    orderBy,
    skip,
    take,
    include: {
      listing: {
        select: listingCardFields,
      },
    },
  });

  return { viewedListings, total };
}

/**
 * Tracks a search with location, radius, query, results, and optional user
 *
 * @param params Search tracking parameters
 * @returns The created or updated track record
 */
export async function trackSearch(params: TrackSearchParams): Promise<TrackSearch> {
  const { listingType, query, location, radius, resultCount, userId, usedTerms = [], ignoredTerms = [] } = params;

  const listingTypeUpper = listingType.toLocaleUpperCase();
  const locationId = location.id || "";
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
        usedTerms,
        ignoredTerms,
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
      usedTerms,
      ignoredTerms,
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
  return searches.sort((a, b) => b.userIds.length - a.userIds.length).slice(0, limit);
}

/**
 * Get recent search queries that returned results, deduplicated by query text
 * Note: Caching is handled at the API endpoint level using Nitro's defineCachedEventHandler
 * @param limit Maximum number of unique query strings to return
 * @returns Unique query strings from recent successful searches
 */
export async function getRecentSearchQueries(limit: number = 6): Promise<string[]> {
  const searches = await prisma.trackSearch.findMany({
    where: {
      resultCount: { gt: 0 },
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      query: true,
    },
    take: limit * 4, // Fetch extra to allow deduplication
  });

  const seen = new Set<string>();
  const unique: string[] = [];

  for (const { query } of searches) {
    const normalised = query.trim().toLowerCase();
    if (!seen.has(normalised)) {
      seen.add(normalised);
      unique.push(query.trim());
    }
    if (unique.length >= limit) break;
  }

  return unique;
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
      locationId: { not: "" }, // Only include searches with valid locationId
    },
    orderBy: {
      count: "desc",
    },
    take: 100, // Get enough to aggregate
  });

  // Aggregate by locationText, keeping the highest count entry for each
  const locationMap = new Map<string, (typeof searches)[0]>();
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

  return sorted.map((s) => ({
    locationId: s.locationId, // For geocoding on frontend
    name: s.locationText,
    placeName: s.locationPlaceName,
    lat: s.locationLat,
    lon: s.locationLon,
    count: s.count,
  }));
}
