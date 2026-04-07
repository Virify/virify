import { ViewsDialogLogin, ViewsDialogHideListing } from "#components";
import { performOptimisticUpdate } from "~/utils/optimistic-update";

/**
 * Hidden Listings Composable
 *
 * Manages a user's hidden listings with optimistic updates for seamless UX.
 * Uses lightweight lookups for efficient isHidden checks across the app.
 */
export const useHiddenListings = () => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();
  const toast = useToast();
  const requestFetch = useRequestFetch();
  const { fetchUserItemsAggregates } = useNotifications();

  const { hiddenListingLookups, refreshHiddenListings } = useHiddenListingLookups();

  /**
   * Full hidden listings data (for dashboard pages with pagination)
   */
  const hiddenListings = ref<UserHiddenListingCard[]>([]);

  // Pagination state for dashboard
  const total = ref(0);
  const loading = ref(false);

  // Track current pagination state for refetching after unhide
  const currentFilter = ref<'all' | 'sale' | 'rent'>('all');
  const currentPage = ref(1);
  const currentSort = ref<'newest' | 'oldest'>('newest');
  const currentLimit = ref(20);

  /**
   * Fetch hidden listings with pagination, sort, and filter (for dashboard)
   */
  async function fetchHiddenListings(
    filter: 'all' | 'sale' | 'rent' = 'all',
    page: number = 1,
    sort: 'newest' | 'oldest' = 'newest',
    limit: number = 20
  ) {
    currentFilter.value = filter;
    currentPage.value = page;
    currentSort.value = sort;
    currentLimit.value = limit;

    loading.value = true;
    try {
      const data = await requestFetch<{ hiddenListings: UserHiddenListingCard[], total: number }>(
        `/api/user/hidden-listings/all/full?filter=${filter}&sort=${sort}&page=${page}&limit=${limit}`
      );
      hiddenListings.value = data.hiddenListings || [];
      total.value = data.total || 0;
    } catch (error) {
      console.error('Error fetching hidden listings:', error);
      hiddenListings.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refetch current page (used after unhide when dashboard is active)
   */
  async function refetchCurrentPage() {
    if (hiddenListings.value.length > 0 || total.value > 0) {
      await fetchHiddenListings(currentFilter.value, currentPage.value, currentSort.value, currentLimit.value);
    }
  }

  /**
   * Check if a listing is hidden by the current user
   */
  function isHidden(listingId: number): boolean {
    return hiddenListingLookups.value.includes(listingId);
  }

  /**
   * Hide a listing for the current user.
   *
   * Uses optimistic update: lookup is updated immediately so the overlay
   * appears instantly, while the API call runs in the background.
   * Rolls back on failure.
   */
  const hideListing = async (listingId: number, reason?: string) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }

    await performOptimisticUpdate({
      ref: hiddenListingLookups,
      optimisticChange: (current) => [...current, listingId],
      operation: async () => {
        await requestFetch(`/api/user/hidden-listings/${listingId}/`, {
          method: "POST",
          body: { listingId, reason },
        });
      },
      onSuccess: () => {
        refreshHiddenListings();
        fetchUserItemsAggregates(true).catch(() => {});
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: "Failed to hide listing",
          color: "error",
          icon: "i-lucide-eye-off",
        });
        console.error("Error hiding listing:", error);
      },
    });
  };

  /**
   * Unhide a listing for the current user.
   *
   * Removes it from lookups optimistically so the overlay disappears
   * instantly, while the DELETE runs in the background. Rolls back on failure.
   */
  const unhideListing = async (listingId: number) => {
    if (!loggedIn.value) return;

    await performOptimisticUpdate({
      ref: hiddenListingLookups,
      optimisticChange: (current) => current.filter((id) => id !== listingId),
      operation: async () => {
        await requestFetch(`/api/user/hidden-listings/${listingId}/`, {
          method: "DELETE",
          body: { listingId },
        });
      },
      onSuccess: () => {
        refreshHiddenListings();
        refetchCurrentPage();
        fetchUserItemsAggregates(true).catch(() => {});
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: "Failed to unhide listing",
          color: "error",
          icon: "i-lucide-eye",
        });
        console.error("Error unhiding listing:", error);
      },
    });
  };

  /**
   * Open the hide listing dialog. Redirects to login dialog if not authenticated.
   */
  const showHideDialog = (listingId: number) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }

    showDialog({ component: ViewsDialogHideListing, props: { listingId } });
  };

  return {
    isHidden,
    hideListing,
    unhideListing,
    showHideDialog,
    hiddenListings,
    fetchHiddenListings,
    total,
    loading,
  };
};
