import { getRecentSearchQueries } from "~~/layers/database/server/utils/analytics";

/**
 * Fetch recent search queries that returned results
 * Returns all search types — consumers should filter as needed
 * Cached for 1 hour using Nitro's built-in caching
 */
export default defineCachedEventHandler(
  async () => {
    return await getRecentSearchQueries();
  },
  {
    maxAge: 60 * 60, // 1 hour in seconds
    name: "recent-search-queries",
    getKey: () => "recent-search-queries",
  },
);
