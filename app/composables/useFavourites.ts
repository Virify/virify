import { ViewsDialogLogin } from "#components";
import { performOptimisticUpdate, performPendingRemoval } from "~/utils/optimistic-update";

// Track items pending removal (for visual feedback) - Share across instances
const pendingRemoval = ref<Set<number>>(new Set());

/**
 * Favourites Composable
 * 
 * Manages user's favourite listings with optimistic updates for seamless UX.
 * Uses lightweight lookups for efficient isFavourite checks across the app.
 *
 * @returns Favourites state and actions
 */
export const useFavourites = () => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();
  const toast = useToast();
  const requestFetch = useRequestFetch();

  // Lightweight shared search / category state (favourites + notes share util)
  const searchTerm = ref("");
  const categoryFilter = ref<"all" | "sale" | "rental">("all");

  // Pagination state for dashboard
  const total = ref(0);
  const loading = ref(false);

  // Use Shared Global Lookups
  const { favouriteLookups, refreshFavourites } = useFavouriteLookups();
  // Use Shared Recent Items
  const { recentFavourites, refreshRecentFavourites, recentFavouritesStatus } = useDashboardRecentItems();

  /**
   * Full favourites data (for dashboard pages with pagination)
   */
  const favourites = ref<UserFavouriteListingCard[]>([]);

  // Track current pagination state for refetching after add/remove
  const currentFilter = ref<'all' | 'sale' | 'rent'>('all');
  const currentPage = ref(1);
  const currentSort = ref<'newest' | 'oldest'>('newest');
  const currentLimit = ref(20);

  /**
   * Fetch favourites with pagination, sort, and filter (for dashboard)
   */
  async function fetchFavourites(
    filter: 'all' | 'sale' | 'rent' = 'all',
    page: number = 1,
    sort: 'newest' | 'oldest' = 'newest',
    limit: number = 20
  ) {
    // Store current pagination state
    currentFilter.value = filter;
    currentPage.value = page;
    currentSort.value = sort;
    currentLimit.value = limit;

    loading.value = true;
    try {
      const data = await requestFetch<{ favourites: UserFavouriteListingCard[], total: number }>(
        `/api/user/favourites/all/full?filter=${filter}&sort=${sort}&page=${page}&limit=${limit}`
      );
      favourites.value = data.favourites || [];
      total.value = data.total || 0;
    } catch (error) {
      console.error('Error fetching favourites:', error);
      favourites.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refetch current page (used after add/remove when dashboard is active)
   */
  async function refetchCurrentPage() {
    if (favourites.value.length > 0 || total.value > 0) {
      await fetchFavourites(currentFilter.value, currentPage.value, currentSort.value, currentLimit.value);
    }
  }

  const saleFavourites = computed(() => {
    return favourites.value.filter((item) => item.listing.saleListing);
  });

  const rentalFavourites = computed(() => {
    return favourites.value.filter((item) => item.listing.rentalListing);
  });

  // Filter favourites (category first then text) via shared util
  const filteredFavourites = computed(() => {
    let list = favourites.value || [];
    if (categoryFilter.value === "sale") list = list.filter((f) => f.listing.saleListing);
    else if (categoryFilter.value === "rental") list = list.filter((f) => f.listing.rentalListing);
    return filterListingItems(list, searchTerm.value);
  });

  /**
   * Is a listing a favourite (uses lightweight lookups)
   *
   * @param listingId - ID of the Listing
   * @returns
   */
  function isFavourite(listingId: number): boolean {
    return favouriteLookups.value.includes(listingId);
  }

  /**
   * Add a listing to the user's favourites
   * 
   * Uses optimistic updates: the UI updates immediately while the API call
   * happens in the background. If the API call fails, the change is rolled back.
   *
   * @param listingId - The ID of the listing to add to favourites
   */
  const addToFavourite = async (listingId: number) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }

    // Track the favourite action
    const { trackFavourite } = useAnalyticsTracking();
    trackFavourite(listingId, 'add');

    await performOptimisticUpdate({
      ref: favouriteLookups,
      optimisticChange: (current) => [...current, listingId],
      operation: async () => {
        await $fetch(`/api/user/favourites/${listingId}/`, {
          method: "POST",
          body: { listingId },
        });
      },
      onSuccess: () => {
        refreshFavourites();
        refetchCurrentPage();
        toast.add({ title: 'Success', description: "Added to favourites", color: 'success' });
      },
      onError: (error) => {
        toast.add({ title: 'Error', description: "Failed to add to favourites", color: 'error' });
        console.error("Error adding to favourites:", error);
      },
    });
  };

  /**
   * Remove a listing from the user's favourites
   * 
   * Uses pending removal pattern: the item is marked as "pending" (showing a
   * visual overlay), then the delete happens. The item stays visible but marked
   * as removed until the user navigates away or refreshes.
   *
   * @param listingId - The ID of the listing to remove from favourites
   */
  const removeFromFavourite = async (listingId: number) => {
    // Only remove locally if it exists in the lookups
    if (!favouriteLookups.value.includes(listingId)) return;

    // Track the favourite action
    const { trackFavourite } = useAnalyticsTracking();
    trackFavourite(listingId, 'remove');

    await performPendingRemoval({
      pendingSet: pendingRemoval,
      id: listingId,
      operation: async () => {
        await $fetch(`/api/user/favourites/${listingId}/`, {
          method: "DELETE",
          body: { listingId },
        });
      },
      onSuccess: () => {
        toast.add({ title: 'Success', description: "Removed from favourites", color: 'success' });
        // Optimistically remove from global lookups immediately
        favouriteLookups.value = favouriteLookups.value.filter(id => id !== listingId);
        refreshFavourites();
      },
      onError: (error) => {
        toast.add({ title: 'Error', description: "Failed to remove from favourites", color: 'error' });
        console.error("Error removing from favourites:", error);
      },
    });
  };

  /**
   * Check if a listing is pending removal
   */
  function isPendingRemoval(listingId: number): boolean {
    return pendingRemoval.value.has(listingId);
  }

  /**
   * Remove a listing from an array of favourite Listings
   */
  function removeListingFromArray(dToRemove: number) {
    return favourites.value?.filter((d) => d.listing.id !== dToRemove);
  }

  // Add a toggleFavourite method to useFavourites composable
  const toggleFavourite = async (listingId: number) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }
    if (isFavourite(listingId)) {
      await removeFromFavourite(listingId);
    } else {
      await addToFavourite(listingId);
    }
  };

  return {
    addToFavourite,
    isFavourite,
    isPendingRemoval,
    removeFromFavourite,
    removeListingFromArray,
    toggleFavourite,
    favourites,
    recentFavourites,
    refreshRecentFavourites,
    saleFavourites,
    rentalFavourites,
    filteredFavourites,
    refreshFavourites,
    fetchFavourites,
    total,
    loading,
    searchTerm,
    categoryFilter,
    isLoading: computed(() => loading.value || recentFavouritesStatus.value === 'pending'),
  };
};
