/**
 * GET /api/admin/engagement
 * Listing engagement, traffic, and conversion signals. Admin only.
 */
import {
  getPageViewSources,
  getPageViewSummary,
  getTopPages,
} from "~~/layers/analytics/server/utils/page-view-queries";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const [
    totalViews,
    authedViews,
    anonViews,
    avgDuration,
    trafficSources,
    totalImpressions,
    clickedImpressions,
    avgClickedPosition,
    sharePlatforms,
    topViewedListings,
    topSharedListings,
    enquiryTotals,
    pageViews,
    pageViewSources,
    topPages,
  ] = await Promise.all([
    prisma.listingView.count(),
    prisma.listingView.count({ where: { userId: { not: null } } }),
    prisma.listingView.count({ where: { userId: null } }),

    prisma.listingView.aggregate({ _avg: { duration: true } }),

    prisma.listingView.groupBy({
      by: ["source"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.listingImpression.count(),
    prisma.listingImpression.count({ where: { clicked: true } }),

    prisma.listingImpression.aggregate({
      where: { clicked: true },
      _avg: { position: true },
    }),

    prisma.listingShare.groupBy({
      by: ["platform"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Top viewed listings from daily stats
    prisma.dailyListingStats.groupBy({
      by: ["listingId"],
      _sum: { views: true },
      orderBy: { _sum: { views: "desc" } },
      take: 10,
    }),

    // Top shared listings
    prisma.listingShare.groupBy({
      by: ["listingId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Enquiry funnel from daily listing stats
    prisma.dailyListingStats.aggregate({
      _sum: { impressions: true, views: true, enquiries: true, clicks: true },
    }),

    getPageViewSummary(),
    getPageViewSources(),
    getTopPages(10),
  ]);

  const ctr =
    totalImpressions > 0
      ? Math.round((clickedImpressions / totalImpressions) * 10000) / 100
      : 0;

  // Top CTR listings: get those with highest clicks/impressions ratio from daily stats
  const topCtrRaw = await prisma.dailyListingStats.groupBy({
    by: ["listingId"],
    _sum: { clicks: true, impressions: true },
    having: { impressions: { _sum: { gt: 0 } } },
    orderBy: { _sum: { clicks: "desc" } },
    take: 20,
  });

  const topCtrListings = topCtrRaw
    .filter((r) => (r._sum.impressions ?? 0) > 0)
    .map((r) => ({
      listingId: r.listingId,
      clicks: r._sum.clicks ?? 0,
      impressions: r._sum.impressions ?? 0,
      ctr:
        Math.round(((r._sum.clicks ?? 0) / (r._sum.impressions ?? 1)) * 10000) / 100,
    }))
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 10);

  return {
    pageViews,
    pageViewSources,
    topPages,
    views: {
      total: totalViews,
      authenticated: authedViews,
      anonymous: anonViews,
      avgDurationSeconds: avgDuration._avg.duration
        ? Math.round(avgDuration._avg.duration)
        : null,
    },
    trafficSources: trafficSources.map((r) => ({
      source: r.source ?? "unknown",
      count: r._count.id,
    })),
    impressions: {
      total: totalImpressions,
      clicked: clickedImpressions,
      ctr,
      avgClickedPosition: avgClickedPosition._avg.position
        ? Math.round(avgClickedPosition._avg.position * 10) / 10
        : null,
    },
    sharePlatforms: sharePlatforms.map((r) => ({ platform: r.platform, count: r._count.id })),
    topViewedListings: topViewedListings.map((r) => ({
      listingId: r.listingId,
      views: r._sum.views ?? 0,
    })),
    topSharedListings: topSharedListings.map((r) => ({
      listingId: r.listingId,
      shares: r._count.id,
    })),
    topCtrListings,
    enquiryFunnel: {
      impressions: enquiryTotals._sum.impressions ?? 0,
      views: enquiryTotals._sum.views ?? 0,
      clicks: enquiryTotals._sum.clicks ?? 0,
      enquiries: enquiryTotals._sum.enquiries ?? 0,
    },
  };
});
