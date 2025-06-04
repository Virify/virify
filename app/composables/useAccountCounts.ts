/**
 * Composable function to manage account notification counts
 */
export function useAccountCounts() {
  const counts = ref<AccountCounts>({});
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Fetch account notification counts from the API
   */
  async function fetchAccountCounts() {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<AccountCounts>('/api/account/counts');
      counts.value = data;
    } catch (err) {
      console.error('Failed to fetch account counts:', err);
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  }
  

  /**
   * Get count for a specific category
   * @param key - The category key 
   * @returns The count for the category or undefined
   */
  function getCount(key?: string): number | undefined {
    if (!key) return undefined;
    return counts.value[key as keyof AccountCounts];
  }

  return {
    counts,
    isLoading,
    error,
    fetchAccountCounts,
    getCount,
  };
}
