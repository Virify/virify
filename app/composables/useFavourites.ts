import { ViewsDialogLogin } from "#components";
import { createSharedComposable } from "@vueuse/core";

/**
 * Favourites Composable
 *
 * @returns { addToFavourites }
 */
export const useFavourites = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  // Lightweight shared search / category state (favourites + notes share util)
  const searchTerm = ref("");
  const categoryFilter = ref<"all" | "sale" | "rental">("all");

  /**
   * State Management
   */
  const { data: favourites, refresh: refreshFavourites } = useAsyncData<UserFavouriteListingCard[]>(
    "favourites",
    () => {
      // Only make API call if user is logged in
      if (!loggedIn.value) {
        return Promise.resolve([]);
      }
      return useRequestFetch()<UserFavouriteListingCard[]>("/api/user/favourites/");
    },
    {
      default: () => [],
      watch: [loggedIn],
      server: false, // Prevent server-side execution
    }
  );

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

  const recentFavourites = computed(() => {
    return favourites.value
      .filter((item) => {
        const createdAt = new Date(item.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt >= sevenDaysAgo;
      })
      .slice(0, 6);
  });

  /**
   * Is a listing a favourite
   *
   * @param listingId - ID of the Listing
   * @returns
   */
  function isFavourite(listingId: number): boolean {
    return favourites.value.some((listing) => listing.listing.id === listingId);
  }

  /**
   * Adds a listing to the user's favourites and updates the state.
   * Updates the favourites state with the new listing ID.
   *
   * @param listingId - The ID of the listing to add to favourites
   * @returns Array of favourited listing IDs
   */
  const addToFavourite = async (listingId: number) => {
    // prompt user to login if not logged in
    if (!loggedIn.value) {
      showDialog({
        component: ViewsDialogLogin,
      });
      return;
    }

    try {
      await $fetch<UserFavouriteListingCard[]>(`/api/user/favourites/${listingId}/`, {
        method: "POST",
        body: { listingId },
      });
      await refreshFavourites();

      // Show success toast
      showToast("Added to favourites", { type: "success" });
    } catch (error) {
      // Show error toast
      showToast("Failed to add to favourites", { type: "error" });
      console.error("Error adding to favourites:", error);
    }
  };

  /**
   * Remove a listing from the user's favourites
   * Removes the listing ID from the favourites state.
   *
   * @param listingId - The ID of the listing to remove from favourites
   * @returns Array of remaining favourite listing IDs or empty array on error
   */
  const removeFromFavourite = async (listingId: number) => {
    try {
      const result = await $fetch<number[]>(`/api/user/favourites/${listingId}/`, {
        method: "DELETE",
        body: { listingId },
      });
      if (result) {
        await refreshFavourites();

        // Show success toast
        showToast("Removed from favourites", { type: "success" });
      }
    } catch (error) {
      // Show error toast
      showToast("Failed to remove from favourites", { type: "error" });
      console.error("Error removing from favourites:", error);
    }
  };

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
    removeFromFavourite,
    removeListingFromArray,
    toggleFavourite,
    favourites,
    recentFavourites,
    saleFavourites,
    rentalFavourites,
    filteredFavourites,
    refreshFavourites,
    searchTerm,
    categoryFilter,
  };
});
