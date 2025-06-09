import { ViewsDialogLogin } from "#components";
import { fa } from "@faker-js/faker";
import { createSharedComposable } from "@vueuse/core";
import type { UserFavouriteListingCard } from "~~/shared/types/user-favourite-listing";

/**
 * Favourites Composable
 *
 * @returns { addToFavourites }
 */
export const useFavourites = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();

  /**
   * State Management
   */
  const favourites = useState<UserFavouriteListingCard[]>("favourites", () => []);
  const recentFavourites = useState<UserFavouriteListingCard[]>("recentFavourites", () => []);

  /**
   * Get all favourite listings for the user
   * This triggers onMount of user Login
   *
   * @returns Array of ListingCardType empty array on error
   */
  const getAllFavourites = async () => {
    if (loggedIn.value) {
      const result = await $fetch<UserFavouriteListingCard[]>("/api/user/favourites/");
      favourites.value = result
      getRecentFavourites();
    }
  };

  /**
   * Get recent favourite listings for the user
   */
  const getRecentFavourites = async () => {
    if (loggedIn.value) {
      recentFavourites.value = favourites.value
        .filter((item) => {
          const createdAt = new Date(item.createdAt);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return createdAt >= sevenDaysAgo;
        })
        .slice(0, 5); // Get only the most recent 5
    }
  };

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

    await $fetch<UserFavouriteListingCard[]>(`/api/user/favourites/${listingId}/`, {
      method: "POST",
      body: { listingId },
    });
    await getAllFavourites();
  };

  /**
   * Remove a listing from the user's favourites
   * Removes the listing ID from the favourites state.
   *
   * @param listingId - The ID of the listing to remove from favourites
   * @returns Array of remaining favourite listing IDs or empty array on error
   */
  const removeFromFavourite = async (listingId: number) => {
    const result = await $fetch<number[]>(`/api/user/favourites/${listingId}/`, {
      method: "DELETE",
      body: { listingId },
    });
    if (result) {
      favourites.value = removeListingFromArray(listingId) || [];
    }
  };

  /**
   * Remove a listing from an array of favourite Listings
   */
  function removeListingFromArray(dToRemove: number) {
    return favourites.value?.filter((d) => d.listing.id !== dToRemove);
  }

  /**
   * Watch for changes in the loggedIn state
   * This is already under a provided composable via isLoggedIn, I think this is fine
   */
  watch(loggedIn, async (isLoggedIn) => {
    if (isLoggedIn) {
      await getAllFavourites();
    }
    if (!isLoggedIn) {
      favourites.value = [];
    }
  });

  /**
   * On mount, check if the user is logged in and fetch favourites
   */
  onMounted(async () => {
    if (loggedIn.value) {
      await getAllFavourites();
    }
  });

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
    getAllFavourites,
    getRecentFavourites,
    isFavourite,
    removeFromFavourite,
    removeListingFromArray,
    toggleFavourite,
    favourites,
    recentFavourites,
  };
});
