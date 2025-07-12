import { useStorage } from '@vueuse/core'

interface SearchState {
  query: string
  location: GeocodingFeature | null
  radius: number
  sortBy: string
  hasSearched: boolean
  results: ListingWithFullProperty[] | null
  queryAnalysis: QueryAnalysis | null
  currentPage: number | null
  totalPages: number | null
  totalResults: number
  whereClause: any
  locationContext: any
  viewMode: 'list' | 'map'
}

const defaultState: SearchState = {
  query: '',
  location: null,
  radius: 0,
  sortBy: 'relevance',
  hasSearched: false,
  results: null,
  queryAnalysis: null,
  currentPage: null,
  totalPages: null,
  totalResults: 0,
  whereClause: null,
  locationContext: null,
  viewMode: 'list'
}

export const useSearchState = () => {
  const searchState = useStorage('ai-search-state', defaultState, undefined, {
    mergeDefaults: true
  })

  const saveSearchState = (state: Partial<SearchState>) => {
    if (import.meta.client) {
      Object.assign(searchState.value, state)
    }
  }

  const clearSearchState = () => {
    if (import.meta.client) {
      searchState.value = { ...defaultState }
    }
  }

  const restoreSearchState = () => {
    if (import.meta.client) {
      return { ...searchState.value }
    }
    return { ...defaultState }
  }

  return {
    searchState: readonly(searchState),
    saveSearchState,
    clearSearchState,
    restoreSearchState
  }
}