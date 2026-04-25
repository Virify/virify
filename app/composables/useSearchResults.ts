import { createSharedComposable } from '@vueuse/core'

interface Result {
  [key: string]: unknown
}

interface SearchResults {
  pending: boolean,
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
   *  Interface
   */
  return {
    state,
    setResults,
    setResultsHash
  }
})

export default useSearchResults