import { useStorage } from '@vueuse/core'

export type SortOrder = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'relevance'
export type ResultLayout = 'map' | 'grid' | 'split'

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

  /**
   *  Run a callback, if it's valid
   */
  function _runCallback(fn: unknown) {
    if (!isFunction(fn)) return

    fn()
  }

  /**
   *  Toggle whether a search is pending
   */
  function setSearchPending(value: boolean = false) {
    isLoading.value = value
  }

  /**
   * Update search type (traditional vs AI)
   */
  function setSearchType(value: 'traditional' | 'ai', callback?: () => void) {
    // Check value is valid
    if (value !== 'traditional' && value !== 'ai') return

    // Update state
    updateState({ searchType: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   * Update listing type filter
   */
  function setListingType(value: string, callback?: () => void) {
    if (value !== 'all' && value !== 'sale' && value !== 'rent') return
    // Check value is valid
    if (!isString(value)) return

    // Update state
    updateState({ listingType: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state layout
   */
  function setLocation(value: GeocodingFeature, callback?: () => void) {
    // Update state - don't clear results, they'll be cleared when search starts
    updateState({ location: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state sort order
   */
  function setQuery(value: string, callback?: () => void) {
    // Check either value is valid
    if (!isString(value)) return

    // Update state
    updateState({ query: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state sort order
   */
  function setQueryAnalysis(value: QueryAnalysis, callback?: () => void) {
    // Check either value is valid
    if (!isObject(value)) return

    // Update state
    updateState({ queryAnalysis: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state sort order
   */
  function setLocationRadius(value: number, callback?: () => void) {
    // Check value is valid
    if (!Number.isInteger(value)) return

    // Update state
    updateState({ radius: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state sort order
   */
  function setSortOrder(value: SortOrder, callback?: () => void) {
    const validValues: SortOrder[] = ['date-desc', 'date-asc', 'price-asc', 'price-desc', 'relevance']

    // Check value is valid
    if (!validValues.includes(value)) return

    // Update state
    updateState({ sortBy: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state layout
   */
  function setViewMode(value: ResultLayout, callback?: () => void) {
    const validValues: ResultLayout[] = ['grid', 'split', 'map']

    // Check value is valid
    if (!validValues.includes(value)) return

    // Update state
    updateState({ viewMode: value })

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Manage state directly
   */
  function setResults(value: any[], callback?: () => void) {
    // Check value is valid
    if (!Array.isArray(value)) return

    // Update state
    updateState({ results: value })

    // Run optional callback
    _runCallback(callback)
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
    type: 'ai' | 'traditional'
    body: unknown
  }

  interface RecentLocation {
    location?: unknown
    radius?: number
  }

  let mostRecentLocation: RecentLocation = {}
  let mostRecentQuery: RecentSearch | null = null

  const toast = useToast()

  async function fetchResults(
    locationData = mostRecentLocation,
    queryData = mostRecentQuery
  ) {
    const { location, radius } = asObject(locationData)

    if (!location || !queryData) {
      return
    }

    const { type, body } = asObject(queryData)

    const isAI = type === 'ai'
    const validatedType = isAI ? 'ai' : 'traditional'

    try {
      setSearchPending(true)
      setSearchType(validatedType)

      /**
       *  Perform AI search
       */
      if (isAI) {
        const response = await $fetch('/api/search/rag', {
          method: 'POST',
          body: {
            ...asObject(body),
            location,
            radius
          } as unknown as BodyInit
        })

        const { results = [] } = asObject(response)

        setResults(results as unknown[])
      }

      /**
       *  Perform traditional search
       */
      else {
        const formData = asObject(body) as unknown as TraditionalSearchData

        const response = await $fetch('/api/search/traditional', {
          method: 'POST',
          body: {
            ...formData,
            location,
            radius
          }
        })

        if (!response) throw new Error('')

        const queryAnalysis = buildQueryAnalysisFromFormData(formData)
        setQueryAnalysis(queryAnalysis)
        setResults(response as unknown[])
      }

      await navigateTo('/search')

      window.scrollTo({
        top: 0,
        behavior: "instant"
      })
    }
    catch (error) {
      console.error('Search error:', error)

      toast.add({
        title: 'Error',
        description: 'Search failed. Please try again.',
        color: 'error'
      })
    } finally {
      setSearchPending(false)
      mostRecentQuery = queryData
      mostRecentLocation = locationData
    }
  }

  return {
    searchState,
    setSortOrder,
    setViewMode,
    setSearchType,
    setListingType,
    setLocation,
    setLocationRadius,
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
