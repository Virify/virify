/**
 * Fetch trending AI searches
 * This endpoint retrieves the most popular AI search queries
 * based on the number of times they have been performed.
 */
export default defineEventHandler(async (event) => {
  return await getTrendingAiSearches();
});