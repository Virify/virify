export function usePaginatedListings<T>(baseUrl: string, pageSize: number = 12, initial: T[] = []) {
  /**
   * State
   */
  const listings: Ref<T[]> = ref([...initial]) as Ref<T[]>;
  const currentPage = ref(1);
  const hasMoreListings = ref(true);
  const isLoading = ref(false);

  /**
   * Fetch more listings
   */
  async function fetchMoreListings() {
    if (isLoading.value) return;
    isLoading.value = true;

    const nextPage = currentPage.value + 1;
    const newListings = await $fetch<T[]>(`${baseUrl}?page=${nextPage}&pageSize=${pageSize}`);

    if (!newListings.length || newListings.length < pageSize) {
      hasMoreListings.value = false;
    }

    listings.value.push(...newListings);
    currentPage.value = nextPage;
    isLoading.value = false;
  }

  return {
    listings,
    currentPage,
    hasMoreListings,
    fetchMoreListings,
    isLoading,
  };
}
