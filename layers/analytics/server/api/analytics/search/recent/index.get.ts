import { getRecentSearchQueries } from "~~/layers/database/server/utils/analytics";

/**
 * Fetch recent AI search queries that returned results
 * Cached for 1 hour using Nitro's built-in caching
 */
export default defineCachedEventHandler(async () => {
  return await getRecentSearchQueries();
}, {
  maxAge: 60 * 60, // 1 hour in seconds
  name: 'recent-search-queries',
  getKey: () => 'recent-search-queries',
});
