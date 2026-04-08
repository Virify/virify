import { ViewsDialogLogin, ViewsDialogHideListing } from "#components";
import { performOptimisticUpdate } from "~/utils/optimistic-update";

/**
 * Hidden Listings Composable
 *
 * Manages a user's hidden listings with optimistic updates for seamless UX.
 * Uses lightweight lookups for efficient isHidden checks across the app.
 */
export const useHiddenListings = () => {
  const { loggedIn, user } = useUserSession();
  const { showDialog } = useDialog();
  const toast = useToast();
  const requestFetch = useRequestFetch();
  const { fetchUserItemsAggregates } = useNotifications();

  const { hiddenListingLookups, refreshHiddenListings } = useHiddenListingLookups();

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
        refreshNuxtData((key) => typeof key === "string" && key.startsWith(`hidden:${user.value?.id}`));
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
  };
};
