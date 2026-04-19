import { hash } from 'ohash'

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
  const isLoading = shallowRef(false);
  const sortSelectOpen = shallowRef(false);

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
   *  Save state with hash key
   *
   *  @TODO this should probably be done as part of the actual fetch 
   *        request in the `fetchResults` function
   */
  async function mockSaveHash(key: string, value: string) {
    if (!import.meta.client) return

    return new Promise((resolve) => {
      setTimeout(() => {
        window.localStorage.setItem(key, value)
        resolve(true)
      }, 500)
    })
  }

  async function mockParseHash(key?: string | string[]) {
    if (!import.meta.client || !isString(key)) return

    return new Promise((resolve) => {
      setTimeout(async () => {
        const savedSearch = window.localStorage.getItem(key as string)

        if (!isString(savedSearch)) return

        try {
          const { location, query } = asObject(JSON.parse(savedSearch))

          // Set most recent search
          mostRecentLocation = location
          mostRecentQuery = query

          // Save location
          setLocation(location?.location)
          setLocationRadius(location?.radius)

          // @TODO save query, etc.

          await fetchResults()
        }
        catch {
          console.error('Unable to parse saved query')
        }

        resolve(true)
      }, 500)
    })
  }

  async function fetchHash(hash?: string | string[]) {
    isLoading.value = true

    await mockParseHash(hash)

    isLoading.value = false
  }

  function generateHash(location: unknown, query: unknown) {
    const saveState = { location, query }

    const hashKey = hash(saveState)
    const stringValue = JSON.stringify(saveState)

    /**
     *  @TODO
     *  As feasibly, someone could malform this data clientside and then
     *  generate a URL and share it, and use that to pollute other
     *  people's Virify pages, we should review what we can do to
     *  sanitise this data (this should be done serverside, as otherwise
     *  someone could just ignore it anyway)
     */
    mockSaveHash(hashKey, stringValue)
    navigateTo('/search/' + hashKey)
  }

  /**
   *  Track most recent
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

  function updateMostRecent(location: RecentLocation, query: RecentSearch) {
    mostRecentLocation = location
    mostRecentQuery = query

    generateHash(location, query)
  }

  /**
   *  Fetch results
   */
  const toast = useToast()
  const { trackSearch } = useAnalyticsTracking()
  const { setActiveLocation, setActiveRadius, setActiveTerms } = useActiveSearchTerms()

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
            radius,
            sortBy: searchState.value.sortBy
          } as unknown as BodyInit
        })

        const { queryAnalysis, results = [], effectiveListingType } = asObject(response)
        const { listingType, query } = asObject(body)

        if (queryAnalysis) {
          setQueryAnalysis(queryAnalysis)
          setActiveTerms(queryAnalysis?.usedTerms)
        }

        setResults(results as unknown[])
        trackSearch({
          listingType: effectiveListingType ?? listingType,
          query: query as string,
          location: location as GeocodingFeature,
          radius: radius as number,
          resultCount: results?.length ?? 0,
        })
      }

      /**
       *  Perform traditional search
       */
      else {
        const formData = asObject(body) as unknown as TraditionalSearchData

        const { results } = await $fetch('/api/search/traditional', {
          method: 'POST',
          body: {
            ...formData,
            location,
            radius,
            sortBy: searchState.value.sortBy
          }
        })

        if (!results) throw new Error('No responses array returned')

        const queryAnalysis = buildQueryAnalysisFromFormData(formData)
        setQueryAnalysis(queryAnalysis)
        setActiveTerms(queryAnalysis?.usedTerms)
        setResults(results as unknown[])
      }

      setActiveLocation(location)
      setActiveRadius(radius)

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
        color: 'error',
        icon: 'i-lucide-search-x'
      })
    } finally {
      setSearchPending(false)
      updateMostRecent(locationData, queryData)
    }
  }

  return {
    searchState,
    sortSelectOpen,
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
    fetchHash,
    isLoading: readonly(isLoading),
  };
}

export const useSearchState = () => {
  if (!instance) {
    instance = createSearchState();
  }
  return instance;
};
