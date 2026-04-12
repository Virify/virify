import { ViewsDialogLogin } from "#components";
import { performOptimisticUpdate, performPendingRemoval } from "~/utils/optimistic-update";

// Track items pending removal (for visual feedback) - Share across instances
const pendingRemoval = ref<Set<number>>(new Set());

export const useFavourites = () => {
  const { loggedIn, user } = useUserSession();
  const { showDialog } = useDialog();
  const toast = useToast();
  const requestFetch = useRequestFetch();

  // Use Shared Global Lookups
  const { favouriteLookups, refreshFavourites } = useFavouriteLookups();
  // Use Shared Recent Items
  const { recentFavourites, refreshRecentFavourites, recentFavouritesStatus } = useDashboardRecentItems();

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
    trackFavourite(listingId, "add");

    await performOptimisticUpdate({
      ref: favouriteLookups,
      optimisticChange: (current) => [...current, listingId],
      operation: async () => {
        await requestFetch(`/api/user/favourites/${listingId}/`, {
          method: "POST",
          body: { listingId },
        });
      },
      onSuccess: () => {
        refreshFavourites();
        toast.add({ title: "Added to favourites", color: "success", icon: "i-lucide-heart" });
      },
      onError: (error) => {
        toast.add({ title: "Error", description: "Failed to add to favourites", color: "error", icon: "i-lucide-heart-crack" });
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
    trackFavourite(listingId, "remove");

    await performPendingRemoval({
      pendingSet: pendingRemoval,
      id: listingId,
      operation: async () => {
        await requestFetch(`/api/user/favourites/${listingId}/`, {
          method: "DELETE",
          body: { listingId },
        });
      },
      onSuccess: () => {
        // Optimistically remove from global lookups immediately
        favouriteLookups.value = favouriteLookups.value.filter((id) => id !== listingId);
        refreshFavourites();
        toast.add({ title: "Removed from favourites", color: "success", icon: "i-lucide-heart-off" });
      },
      onError: (error) => {
        toast.add({ title: "Error", description: "Failed to remove from favourites", color: "error", icon: "i-lucide-heart-crack" });
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
   * Toggle favourite - add if not favourite, remove if favourite
   */
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
    toggleFavourite,
    recentFavourites,
    refreshRecentFavourites,
    refreshFavourites,
    isLoading: computed(() => recentFavouritesStatus.value === "pending"),
  };
};
