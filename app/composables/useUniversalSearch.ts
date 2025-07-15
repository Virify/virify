export type SortOrder = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'relevance'

interface State {
  location?: Record<any, unknown>,
  locationRadius: number,
  filters?: {
    ai: unknown,
    traditional: unknown
  }
  sortOrder?: SortOrder
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
    locationRadius: 0
  }))

  function setState(key: keyof State, value: unknown) {
    if (key === 'location') {
      state.value.location = value as Record<any, unknown>
    }

    if (key === 'sortOrder') {
      state.value.sortOrder = value as SortOrder
    }
  }

  return {
    state: readonly(state),
    setState
  }
}