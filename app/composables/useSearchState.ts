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
    if (import.meta.client) {
      sessionId.value =
        sessionStorage.getItem("search-session-id") || crypto.randomUUID();
      sessionStorage.setItem("search-session-id", sessionId.value);
    }
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
    } catch (error) {}
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
    } catch (error) {}
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

  // Public API
  const updateState = async (updates: Partial<SearchState>) => {
    Object.assign(searchState.value, updates);
    await saveToKV(searchState.value);
  };

  const clearState = async () => {
    searchState.value = { ...defaultState };
    await clearKV();
  };

  const refreshFromKV = async (): Promise<SearchState | null> => {
    if (!import.meta.client) return null;

    isLoading.value = true;
    const stored = await loadFromKV();
    if (stored) {
      searchState.value = { ...defaultState, ...stored };
      isLoading.value = false;
      return stored;
    }
    isLoading.value = false;
    return null;
  };

  return {
    searchState: readonly(searchState),
    isLoading: readonly(isLoading),
    updateState,
    clearState,
    refreshFromKV,
  };
}

export const useSearchState = () => {
  if (!instance) {
    instance = createSearchState();
  }
  return instance;
};
