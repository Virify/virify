/**
 * Use Paginated Listings
 * 
 * @param baseUrl string
 * @param pageSize number
 */
export function usePaginatedListings<T>(baseUrl: string, pageSize: number = 12) {
  /**
   * state
   */
  const listings = ref<T[]>([]);
  const currentPage = ref(1);
  const hasMoreListings = ref(true);

/**
 * Fetch Listings
 */
  async function fetchListings(page: number) {
    const { data } = await useAsyncData(
      `listings-page-${page}`,
      () => $fetch<T[]>(`${baseUrl}?page=${page}&pageSize=${pageSize}`)
    );

    if (!data.value) {
      hasMoreListings.value = false;
    } else {
      hasMoreListings.value = data.value.length === pageSize;
    }

    listings.value = data.value || [];
  }

  /**
   * watchers
   */
  watch(currentPage, (newPage) => {
    fetchListings(newPage);
  });

/** 
 * Initial fetch
 */
  fetchListings(currentPage.value);

  return {
    listings,
    currentPage,
    hasMoreListings,
    fetchListings
  };
}
