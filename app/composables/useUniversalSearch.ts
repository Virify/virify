export type SortOrder = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'relevance'

interface State {
  location?: Record<any, unknown>,
  filters?: {
    ai: unknown,
    traditional: unknown
  }
  sortOrder?: SortOrder
}

export function useUniversalSearch() {
  const state = useState<State>('current-search', () => ({
    sortOrder: selectOptionSortOrder[0]?.value as SortOrder
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