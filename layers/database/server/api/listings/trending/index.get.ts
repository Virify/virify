// Helper to fetch cached trending listings (1 hour cache)
const getCachedTrendingListings = defineCachedFunction(
  async (days: number, limit: number): Promise<SummaryCardData[]> => {
    // Get listings with view analytics from the specified time period
    const trendingData = await getTrendingListingsAnalytics(days, limit);

    // Get the actual listing data for trending listings using the same structure as similar listings
    const listingIds = trendingData.map((item: any) => item.listingId);

    // Get trending listings by IDs in SummaryCardData format
    const listings = await getTrendingListingsByIds(listingIds, limit);

    return listings;
  },
  {
    maxAge: 1000 * 60 * 60, // 1 hour cache
    name: "trendingListings",
    getKey: (days, limit) => `trending:${days}:${limit}`,
  }
);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Parse query parameters with defaults
  const days = Math.min(Math.max(parseInt(String(query.days)) || 7, 1), 90); // 1-90 days
  const limit = Math.min(Math.max(parseInt(String(query.limit)) || 12, 1), 50); // 1-50 results

  try {
    const trendingListings = await getCachedTrendingListings(days, limit);

    // Return just the listings array (same format as similar listings)
    return trendingListings;
  } catch (error) {
    console.error("Error fetching trending listings:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch trending listings",
    });
  }
});
