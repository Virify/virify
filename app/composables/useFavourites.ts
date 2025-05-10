import { ViewsDialogLogin } from "#components";
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
  const favourites = useState<ListingCardType[]>("favourites", () => []);

  /**
   * Get all favourite listings for the user
   * This triggers onMount of user Login
   *
   * @returns Array of ListingCardType empty array on error
   */
  const getAllFavourites = async () => {
    if (loggedIn.value) {
      const result = await $fetch<UserFavouriteListingCard[]>("/api/user/saved/listing/get/all");
      favourites.value = result.map((fav) => fav.listing) || [];
    }
  };

  /**
   * Is a listing a favourite
   *
   * @param listingId - ID of the Listing
   * @returns
   */
  function isFavourite(listingId: number): boolean {
    return favourites.value.some((listing) => listing.id === listingId);
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

    await $fetch<UserFavouriteListingCard[]>(`/api/user/saved/listing/update/${listingId}`, {
      method: "POST",
      body: { listingId },
    });
    await getAllFavourites()
  };

  /**
   * Remove a listing from the user's favourites
   * Removes the listing ID from the favourites state.
   *
   * @param listingId - The ID of the listing to remove from favourites
   * @returns Array of remaining favourite listing IDs or empty array on error
   */
  const removeFromFavourite = async (listingId: number) => {
    const result = await $fetch<number[]>(`/api/user/saved/listing/delete/${listingId}`, {
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
    return favourites.value?.filter((d) => d.id !== dToRemove);
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

  return {
    addToFavourite,
    getAllFavourites,
    isFavourite,
    removeFromFavourite,
    removeListingFromArray,
  };
});
