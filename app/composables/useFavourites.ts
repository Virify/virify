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

  /**
   * State Management
   */
  const favourites = useState<ListingCardType[]>("favourites", () => []);

  /**
   * Get all favourite listings for the user
   * This triggers onMount of user Login
   *
   * @returns Array of ListingWithFullProperty or empty array on error
   */
  const getAllFavourites = async () => {
    if (loggedIn.value) {
      const result = await $fetch<UserFavouritesListingType>("/api/favourite/get/all");
      favourites.value = result.listings as ListingCardType[];
    }
  };

  /**
   * Is a listing a favourite
   *
   * @param propertyId - ID of the Listing
   * @returns
   */
  function isFavourite(listingId: number): boolean {
    return favourites.value.some((listing) => listing.id === listingId);
  }

  /**
   * Adds a listing to the user's favourites and updates the state.
   * Upadates the favourites state with the new listing ID.
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
    }

    await $fetch<number[]>(`/api/favourite/update/${listingId}`, {
      method: "POST",
      body: { listing: listingId },
    });
    // fetch the updated list of favourites
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
    await $fetch<number[]>(`/api/favourite/delete/${listingId}`, {
      method: "DELETE",
      body: { listing: listingId },
    });
    favourites.value = removeListingFromArray(listingId) || [];
  };

  /**
   * Remove a listing from an array favourite Listings
   */
  function removeListingFromArray(dToRemove: number) {
    return favourites.value?.filter((d) => d.id !== dToRemove);
  }

  /**
   * Watch for changes in the loggedIn state
   * This is already under a provided composable via isLoggedIn I think this is fine
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
