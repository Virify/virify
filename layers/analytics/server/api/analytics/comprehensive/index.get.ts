/**
 * GET /api/analytics/comprehensive
 * 
 * Full analytics data for dedicated analytics page
 * Includes time-series data for graphs, per-listing breakdowns, traffic sources
 * 
 * Query params:
 * - period: '7d' | '30d' | '90d' (default: '30d')
 * - listingId: number (optional, filter to specific listing)
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const query = getQuery(event);
  const period = (query.period as string) || '30d';
  const listingIdFilter = query.listingId ? Number(query.listingId) : undefined;

  // Calculate date range
  const now = new Date();
  const startDate = new Date();
  switch (period) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    default: // 30d
      startDate.setDate(now.getDate() - 30);
  }
  startDate.setHours(0, 0, 0, 0);

  // Previous period for comparison
  const previousStart = new Date(startDate);
  const periodDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  previousStart.setDate(previousStart.getDate() - periodDays);

  try {
    // Get user's listings
    const userListings = await prisma.listing.findMany({
      where: { 
        userId: user.id,
        ...(listingIdFilter ? { id: listingIdFilter } : {}),
      },
      select: { 
        id: true,
        price: true,
        listingTier: true,
        published: true,
        archived: true,
        createdAt: true,
        property: {
          select: {
            address: {
              select: { street: true, city: true, postcode: true },
            },
            numberBedrooms: true,
            media: {
              select: { image: true },
              take: 1,
            },
          },
        },
      },
    });
    
    const listingIds = userListings.map(l => l.id);
    
    if (listingIds.length === 0) {
      return {
        summary: getEmptySummary(),
        timeSeries: [],
        topListings: [],
        trafficSources: [],
        deviceBreakdown: [],
        listings: [],
      };
    }

    const [
      // Time series data (daily stats)
      dailyStats,
      previousPeriodStats,
      // Traffic sources from ListingView
      trafficSources,
      // Device breakdown from userAgent
      deviceStats,
      // Per-listing performance
      listingPerformance,
      // Total counts
      totalViews,
      totalImpressions,
      totalFavourites,
      totalEnquiries,
    ] = await Promise.all([
      // Daily stats for time series graph
      prisma.dailyListingStats.findMany({
        where: {
          listingId: { in: listingIds },
          date: { gte: startDate },
        },
        orderBy: { date: 'asc' },
      }),
      // Previous period for comparison
      prisma.dailyListingStats.aggregate({
        where: {
          listingId: { in: listingIds },
          date: { gte: previousStart, lt: startDate },
        },
        _sum: {
          views: true,
          impressions: true,
          clicks: true,
          favourites: true,
          enquiries: true,
        },
      }),
      // Traffic sources
      prisma.listingView.groupBy({
        by: ['source'],
        where: {
          listingId: { in: listingIds },
          createdAt: { gte: startDate },
          source: { not: null },
        },
        _count: true,
      }),
      // Device breakdown (parse userAgent)
      prisma.listingView.findMany({
        where: {
          listingId: { in: listingIds },
          createdAt: { gte: startDate },
          userAgent: { not: null },
        },
        select: { userAgent: true },
      }),
      // Per-listing aggregated stats
      prisma.dailyListingStats.groupBy({
        by: ['listingId'],
        where: {
          listingId: { in: listingIds },
          date: { gte: startDate },
        },
        _sum: {
          views: true,
          impressions: true,
          clicks: true,
          favourites: true,
          enquiries: true,
        },
        _avg: {
          avgDuration: true,
        },
      }),
      // Totals for current period
      prisma.listingView.count({
        where: {
          listingId: { in: listingIds },
          createdAt: { gte: startDate },
        },
      }),
      prisma.listingImpression.count({
        where: {
          listingId: { in: listingIds },
          createdAt: { gte: startDate },
        },
      }),
      prisma.userFavouriteListing.count({
        where: {
          listing: { userId: user.id },
          createdAt: { gte: startDate },
        },
      }),
      prisma.conversation.count({
        where: {
          receiverId: user.id,
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Aggregate daily stats by date for time series
    const timeSeriesMap = new Map<string, {
      date: string;
      views: number;
      impressions: number;
      clicks: number;
      favourites: number;
      enquiries: number;
    }>();

    dailyStats.forEach(stat => {
      const dateKey = stat.date.toISOString().split('T')[0];
      const existing = timeSeriesMap.get(dateKey) || {
        date: dateKey,
        views: 0,
        impressions: 0,
        clicks: 0,
        favourites: 0,
        enquiries: 0,
      };
      existing.views += stat.views;
      existing.impressions += stat.impressions;
      existing.clicks += stat.clicks;
      existing.favourites += stat.favourites;
      existing.enquiries += stat.enquiries;
      timeSeriesMap.set(dateKey, existing);
    });

    const timeSeries = Array.from(timeSeriesMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Parse device breakdown
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
    deviceStats.forEach(({ userAgent }) => {
      if (!userAgent) return;
      const ua = userAgent.toLowerCase();
      if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        if (ua.includes('ipad') || ua.includes('tablet')) {
          deviceCounts.tablet++;
        } else {
          deviceCounts.mobile++;
        }
      } else {
        deviceCounts.desktop++;
      }
    });

    const totalDevices = deviceCounts.desktop + deviceCounts.mobile + deviceCounts.tablet;
    const deviceBreakdown = totalDevices > 0 ? [
      { device: 'Desktop', count: deviceCounts.desktop, percentage: Math.round((deviceCounts.desktop / totalDevices) * 100) },
      { device: 'Mobile', count: deviceCounts.mobile, percentage: Math.round((deviceCounts.mobile / totalDevices) * 100) },
      { device: 'Tablet', count: deviceCounts.tablet, percentage: Math.round((deviceCounts.tablet / totalDevices) * 100) },
    ] : [];

    // Map listing performance to listing data
    const performanceMap = new Map(
      listingPerformance.map(p => [p.listingId, p])
    );

    const topListings = userListings
      .map(listing => {
        const perf = performanceMap.get(listing.id);
        return {
          id: listing.id,
          address: listing.property?.address 
            ? `${listing.property.address.street}, ${listing.property.address.city}`
            : 'Unknown',
          image: listing.property?.media?.[0]?.image || null,
          price: listing.price,
          bedrooms: listing.property?.numberBedrooms || 0,
          tier: listing.listingTier,
          views: perf?._sum?.views ?? 0,
          impressions: perf?._sum?.impressions ?? 0,
          clicks: perf?._sum?.clicks ?? 0,
          favourites: perf?._sum?.favourites ?? 0,
          enquiries: perf?._sum?.enquiries ?? 0,
          avgDuration: Math.round(perf?._avg?.avgDuration ?? 0),
          ctr: perf?._sum?.impressions 
            ? Math.round(((perf._sum.clicks ?? 0) / perf._sum.impressions) * 100) 
            : 0,
        };
      })
      .sort((a, b) => b.views - a.views);

    // Calculate percentage changes
    const prevSum = previousPeriodStats._sum;
    const currentViews = timeSeries.reduce((sum, d) => sum + d.views, 0);
    const currentImpressions = timeSeries.reduce((sum, d) => sum + d.impressions, 0);
    
    const viewsChange = prevSum.views 
      ? Math.round(((currentViews - prevSum.views) / prevSum.views) * 100)
      : 0;
    const impressionsChange = prevSum.impressions
      ? Math.round(((currentImpressions - prevSum.impressions) / prevSum.impressions) * 100)
      : 0;

    return {
      summary: {
        totalViews,
        totalImpressions,
        totalFavourites,
        totalEnquiries,
        ctr: totalImpressions ? Math.round((totalViews / totalImpressions) * 100) : 0,
        viewsChange,
        impressionsChange,
        activeListings: userListings.filter(l => l.published && !l.archived).length,
        totalListings: userListings.length,
      },
      timeSeries,
      topListings: topListings.slice(0, 10),
      trafficSources: trafficSources.map(s => ({
        source: s.source || 'unknown',
        count: s._count,
        percentage: totalViews ? Math.round((s._count / totalViews) * 100) : 0,
      })),
      deviceBreakdown,
      period,
    };
  } catch (error) {
    console.error("Comprehensive analytics error:", error);
    throw createError({ statusCode: 500, message: "Failed to fetch analytics" });
  }
});

function getEmptySummary() {
  return {
    totalViews: 0,
    totalImpressions: 0,
    totalFavourites: 0,
    totalEnquiries: 0,
    ctr: 0,
    viewsChange: 0,
    impressionsChange: 0,
    activeListings: 0,
    totalListings: 0,
  };
}
