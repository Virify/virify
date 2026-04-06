/**
 * GET /api/analytics/quick
 * 
 * Quick/lightweight analytics for dashboard homepage
 * Returns minimal data for fast loading - no time-series, just current totals
 * 
 * Uses pre-aggregated DailyUserStats for performance
 * Cached per-user for 30 seconds to shield simultaneous dashboard mounts.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const cacheKey = `analytics:quick:${user.id}`;
  const storage = useStorage('cache');
  const cached = await storage.getItem(cacheKey);
  if (cached) return cached;

  try {
    // Get user's listing IDs for filtered queries
    const userListings = await prisma.listing.findMany({
      where: { userId: user.id },
      select: { id: true },
    });
    const listingIds = userListings.map(l => l.id);

    // Get last 7 days of pre-aggregated stats (fast!)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      // Quick counts
      activeListings,
      totalEnquiriesReceived,
      totalEnquiriesSent,
      // Last 7 days from pre-aggregated table
      recentDailyStats,
      // Favourites on user's listings
      favouritesReceived,
    ] = await Promise.all([
      // Active listings count
      prisma.listing.count({
        where: {
          userId: user.id,
          published: true,
          archived: false,
        },
      }),
      // Enquiries received
      prisma.conversation.count({
        where: { receiverId: user.id },
      }),
      // Enquiries sent
      prisma.conversation.count({
        where: { senderId: user.id },
      }),
      // Pre-aggregated daily stats (much faster than raw queries)
      listingIds.length > 0
        ? prisma.dailyListingStats.aggregate({
            where: {
              listingId: { in: listingIds },
              date: { gte: sevenDaysAgo },
            },
            _sum: {
              views: true,
              impressions: true,
              clicks: true,
              favourites: true,
              enquiries: true,
            },
          })
        : Promise.resolve({ _sum: { views: 0, impressions: 0, clicks: 0, favourites: 0, enquiries: 0 } }),
      // Favourites on user's listings
      prisma.userFavouriteListing.count({
        where: {
          listing: { userId: user.id },
        },
      }),
    ]);

    const stats = recentDailyStats._sum;

    const result = {
      // Counts
      activeListings,
      totalEnquiriesReceived,
      totalEnquiriesSent,
      favouritesReceived,
      // Last 7 days aggregated
      last7Days: {
        views: stats.views ?? 0,
        impressions: stats.impressions ?? 0,
        clicks: stats.clicks ?? 0,
        ctr: stats.impressions ? Math.round(((stats.clicks ?? 0) / stats.impressions) * 100) : 0,
      },
    };

    storage.setItem(cacheKey, result, { ttl: 30 }).catch(() => {});
    return result;
  } catch (error) {
    console.error("Quick analytics error:", error);
    throw createError({ statusCode: 500, message: "Failed to fetch quick analytics" });
  }
});
