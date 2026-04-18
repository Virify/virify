import type { GeocodingFeatureWithBoundary } from '~~/shared/types/map';

export default function useAi() {
  const { trackSearch } = useAnalyticsTracking();
  const { checkText } = useModeration();
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
  async function aiSearch(listingType: ListingType, location: GeocodingFeatureWithBoundary, radius: number, query: string, page?: number, limit?: number) {
    searchQuery.value = query; // Update state for analysis function

    const { safe, reason } = await checkText(query)
    if (!safe) {
      throw new Error(reason ?? 'Your search contains inappropriate content. Please try a different search.')
    }

    // Get center coordinates - use center property if available (for regions with Polygon geometry)
    // otherwise fall back to Point geometry coordinates
    const [lon, lat] = location.center 
      ?? (location.geometry?.type === 'Point' ? location.geometry.coordinates : null)
      ?? [0, 0];
    
    const response = await $fetch<AISearchResponse>("/api/search/rag/", {
      method: "POST",
      body: {
        listingType,
        query: query,
        lat,
        lon,
        radius: radius,
        bbox: location.bbox,
        boundaryPolygon: location.boundaryPolygon,
      },
    });

    // Strip boundaryPolygon for analytics tracking and normalize geometry to Point
    const { boundaryPolygon, geometry, ...locationBase } = location;
    const locationForTracking = {
      ...locationBase,
      geometry: {
        type: 'Point' as const,
        coordinates: [lon, lat] as [number, number]
      }
    };
    
    // Track search with full context
    trackSearch({
      listingType,
      query,
      location: locationForTracking,
      radius,
      resultCount: response.results?.length ?? 0,
      usedTerms: response.queryAnalysis?.usedTerms ?? [],
      ignoredTerms: response.queryAnalysis?.ignoredTerms ?? [],
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


  return {
    aiSearch,
    paginateSearch,
    queryAnalysis,
    searchQuery,
  };
}
