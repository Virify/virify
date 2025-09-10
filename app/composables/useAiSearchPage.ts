/**
 * Composable for managing AI search page state and functionality
 * Uses local refs with manual KV save/load
 * @deprecated
 */
export const useAiSearchPage = () => {
  const {
    aiSearch,
    paginateSearch,
    searchQuery,
    queryAnalysis: globalQueryAnalysis,
  } = useAi();
  const { refreshFromKV, clearState } = useSearchState();

  // Local reactive state - these are the source of truth
  const isSearching = ref(false);
  const searchError = ref<string | null>(null);
  const isSearchFormCollapsed = ref(true);

  // Search state - only these refs, no KV sync watcher
  const searchResults = ref<ListingWithFullProperty[] | null>(null);
  const queryAnalysis = ref<QueryAnalysis | null>(null);
  const hasSearched = ref(false);
  const lastSearchQuery = ref("No previous searches");
  const lastLocation = ref<GeocodingFeature | null>(null);
  const lastRadius = ref(0);
  const currentSort = ref("relevance");
  const currentPage = ref(1);
  const totalPages = ref(0);
  const totalResults = ref(0);
  const lastWhereClause = ref<any>(null);
  const lastLocationContext = ref<any>(null);
  const viewMode = ref<"grid" | "map" | "split">("grid");
  const mapViewport = ref<{ zoom: number; center: [number, number]; bounds?: [number, number, number, number] } | undefined>(undefined);

  // Load state from KV once on initialization
  const loadInitialState = async () => {
    try {
      await refreshFromKV();
      const { searchState } = useSearchState();
      const stored = searchState.value;
      
      if (stored && stored.hasSearched) {
        // Populate local refs from KV
        searchResults.value = stored.results;
        queryAnalysis.value = stored.queryAnalysis;
        hasSearched.value = stored.hasSearched;
        lastSearchQuery.value = stored.query;
        lastLocation.value = stored.location;
        lastRadius.value = stored.radius;
        currentSort.value = stored.sortBy;
        currentPage.value = stored.currentPage || 1;
        totalPages.value = stored.totalPages || 0;
        totalResults.value = stored.totalResults;
        lastWhereClause.value = stored.whereClause;
        lastLocationContext.value = stored.locationContext;
        viewMode.value = stored.viewMode;
        mapViewport.value = stored.mapViewport;

        // Sync with global useAi composable
        searchQuery.value = stored.query;
        globalQueryAnalysis.value = stored.queryAnalysis;

        // Auto-collapse form when we have results
        if (stored.results && stored.results.length > 0) {
          isSearchFormCollapsed.value = true;
        }
      }
    } catch (error) {
      console.error("Failed to load initial search state:", error);
    }
  };

  // Initialize on mount
  onMounted(() => {
    loadInitialState();
  });

  // Save current local state to KV
  const saveToKV = async () => {
    const { updateState } = useSearchState();
    await updateState({
      query: lastSearchQuery.value,
      location: lastLocation.value,
      radius: lastRadius.value,
      sortBy: currentSort.value,
      hasSearched: hasSearched.value,
      results: searchResults.value,
      queryAnalysis: queryAnalysis.value,
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalResults: totalResults.value,
      whereClause: lastWhereClause.value,
      locationContext: lastLocationContext.value,
      viewMode: viewMode.value,
      mapViewport: mapViewport.value,
    });
  };

  // Update search form data
  const updateSearchForm = async (formData: {
    query?: string;
    location?: GeocodingFeature | null;
    radius?: number;
    sortBy?: string;
  }) => {
    if (formData.query !== undefined) lastSearchQuery.value = formData.query;
    if (formData.location !== undefined) lastLocation.value = formData.location;
    if (formData.radius !== undefined) lastRadius.value = formData.radius;
    if (formData.sortBy !== undefined) currentSort.value = formData.sortBy;

    await saveToKV();
  };

  // Update search results and mark as searched
  const updateSearchResults = async (results: {
    results: ListingWithFullProperty[];
    queryAnalysis: QueryAnalysis;
    currentPage?: number;
    totalPages?: number;
    totalResults?: number;
    whereClause?: any;
    locationContext?: any;
  }) => {
    // Update local refs
    hasSearched.value = true;
    searchResults.value = results.results;
    queryAnalysis.value = results.queryAnalysis;
    currentPage.value = results.currentPage || 1;
    totalPages.value = results.totalPages || 0;
    totalResults.value = results.totalResults || 0;
    lastWhereClause.value = results.whereClause;
    lastLocationContext.value = results.locationContext;

    // Save to KV
    await saveToKV();
  };

  // Reset form but preserve view mode
  const resetForm = async () => {
    const currentViewMode = viewMode.value;

    // Reset local state
    isSearching.value = false;
    searchError.value = null;
    isSearchFormCollapsed.value = true;
    searchQuery.value = "";
    globalQueryAnalysis.value = null;

    // Reset local refs
    searchResults.value = null;
    queryAnalysis.value = null;
    hasSearched.value = false;
    lastSearchQuery.value = "";
    lastLocation.value = null;
    lastRadius.value = 0;
    currentSort.value = "relevance";
    currentPage.value = 1;
    totalPages.value = 0;
    totalResults.value = 0;
    lastWhereClause.value = null;
    lastLocationContext.value = null;

    // Clear KV state
    await clearState();

    // Restore view mode
    viewMode.value = currentViewMode;
    await saveToKV();
  };

  // Update view mode
  const updateViewMode = async (newViewMode: "grid" | "map" | "split") => {
    viewMode.value = newViewMode;
    await saveToKV();
  };

  // Update sort preference
  const updateSort = async (sortBy: string) => {
    currentSort.value = sortBy;
    await saveToKV();
  };

  // Update pagination
  const updatePagination = async (page: number) => {
    currentPage.value = page;
    await saveToKV();
  };

  // Update map viewport state
  const updateMapViewport = async (viewport: MapViewportState) => {
    mapViewport.value = viewport;
    await saveToKV();
  };

  // Save current state (backward compatibility)
  const saveCurrentState = async () => {
    await saveToKV();
  };

  return {
    // Local state refs (source of truth)
    searchResults,
    queryAnalysis,
    hasSearched,
    lastSearchQuery,
    lastLocation,
    lastRadius,
    currentSort,
    currentPage,
    totalPages,
    totalResults,
    lastWhereClause,
    lastLocationContext,
    viewMode,
    mapViewport,

    // Local reactive state
    isSearching,
    searchError,
    isSearchFormCollapsed,

    // State update methods (save to KV when called)
    updateSearchForm,
    updateSearchResults,
    updateViewMode,
    updateSort,
    updatePagination,
    updateMapViewport,
    saveCurrentState,
    resetForm,
    loadInitialState,

    // External composables
    aiSearch,
    paginateSearch,
  };
};
