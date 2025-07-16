export type SortOrder = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'relevance'
export type ResultLayout = 'map' | 'grid' | 'split'

interface State {
  location?: Record<any, unknown>,
  locationRadius: number,
  filters?: {
    ai: unknown,
    traditional: unknown
  }
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
    sortOrder: initialSortOrder,
    locationRadius: 0,
    layout: 'grid'
  }))

  function setState(key: keyof State, value: unknown) {
    if (key === 'location') {
      state.value.location = value as Record<any, unknown>
    }

    if (key === 'sortOrder') {
      state.value.sortOrder = value as SortOrder
    }

    if (key === 'layout') {
      state.value.layout = asString(value) as ResultLayout
    }
  }

  /**
   *  Run a callback, if it's valid
   */
  function _runCallback(fn: unknown) {
    if (!isFunction(fn)) return

    fn()
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
    setState
  }
}