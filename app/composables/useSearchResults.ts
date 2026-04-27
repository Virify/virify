import { createSharedComposable } from '@vueuse/core'

interface Result {
  [key: string]: unknown
}

interface QueryAnalysis {
  usedTerms?: string[],
  ignoredTerms?: string[],
}

interface SearchResults {
  usedTerms: string[],
  ignoredTerms: string[],
  searchedRadius?: number,
  searchedLocation?: string | null,
  results: Result[],
  hash?: string | null
}

const useSearchResults = createSharedComposable(() => {
  const state = useState<SearchResults>('search-results', () => ({
    usedTerms: [],
    ignoredTerms: [],
    results: []
  }))

  /**
   *  Update results
   */
  function setResults(results: Result[]) {
    if (!Array.isArray(results)) {
      state.value.results = []

      return
    }

    state.value.results = results
  }

  /**
   *  Update hash
   */
  function setResultsHash(str: string) {
    if (!isString(str)) {
      state.value.hash = null

      return
    }

    state.value.hash = str
  }

  /**
   *  Update used and ignored terms
   */
  function setQueryAnalysis(queryAnalysis: QueryAnalysis) {
    const { usedTerms, ignoredTerms } = asObject(queryAnalysis)

    if (isArrayOfStrings(usedTerms)) {
      state.value.usedTerms = usedTerms
    }

    if (isArrayOfStrings(ignoredTerms)) {
      state.value.ignoredTerms = ignoredTerms
    }
  }

  /**
   *  Set location string
   */
  function setSearchedLocation(location?: string) {
    if (!isString(location)) {
      state.value.searchedLocation = null

      return
    }

    state.value.searchedLocation = location
  }

  /**
   *  Set radius number
   */
  function setSearchedRadius(radius?: number | null) {
    if (!radius && radius !== 0) radius = 0

    state.value.searchedRadius = radius
  }

  /**
   *  Expose results, hash, etc.
   */
  const results = computed(() => {
    return state.value.results
  })

  const hash = computed(() => {
    return state.value.hash
  })

  const usedTerms = computed(() => {
    return state.value.usedTerms
  })

  const ignoredTerms = computed(() => {
    return state.value.ignoredTerms
  })

  const searchedLocation = computed(() => {
    return state.value.searchedLocation
  })

  const searchedRadius = computed(() => {
    return state.value.searchedRadius
  })

  /**
   *  Interface
   */
  return {
    state,
    results,
    hash,
    usedTerms,
    ignoredTerms,
    searchedLocation,
    searchedRadius,
    setResults,
    setQueryAnalysis,
    setResultsHash,
    setSearchedLocation,
    setSearchedRadius
  }
})

export default useSearchResults