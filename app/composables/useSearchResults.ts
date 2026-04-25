import { createSharedComposable } from '@vueuse/core'

interface Result {
  [key: string]: unknown
}

interface QueryAnalysis {
  usedTerms?: string[],
  ignoredTerms?: string[],
}

interface SearchResults {
  pending: boolean,
  usedTerms?: string[],
  ignoredTerms?: string[],
  results: Result[],
  hash?: string | null
}

const useSearchResults = createSharedComposable(() => {
  const state = useState<SearchResults>('search-results', () => ({
    pending: false,
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
   *  Set pending state
   */
  function setPendingState(isPending: boolean) {
    state.value.pending = !!isPending
  }

  /**
   *  Interface
   */
  return {
    state,
    setResults,
    setQueryAnalysis,
    setPendingState,
    setResultsHash
  }
})

export default useSearchResults