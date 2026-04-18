/**
 * GET /api/admin/search
 * Search intelligence and unmet demand signals. Admin only.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalSearches,
    searchesThisWeek,
    searchesThisMonth,
    topQueries,
    topLocations,
    zeroResultSearches,
    lowResultSearches,
    listingTypeSplit,
    radiusHistogram,
    avgResultCount,
    ignoredTermsRaw,
  ] = await Promise.all([
    prisma.trackSearch.aggregate({ _sum: { count: true } }),

    prisma.trackSearch.aggregate({
      where: { updatedAt: { gte: sevenDaysAgo } },
      _sum: { count: true },
    }),

    prisma.trackSearch.aggregate({
      where: { updatedAt: { gte: thirtyDaysAgo } },
      _sum: { count: true },
    }),

    // Top 10 queries by total search count
    prisma.trackSearch.groupBy({
      by: ["query", "listingType"],
      _sum: { count: true },
      orderBy: { _sum: { count: "desc" } },
      take: 10,
    }),

    // Top 10 searched locations
    prisma.trackSearch.groupBy({
      by: ["locationPlaceName"],
      _sum: { count: true },
      orderBy: { _sum: { count: "desc" } },
      take: 10,
    }),

    // Unmet demand: zero-result searches
    prisma.trackSearch.groupBy({
      by: ["locationPlaceName", "listingType", "query"],
      where: { resultCount: 0 },
      _sum: { count: true },
      orderBy: { _sum: { count: "desc" } },
      take: 20,
    }),

    // Low result searches (1–4 results)
    prisma.trackSearch.groupBy({
      by: ["locationPlaceName", "listingType", "query"],
      where: { resultCount: { gt: 0, lt: 5 } },
      _sum: { count: true },
      _avg: { resultCount: true },
      orderBy: { _sum: { count: "desc" } },
      take: 20,
    }),

    // Search type split
    prisma.trackSearch.groupBy({
      by: ["listingType"],
      _sum: { count: true },
    }),

    // Radius preferences histogram (findMany avoids adapter-pg groupBy aggregate issue)
    prisma.trackSearch.findMany({ select: { radius: true, count: true } }),

    prisma.trackSearch.aggregate({ _avg: { resultCount: true } }),

    // Feature gaps: ignored terms (things GPT couldn't map to a filter)
    // Raw query to unnest the Postgres array and count occurrences
    prisma.$queryRaw<{ term: string; count: bigint }[]>`
      SELECT unnest("ignoredTerms") AS term, COUNT(*) AS count
      FROM "public"."TrackSearch"
      WHERE array_length("ignoredTerms", 1) > 0
      GROUP BY term
      ORDER BY count DESC
      LIMIT 30
    `,
  ]);

  // Geographic demand: get lat/lon for top locations
  const topLocationNames = topLocations.map((l) => l.locationPlaceName);
  const locationDetails = await prisma.trackSearch.findMany({
    where: { locationPlaceName: { in: topLocationNames } },
    select: { locationPlaceName: true, locationLat: true, locationLon: true },
    distinct: ["locationPlaceName"],
  });
  const locationLatLon = Object.fromEntries(
    locationDetails.map((l) => [l.locationPlaceName, { lat: l.locationLat, lon: l.locationLon }]),
  );

  return {
    totals: {
      allTime: totalSearches._sum.count ?? 0,
      thisWeek: searchesThisWeek._sum.count ?? 0,
      thisMonth: searchesThisMonth._sum.count ?? 0,
    },
    topQueries: topQueries.map((r) => ({
      query: r.query,
      listingType: r.listingType,
      count: r._sum.count ?? 0,
    })),
    topLocations: topLocations.map((r) => ({
      location: r.locationPlaceName,
      count: r._sum.count ?? 0,
      lat: locationLatLon[r.locationPlaceName]?.lat ?? null,
      lon: locationLatLon[r.locationPlaceName]?.lon ?? null,
    })),
    unmetDemand: {
      zeroResults: zeroResultSearches.map((r) => ({
        location: r.locationPlaceName,
        listingType: r.listingType,
        query: r.query,
        searchCount: r._sum.count ?? 0,
      })),
      lowResults: lowResultSearches.map((r) => ({
        location: r.locationPlaceName,
        listingType: r.listingType,
        query: r.query,
        searchCount: r._sum.count ?? 0,
        avgResults: r._avg.resultCount ? Math.round(r._avg.resultCount * 10) / 10 : null,
      })),
    },
    listingTypeSplit: listingTypeSplit.map((r) => ({
      type: r.listingType,
      count: r._sum.count ?? 0,
    })),
    radiusHistogram: (() => {
      const map = new Map<number, number>();
      for (const s of radiusHistogram) { map.set(s.radius, (map.get(s.radius) ?? 0) + s.count); }
      return Array.from(map.entries()).sort(([a], [b]) => a - b).map(([radiusMiles, count]) => ({ radiusMiles, count }));
    })(),
    avgResultCount: avgResultCount._avg.resultCount
      ? Math.round(avgResultCount._avg.resultCount * 10) / 10
      : null,
    featureGaps: ignoredTermsRaw.map((r) => ({
      term: r.term,
      count: Number(r.count),
    })),
  };
});
