/**
 * Composable for managing AI search page state and functionality
 */
export const useAiSearchPage = () => {
  const { aiSearch, paginateSearch, searchQuery, queryAnalysis: globalQueryAnalysis } = useAi();
  const { saveSearchState, restoreSearchState, clearSearchState } = useSearchState();

  // Core search state
  const searchResults = ref<ListingWithFullProperty[] | null>(null);
  const queryAnalysis = ref<QueryAnalysis | null>(null);
  const isSearching = ref(false);
  const hasSearched = ref(false);
  const searchError = ref<string | null>(null);
  
  // Form state
  const lastSearchQuery = ref('');
  const lastLocation = ref<GeocodingFeature | null>(null);
  const lastRadius = ref<number>(0);
  const isSearchFormCollapsed = ref(true);
  const currentSort = ref('relevance');
  
  // Pagination state
  const currentPage = ref(1);
  const totalPages = ref(0);
  const totalResults = ref(0);
  const lastWhereClause = ref<any>(null);
  const lastLocationContext = ref<any>(null);

  // Initialize state from saved search
  const initializeFromSavedState = () => {
    if (import.meta.client) {
      const restored = restoreSearchState();
      if (restored.hasSearched) {
        lastSearchQuery.value = restored.query;
        lastLocation.value = restored.location;
        lastRadius.value = restored.radius;
        currentSort.value = restored.sortBy;
        hasSearched.value = true;
        
        // Restore global search query and analysis for useAi composable
        searchQuery.value = restored.query;
        globalQueryAnalysis.value = restored.queryAnalysis;
        
        // Restore results and pagination if available
        if (restored.results) {
          searchResults.value = restored.results;
          queryAnalysis.value = restored.queryAnalysis;
          currentPage.value = restored.currentPage || 1;
          totalPages.value = restored.totalPages || 0;
          totalResults.value = restored.totalResults;
          lastWhereClause.value = restored.whereClause;
          lastLocationContext.value = restored.locationContext;
        }
        
        // Keep form collapsed when we have search results
        if (restored.results && restored.results.length > 0) {
          isSearchFormCollapsed.value = true;
        }
      }
    }
  };

  // Reset all state but preserve view mode
  const resetForm = () => {
    // Preserve the current view mode before clearing
    const { searchState } = useSearchState();
    const currentViewMode = searchState.value.viewMode;
    
    searchResults.value = null;
    queryAnalysis.value = null;
    isSearching.value = false;
    hasSearched.value = false;
    searchError.value = null;
    lastSearchQuery.value = '';
    lastLocation.value = null;
    lastRadius.value = 0;
    isSearchFormCollapsed.value = true;
    currentSort.value = 'relevance';
    currentPage.value = 1;
    totalPages.value = 0;
    totalResults.value = 0;
    lastWhereClause.value = null;
    lastLocationContext.value = null;
    searchQuery.value = ''; // Reset the global search query
    globalQueryAnalysis.value = null; // Reset the global query analysis
    clearSearchState();
    
    // Restore the view mode after clearing
    saveSearchState({ viewMode: currentViewMode });
  };

  // Save current form state and results
  const saveCurrentState = () => {
    saveSearchState({
      query: lastSearchQuery.value,
      location: lastLocation.value,
      radius: lastRadius.value,
      sortBy: currentSort.value,
      hasSearched: true,
      results: searchResults.value,
      queryAnalysis: queryAnalysis.value,
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalResults: totalResults.value,
      whereClause: lastWhereClause.value,
      locationContext: lastLocationContext.value
    });
  };

  return {
    // State
    searchResults,
    queryAnalysis,
    isSearching,
    hasSearched,
    searchError,
    lastSearchQuery,
    lastLocation,
    lastRadius,
    isSearchFormCollapsed,
    currentSort,
    currentPage,
    totalPages,
    totalResults,
    lastWhereClause,
    lastLocationContext,
    
    // Methods
    initializeFromSavedState,
    resetForm,
    saveCurrentState,
    
    // External composables
    aiSearch,
    paginateSearch
  };
};