export type SortOrder =
  | "date-desc"
  | "date-asc"
  | "price-asc"
  | "price-desc"
  | "relevance";
export type ResultLayout = "map" | "grid" | "split";

/**
 * URL-based search state management
 *
 * Features:
 * - Reactive state updates across all consumers
 * - State is persisted in URL (shareable, SEO-friendly)
 * - No server-side storage needed
 */

const defaultState = defaultSearchState;

// Singleton instance
let instance: ReturnType<typeof createSearchState> | null = null;

function createSearchState() {
  const searchState = ref<SearchState>({ ...defaultState });
  const isLoading = ref(false);
  const sortSelectOpen = ref(false);

  /**
   *  Run a callback, if it's valid
   */
  function _runCallback(fn: unknown) {
    if (!isFunction(fn)) return;

    fn();
  }

  /**
   *  Toggle whether a search is pending
   */
  function setSearchPending(value: boolean = false) {
    isLoading.value = value;
  }

  /**
   * Update search type (traditional vs AI)
   */
  function setSearchType(value: "traditional" | "ai", callback?: () => void) {
    // Check value is valid
    if (value !== "traditional" && value !== "ai") return;

    // Update state
    updateState({ searchType: value });

    // Run optional callback
    _runCallback(callback);
  }

  /**
   * Update listing type filter
   */
  function setListingType(value: string, callback?: () => void) {
    if (value !== "all" && value !== "sale" && value !== "rent") return;
    // Check value is valid
    if (!isString(value)) return;

    // Update state
    updateState({ listingType: value });

    // Run optional callback
    _runCallback(callback);
  }

  /**
   *  Update state sort order
   */
  function setQuery(value: string, callback?: () => void) {
    // Check either value is valid
    if (!isString(value)) return;

    // Update state
    updateState({ query: value });

    // Run optional callback
    _runCallback(callback);
  }

  /**
   *  Update state sort order
   */
  function setQueryAnalysis(value: QueryAnalysis, callback?: () => void) {
    // Check either value is valid
    if (!isObject(value)) return;

    // Update state
    updateState({ queryAnalysis: value });

    // Run optional callback
    _runCallback(callback);
  }

  /**
   *  Update state sort order
   */
  function setSortOrder(value: SortOrder, callback?: () => void) {
    const validValues: SortOrder[] = [
      "date-desc",
      "date-asc",
      "price-asc",
      "price-desc",
      "relevance",
    ];

    // Check value is valid
    if (!validValues.includes(value)) return;

    // Update state
    updateState({ sortBy: value });

    // Run optional callback
    _runCallback(callback);
  }

  /**
   *  Manage state directly
   */
  function setResults(value: any[], callback?: () => void) {
    // Check value is valid
    if (!Array.isArray(value)) return;

    // Update state
    updateState({ results: value });

    // Run optional callback
    _runCallback(callback);
  }

  /**
   *  Manage state directly
   */
  const updateState = (updates: Partial<SearchState>) => {
    Object.assign(searchState.value, updates);
  };

  const clearState = () => {
    searchState.value = { ...defaultState };
  };

  /**
   *  Fetch results
   */
  interface RecentSearch {
    type: "ai" | "traditional";
    body: unknown;
  }

  interface RecentLocation {
    location?: unknown;
    radius?: number;
  }

  let mostRecentLocation: RecentLocation = {};
  let mostRecentQuery: RecentSearch | null = null;

  const toast = useToast();
  const { trackSearch } = useAnalyticsTracking();
  const { setActiveLocation, setActiveRadius, setActiveTerms } =
    useActiveSearchTerms();

  async function fetchResults(
    locationData = mostRecentLocation,
    queryData = mostRecentQuery,
  ) {
    const { location, radius } = asObject(locationData);

    if (!location || !queryData) {
      return;
    }

    const { type, body } = asObject(queryData);

    const isAI = type === "ai";
    const validatedType = isAI ? "ai" : "traditional";

    try {
      setSearchPending(true);
      setSearchType(validatedType);

      /**
       *  Perform AI search
       */
      if (isAI) {
        const response = await $fetch<AISearchResponse>("/api/search", {
          method: "POST",
          timeout: 60000,
          body: {
            ...asObject(body),
            location,
            radius,
            sortBy: searchState.value.sortBy,
            type: "ai",
          } as unknown as BodyInit,
        });

        const {
          queryAnalysis,
          results = [],
          effectiveListingType,
        } = asObject(response);
        const { listingType, query } = asObject(body);

        if (queryAnalysis) {
          setQueryAnalysis(queryAnalysis);
          setActiveTerms(queryAnalysis?.usedTerms);
        }

        setResults(results as unknown[]);
        trackSearch({
          listingType: effectiveListingType ?? listingType,
          query: query as string,
          location: location as GeocodingFeature,
          radius: radius as number,
          resultCount: results?.length ?? 0,
          usedTerms: queryAnalysis?.usedTerms ?? [],
          ignoredTerms: queryAnalysis?.ignoredTerms ?? [],
        });
      } else {
        /**
         *  Perform traditional search
         */
        const formData = asObject(body) as unknown as TraditionalSearchData;

        const response = await $fetch("/api/search", {
          method: "POST",
          body: {
            ...formData,
            location,
            radius,
            sortBy: searchState.value.sortBy,
            type: "traditional",
          },
        });

        if (!response) throw new Error("");

        const queryAnalysis = buildQueryAnalysisFromFormData(formData);
        setQueryAnalysis(queryAnalysis);
        setActiveTerms(queryAnalysis?.usedTerms);
        setResults(response.results);

        trackSearch({
          listingType: formData.isSale ? "sale" : "rent",
          query: buildQueryFromTraditionalFormData(formData),
          location: location as GeocodingFeature,
          radius: radius as number,
          resultCount: response.results?.length ?? 0,
          usedTerms: queryAnalysis?.usedTerms ?? [],
          ignoredTerms: [],
        });
      }

      setActiveLocation(location);
      setActiveRadius(radius);

      await navigateTo("/search");

      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    } catch (error) {
      console.error("Search error:", error);

      toast.add({
        title: "Error",
        description: "Search failed. Please try again.",
        color: "error",
        icon: "i-lucide-search-x",
      });
    } finally {
      setSearchPending(false);
      mostRecentQuery = queryData;
      mostRecentLocation = locationData;
    }
  }

  return {
    searchState,
    sortSelectOpen,
    setSortOrder,
    setSearchType,
    setListingType,
    setSearchPending,
    setQuery,
    setQueryAnalysis,
    setResults,
    updateState,
    clearState,
    fetchResults,
    isLoading: readonly(isLoading),
  };
}

export const useSearchState = () => {
  if (!instance) {
    instance = createSearchState();
  }
  return instance;
};
