/**
 * Fetch trending locations
 * Cached for 1 week using Nitro's built-in caching
 */
export default defineCachedEventHandler(async () => {
  return await getTrendingLocations();
}, {
  maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
  name: 'trending-locations',
  getKey: () => 'trending-locations',
});