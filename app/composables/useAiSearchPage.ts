import { applySortToResults } from '~/utils/searchSort';

/**
 * Composable for managing AI search page state and functionality
 */
export const useAiSearchPage = () => {
  const { aiSearch, paginateSearch } = useAi();
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
      }
    }
  };

  // Reset all state
  const resetForm = () => {
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
    clearSearchState();
  };

  // Save current form state
  const saveCurrentState = () => {
    saveSearchState({
      query: lastSearchQuery.value,
      location: lastLocation.value,
      radius: lastRadius.value,
      sortBy: currentSort.value,
      hasSearched: true
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