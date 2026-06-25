/**
 * GET /api/admin/listings
 * Listing analytics and funnel intelligence. Admin only.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const query = getQuery(event);
  const rawSearch = typeof query.search === "string" ? query.search.trim() : "";
  const listingId = query.listingId ? Number(query.listingId) : null;
  const hasListingId = Number.isInteger(listingId) && Number(listingId) > 0;
  const listingSearchWhere =
    hasListingId
      ? { id: Number(listingId) }
      : rawSearch
        ? {
            OR: [
              { id: Number.isInteger(Number(rawSearch)) ? Number(rawSearch) : -1 },
              {
                user: {
                  username: {
                    contains: rawSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
              {
                property: {
                  address: {
                    OR: [
                      { street: { contains: rawSearch, mode: "insensitive" as const } },
                      { city: { contains: rawSearch, mode: "insensitive" as const } },
                      { postcode: { contains: rawSearch, mode: "insensitive" as const } },
                    ],
                  },
                },
              },
            ],
          }
        : {};

  const [
    totalPublished,
    totalDrafts,
    totalArchived,
    tierBreakdown,
    verificationBreakdown,
    priceReductionCount,
    priceReductionAvg,
    totalHidden,
    topFavourited,
    // Sale sub-stats
    tenureBreakdown,
    chainCount,
    sharedOwnershipCount,
    saleAvailability,
    // Rental sub-stats
    furnishedBreakdown,
    billsIncludedCount,
    rentalLengthBreakdown,
    rentalAvailability,
    allDrafts,
    performanceListings,
  ] = await Promise.all([
    prisma.listing.count({ where: { published: true, archived: false } }),
    prisma.draftListing.count(),
    prisma.listing.count({ where: { archived: true } }),

    prisma.listing.groupBy({
      by: ["listingTier"],
      where: { published: true, archived: false },
      _count: { id: true },
    }),

    prisma.listing.groupBy({
      by: ["verificationLevel"],
      where: { published: true, archived: false },
      _count: { id: true },
    }),

    prisma.listingPriceHistory.count(),

    prisma.listingPriceHistory.aggregate({
      _avg: { changePercent: true },
    }),

    prisma.hiddenListing.count(),

    prisma.userFavouriteListing.groupBy({
      by: ["listingId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Sale breakdowns
    prisma.saleListing.groupBy({ by: ["tenureType"], _count: { id: true } }),
    prisma.saleListing.count({ where: { chain: true, listingId: { not: null } } }),
    prisma.saleListing.count({ where: { sharedOwnership: true, listingId: { not: null } } }),
    prisma.saleListing.groupBy({
      by: ["availabilityStatus"],
      where: { listingId: { not: null } },
      _count: { id: true },
    }),

    // Rental breakdowns
    prisma.rentalListing.groupBy({ by: ["furnishedStatus"], _count: { id: true } }),
    prisma.rentalListing.count({ where: { isBillsIncluded: true, listingId: { not: null } } }),
    prisma.rentalListing.groupBy({ by: ["rentalLength"], _count: { id: true } }),
    prisma.rentalListing.groupBy({
      by: ["availabilityStatus"],
      where: { listingId: { not: null } },
      _count: { id: true },
    }),

    // Draft step completion
    prisma.draftListing.findMany({ select: { completedSteps: true } }),

    prisma.listing.findMany({
      where: listingSearchWhere,
      take: 25,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        price: true,
        published: true,
        archived: true,
        listingTier: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        property: {
          select: {
            address: {
              select: {
                street: true,
                city: true,
                postcode: true,
              },
            },
            numberBedrooms: true,
          },
        },
      },
    }),
  ]);

  const performanceListingIds = performanceListings.map((listing) => listing.id);
  const [viewsByListing, impressionsByListing, clicksByListing, favouritesByListing, enquiriesByListing] =
    performanceListingIds.length ?
      await Promise.all([
        prisma.listingView.groupBy({
          by: ["listingId"],
          where: { listingId: { in: performanceListingIds } },
          _count: { id: true },
        }),
        prisma.listingImpression.groupBy({
          by: ["listingId"],
          where: { listingId: { in: performanceListingIds } },
          _count: { id: true },
        }),
        prisma.listingClick.groupBy({
          by: ["listingId"],
          where: { listingId: { in: performanceListingIds } },
          _count: { id: true },
        }),
        prisma.userFavouriteListing.groupBy({
          by: ["listingId"],
          where: { listingId: { in: performanceListingIds } },
          _count: { id: true },
        }),
        prisma.conversation.groupBy({
          by: ["listingId"],
          where: { listingId: { in: performanceListingIds } },
          _count: { id: true },
        }),
      ])
    : [[], [], [], [], []];

  const countMap = (rows: Array<{ listingId: number | null; _count: { id: number } }>) =>
    new Map(rows.filter((row) => row.listingId !== null).map((row) => [row.listingId as number, row._count.id]));

  const viewsMap = countMap(viewsByListing);
  const impressionsMap = countMap(impressionsByListing);
  const clicksMap = countMap(clicksByListing);
  const favouritesMap = countMap(favouritesByListing);
  const enquiriesMap = countMap(enquiriesByListing);

  // Draft funnel: split by steps completed
  const abandonedDrafts = allDrafts.filter((d) => d.completedSteps.length === 0).length;
  const inProgressDrafts = allDrafts.filter(
    (d) => d.completedSteps.length > 0 && d.completedSteps.length < 10,
  ).length;
  const completedDrafts = allDrafts.filter((d) => d.completedSteps.length >= 10).length;

  // Average steps completed
  const avgStepsCompleted =
    allDrafts.length > 0
      ? allDrafts.reduce((sum, d) => sum + d.completedSteps.length, 0) / allDrafts.length
      : 0;

  // Price bracket distribution for published listings
  const [priceUnder100k, price100to250k, price250to500k, price500to1m, priceOver1m] =
    await Promise.all([
      prisma.listing.count({ where: { price: { lt: 100000 }, published: true, archived: false } }),
      prisma.listing.count({
        where: { price: { gte: 100000, lt: 250000 }, published: true, archived: false },
      }),
      prisma.listing.count({
        where: { price: { gte: 250000, lt: 500000 }, published: true, archived: false },
      }),
      prisma.listing.count({
        where: { price: { gte: 500000, lt: 1000000 }, published: true, archived: false },
      }),
      prisma.listing.count({
        where: { price: { gte: 1000000 }, published: true, archived: false },
      }),
    ]);

  return {
    funnel: {
      published: totalPublished,
      drafts: totalDrafts,
      archived: totalArchived,
      abandonedDrafts,
      inProgressDrafts,
      completedDrafts,
      avgStepsCompleted: Math.round(avgStepsCompleted * 10) / 10,
    },
    tierBreakdown: tierBreakdown.map((r) => ({ tier: r.listingTier, count: r._count.id })),
    verificationBreakdown: verificationBreakdown.map((r) => ({
      level: r.verificationLevel,
      count: r._count.id,
    })),
    priceDistribution: [
      { bracket: "Under £100k", count: priceUnder100k },
      { bracket: "£100k–£250k", count: price100to250k },
      { bracket: "£250k–£500k", count: price250to500k },
      { bracket: "£500k–£1m", count: price500to1m },
      { bracket: "Over £1m", count: priceOver1m },
    ],
    priceReductions: {
      total: priceReductionCount,
      avgChangePercent: priceReductionAvg._avg.changePercent
        ? Math.round(priceReductionAvg._avg.changePercent * 100) / 100
        : null,
    },
    saleBreakdown: {
      tenureType: tenureBreakdown.map((r) => ({ type: r.tenureType, count: r._count.id })),
      chain: chainCount,
      sharedOwnership: sharedOwnershipCount,
      availability: saleAvailability.map((r) => ({
        status: r.availabilityStatus,
        count: r._count.id,
      })),
    },
    rentalBreakdown: {
      furnishedStatus: furnishedBreakdown.map((r) => ({
        status: r.furnishedStatus,
        count: r._count.id,
      })),
      billsIncluded: billsIncludedCount,
      rentalLength: rentalLengthBreakdown.map((r) => ({
        length: r.rentalLength,
        count: r._count.id,
      })),
      availability: rentalAvailability.map((r) => ({
        status: r.availabilityStatus,
        count: r._count.id,
      })),
    },
    hiddenListings: { total: totalHidden },
    topFavourited: topFavourited.map((r) => ({ listingId: r.listingId, count: r._count.id })),
    listingPerformance: performanceListings.map((listing) => {
      const views = viewsMap.get(listing.id) ?? 0;
      const impressions = impressionsMap.get(listing.id) ?? 0;
      const clicks = clicksMap.get(listing.id) ?? 0;
      const address = listing.property?.address;

      return {
        id: listing.id,
        address: [address?.street, address?.city, address?.postcode].filter(Boolean).join(", "),
        owner: listing.user?.username || listing.user?.email || `User #${listing.user?.id}`,
        status:
          listing.archived ? "Archived"
          : listing.published ? "Published"
          : "Unpublished",
        tier: listing.listingTier,
        price: listing.price,
        bedrooms: listing.property?.numberBedrooms ?? null,
        views,
        impressions,
        clicks,
        favourites: favouritesMap.get(listing.id) ?? 0,
        enquiries: enquiriesMap.get(listing.id) ?? 0,
        ctr: impressions ? Math.round((clicks / impressions) * 1000) / 10 : 0,
      };
    }),
  };
});
