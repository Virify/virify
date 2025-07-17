export type SortOrder = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'relevance'
export type ResultLayout = 'map' | 'grid' | 'split'

interface State {
  location?: Partial<GeocodingFeature>,
  locationRadius?: number,
  filters: {
    type: 'ai' | 'traditional'
    options?: unknown[]
  },
  sortOrder?: SortOrder
  layout: ResultLayout
}

// Get initial sort order from utils
const initialSortOrder = selectOptionSortOrder[0]?.value as SortOrder

/**
 *  Composable for managing global search state
 *
 */
export function useUniversalSearch() {
  const state = useState<State>('current-search', () => ({
    location: {},
    locationRadius: 0,
    filters: {
      type: 'ai',
      options: [1, 2, 3]
    },
    sortOrder: initialSortOrder,
    layout: 'grid'
  }))

  /**
   *  Run a callback, if it's valid
   */
  function _runCallback(fn: unknown) {
    if (!isFunction(fn)) return

    fn()
  }

  /**
   *  Update state layout
   */
  function setLocation(value: GeocodingFeature, callback?: () => void) {
    // Update state
    state.value.location = value

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state sort order
   */
  function setAiFilters(value: unknown[], callback?: () => void) {
    // Check value is valid
    if (value && !Array.isArray(value)) return

    // Update state
    state.value.filters.type = 'ai'
    state.value.filters.options = value ?? []

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
    state.value.locationRadius = value

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
    state.value.sortOrder = value

    // Run optional callback
    _runCallback(callback)
  }

  /**
   *  Update state layout
   */
  function setLayout(value: ResultLayout, callback?: () => void) {
    const validValues: ResultLayout[] = ['grid', 'split', 'map']

    // Check value is valid
    if (!validValues.includes(value)) return

    // Update state
    state.value.layout = value

    // Run optional callback
    _runCallback(callback)
  }

  return {
    state,
    setSortOrder,
    setLayout,
    setLocation,
    setLocationRadius,
    setAiFilters
  }
}