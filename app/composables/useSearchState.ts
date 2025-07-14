import { useStorage } from '@vueuse/core'

/**
 * Composable for managing persistent search state across the application
 * 
 * This is the single source of truth for all AI search state, providing
 * session-scoped persistence that survives navigation but clears on tab close.
 * 
 * Key Features:
 * - Session-scoped state persistence (sessionStorage, not localStorage)
 * - Automatic state synchronization across all consumers
 * - SSR-compatible initialization with client-side hydration
 * - Graceful fallback handling for storage failures
 * - Deep reactive watching for automatic persistence
 * 
 * State Persistence Strategy:
 * - Uses sessionStorage for temporary persistence within browser session
 * - Automatically cleared when user closes tab or navigates away
 * - Survives page refreshes and back/forward navigation
 * - Provides seamless user experience without losing search context
 * 
 * Integration:
 * - Primary storage for useAiSearchPage state
 * - Can be used directly by components needing search context
 * - Maintains reactivity across all consumers via shared reactive refs
 */

/**
 * Interface defining the complete search state structure
 * All fields are persisted to sessionStorage automatically
 */
interface SearchState {
  /** User's search query text */
  query: string
  /** Selected location from geocoding service */
  location: GeocodingFeature | null
  /** Search radius in kilometers */
  radius: number
  /** Current sort preference (relevance, price_asc, price_desc, etc.) */
  sortBy: string
  /** Flag indicating if user has performed at least one search */
  hasSearched: boolean
  /** Cached search results for navigation preservation */
  results: ListingWithFullProperty[] | null
  /** AI analysis result of the search query */
  queryAnalysis: QueryAnalysis | null
  /** Current page in paginated results */
  currentPage: number | null
  /** Total pages available in current search */
  totalPages: number | null
  /** Total number of results found */
  totalResults: number
  /** Preserved database WHERE clause for pagination consistency */
  whereClause: any
  /** Preserved location context for search refinement */
  locationContext: any
  /** User's preferred view mode for results display */
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
  // Initialize with VueUse's useStorage for SSR compatibility
  // Using undefined storage parameter for default behavior, then override to sessionStorage
  const searchState = useStorage('ai-search-state', defaultState, undefined, {
    mergeDefaults: true,
    serializer: {
      read: (v: any) => {
        try {
          return typeof v === 'string' ? JSON.parse(v) : v
        } catch {
          return defaultState
        }
      },
      write: (v: any) => JSON.stringify(v),
    }
  })
  
  // CLIENT-SIDE ONLY: Override to use sessionStorage instead of localStorage
  // 
  // HOW SESSIONSTORAGE CLEARING WORKS:
  // - sessionStorage persists during page refreshes, back/forward navigation
  // - sessionStorage is AUTOMATICALLY cleared by the browser when:
  //   * User closes the tab
  //   * User closes the entire browser window
  //   * User navigates to a different domain
  // - We don't need to manually clear it - the browser handles this natively
  // - This is different from localStorage which persists forever until manually cleared
  //
  if (import.meta.client && typeof window !== 'undefined') {
    const sessionKey = 'ai-search-state'
    
    // Immediately replace the initial value with sessionStorage data
    // This happens on page load/refresh to restore the previous session state
    searchState.value = (() => {
      try {
        const stored = sessionStorage.getItem(sessionKey)
        return stored ? JSON.parse(stored) : defaultState
      } catch {
        // If sessionStorage is corrupted or unavailable, fall back to defaults
        return defaultState
      }
    })()
    
    // Set up a deep watcher to automatically save any changes to sessionStorage
    // This ensures state persists during navigation within the same session
    watch(searchState, (newValue) => {
      try {
        sessionStorage.setItem(sessionKey, JSON.stringify(newValue))
      } catch (e) {
        // sessionStorage might be disabled or full - fail gracefully
        console.warn('Failed to save to sessionStorage:', e)
      }
    }, { deep: true })
  }

  /**
   * Updates search state with partial data
   * Changes are automatically persisted to sessionStorage via deep watcher
   * 
   * @param state - Partial state object with fields to update
   */
  const saveSearchState = (state: Partial<SearchState>) => {
    if (import.meta.client) {
      Object.assign(searchState.value, state)
    }
  }

  /**
   * Resets all search state to default values
   * Immediately clears sessionStorage through reactive watcher
   */
  const clearSearchState = () => {
    if (import.meta.client) {
      searchState.value = { ...defaultState }
    }
  }

  /**
   * Returns a copy of current search state
   * Safe for reading without causing reactivity side effects
   * 
   * @returns Complete search state object or defaults if on server
   */
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