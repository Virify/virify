export type SortOrder = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'relevance'
export type ResultLayout = 'map' | 'grid' | 'split'

/**
 * KV-backed search state management
 *
 * Features:
 * - Server-side KV storage with automatic cleanup on tab close
 * - Tab-specific session IDs for independent search states
 * - Automatic restoration on page load/refresh/back button
 * - Reactive state updates across all consumers
 */

const defaultState = defaultSearchState;

// Singleton instance
let instance: ReturnType<typeof createSearchState> | null = null;

function createSearchState() {
  const searchState = ref<SearchState>({ ...defaultState });
  const sessionId = ref<string>("");
  const isLoading = ref(false);

  // Generate or restore session ID (unique per tab)
  const initSessionId = () => {
    if (!import.meta.client) return

    sessionId.value =
      sessionStorage.getItem("search-session-id") || crypto.randomUUID();

    sessionStorage.setItem("search-session-id", sessionId.value);
  };

  // Save to KV storage
  const saveToKV = async (state: SearchState) => {
    if (!sessionId.value || isLoading.value) {
      return;
    }

    try {
      await $fetch("/api/search-state", {
        method: "POST",
        body: { sessionId: sessionId.value, state },
      });

    } catch (error) { }
  };

  // Load from KV storage
  const loadFromKV = async (): Promise<SearchState | null> => {
    if (!sessionId.value) {
      return null;
    }

    try {
      const stored = await $fetch("/api/search-state", {
        query: { sessionId: sessionId.value },
      });

      return (stored as unknown as SearchState) || null;
    } catch (error) {
      return null;
    }
  };

  // Clear from KV storage
  const clearKV = async () => {
    if (!sessionId.value) return;

    try {
      await $fetch("/api/search-state", {
        method: "DELETE",
        query: { sessionId: sessionId.value },
      });
    } catch (error) { }
  };

  // Initialize on client side
  if (import.meta.client) {
    initSessionId();

    // Delete KV entry when tab closes
    const handleBeforeUnload = async () => {
      try {
        // Use navigator.sendBeacon for reliable cleanup
        if (navigator.sendBeacon && sessionId.value) {
          const url = `/api/search-state?sessionId=${sessionId.value}`;
          navigator.sendBeacon(
            url,
            new Blob([JSON.stringify({ _method: "DELETE" })], {
              type: "application/json",
            })
          );
        }
      } catch (error) {
        // Ignore errors for beacon requests
      }
    };

    // Add event listener for tab close
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener (though this rarely fires on tab close)
    onUnmounted(() => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });
  }

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
   *  Update state layout
   */
  function setLocation(value: GeocodingFeature, callback?: () => void) {
    // Update state
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
  const updateState = async (updates: Partial<SearchState>) => {
    // @TODO maybe replace this with Defu to better handle nested merges?
    Object.assign(searchState.value, updates);

    // Save state
    await saveToKV(searchState.value);
  };

  // @TODO add a button to reset form, then test functionality
  const clearState = async () => {
    searchState.value = { ...defaultState };
    await clearKV();
  };

  const refreshFromKV = async (): Promise<void> => {
    if (!import.meta.client) return;

    setSearchPending(true)

    const stored = await loadFromKV();

    setSearchPending(false)

    if (stored) {
      const newState = { ...defaultState, ...stored }

      // Save new state to ref
      searchState.value = newState;

      // Update AI query analysis
      // @TODO this needs a refactor to reduce coupling
      const { queryAnalysis } = useAi()

      queryAnalysis.value = newState.queryAnalysis
    }
  };

  return {
    searchState,
    setSortOrder,
    setViewMode,
    setLocation,
    setLocationRadius,
    setSearchPending,
    setQuery,
    setQueryAnalysis,
    setResults,
    updateState,
    clearState,
    refreshFromKV,
    isLoading: readonly(isLoading),
  };
}

export const useSearchState = () => {
  if (!instance) {
    instance = createSearchState();
  }
  return instance;
};
