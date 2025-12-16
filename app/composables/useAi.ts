import type { GeocodingFeatureWithBoundary } from '~~/shared/types/map';

export default function useAi() {
  const { trackSearch } = useAnalytics();
  // Global state for query analysis and search query
  const queryAnalysis = useState<QueryAnalysis | null>(
    "ai-query-analysis",
    () => null
  );
  const searchQuery = useState<string>("ai-search-query", () => "");

  /**
   * Perform an AI search with the given location and radius
   * @param location The location to search
   * @param radius The search radius
   * @param query The search query
   * @param page The page number (optional, defaults to 1)
   * @param limit The number of results per page (optional, defaults to 20)
   * @returns The search results
   */
  async function aiSearch(location: GeocodingFeatureWithBoundary, radius: number, query: string, page?: number, limit?: number) {
    searchQuery.value = query; // Update state for analysis function
    const response = await $fetch<AISearchResponse>("/api/search/rag/", {
      method: "POST",
      body: {
        query: query,
        lat: location.geometry.coordinates[1],
        lon: location.geometry.coordinates[0],
        radius: radius,
        bbox: location.bbox,
        boundaryPolygon: location.boundaryPolygon,
      },
    });

    // Strip boundaryPolygon for analytics tracking
    const { boundaryPolygon, ...locationForTracking } = location;
    
    // Track search with full context
    trackSearch({
      query,
      location: locationForTracking,
      radius,
      resultCount: response.results?.length ?? 0,
    });

    if (response.queryAnalysis) {
      queryAnalysis.value = response.queryAnalysis;
    }

    return response;
  }

  /**
   * Paginate existing search results without re-querying AI
   * @param whereClause The previously generated WHERE clause
   * @param page The page number
   * @param limit The number of results per page
   * @param query The original query (for metadata)
   * @param queryAnalysis The original query analysis
   * @param locationContext The original location context
   * @returns The paginated search results
   */
  async function paginateSearch(
    whereClause: any, 
    page: number, 
    limit: number = 20, 
    query: string, 
    queryAnalysis: any = null, 
    locationContext: any = null
  ) {
    const response = await $fetch<AISearchResponse>("/api/search/paginate/", {
      method: "POST",
      body: {
        whereClause,
        page,
        limit,
        query,
        queryAnalysis,
        locationContext,
      },
    });

    return response;
  }

  /**
   * Generate a structured array of query segments for highlighting.
   * @returns An array of objects with text and type ('used', 'ignored', 'normal').
   */
  function getAnalyzedQuerySegments() {
    if (!searchQuery.value) return [];
    if (!queryAnalysis.value) {
      return [{ text: searchQuery.value, type: "normal" }];
    }

    const { usedTerms, ignoredTerms } = queryAnalysis.value;
    const allTerms = [...usedTerms, ...ignoredTerms].sort((a, b) => b.length - a.length);

    const segments: { text: string; type: "used" | "ignored" | "normal" }[] = [];
    let lastIndex = 0;

    const termMap = new Map<string, "used" | "ignored">();
    usedTerms.forEach(term => termMap.set(term.toLowerCase(), "used"));
    ignoredTerms.forEach(term => termMap.set(term.toLowerCase(), "ignored"));

    const regex = new RegExp(allTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "gi");

    searchQuery.value.replace(regex, (match, offset) => {
      // Add the text before the current match as a normal segment
      if (offset > lastIndex) {
        segments.push({ text: searchQuery.value.substring(lastIndex, offset), type: "normal" });
      }

      // Add the matched term with its type
      const type = termMap.get(match.toLowerCase());
      if (type) {
        segments.push({ text: match, type });
      }

      lastIndex = offset + match.length;
      return match; // Required by replace function
    });

    // Add any remaining text after the last match
    if (lastIndex < searchQuery.value.length) {
      segments.push({ text: searchQuery.value.substring(lastIndex), type: "normal" });
    }

    return segments;
  }

  return {
    aiSearch,
    paginateSearch,
    getAnalyzedQuery: getAnalyzedQuerySegments, // Rename for compatibility
    queryAnalysis,
    searchQuery,
  };
}
