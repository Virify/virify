import { ViewsDialogLogin } from "#components";
/**
 * Favourites Composable
 *
 * @returns { addToFavourites }
 */
export function useFavourites() {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();

  /**
   * Add a listing to the user's favourites
   *
   * @param listingId - The ID of the listing to add to favourites
   * @returns Array of favourited listing IDs
   */
  const addToFavourites = async (listingId: number): Promise<number[]> => {
    // open login dialog if not logged in
    if (!loggedIn.value) {
      showDialog({
        component: ViewsDialogLogin,
      });
  
      return [];
    }
  
    return await $fetch<number[]>(`/api/favourite/update/${listingId}`, {
      method: "POST",
      body: { listing: listingId },
    }).catch((error) => {
      console.error("Error adding to favourites:", error);
  
      return []
    })
  }

  /**
   * Get all favourite listings for the user
   *
   * @returns Array of ListingWithFullProperty or empty array on error
   */
  const getFavourites = async (): Promise<ListingWithFullProperty[]> => {
    try {
      const { listings } = await $fetch<{ listings: ListingWithFullProperty[] }>("/api/favourite/get/all");
      return listings;
    } catch (error) {
      console.error("Error fetching favourites:", error);
      return [];
    }
  };

  /**
   * Remove a listing from the user's favourites
   *
   * @param listingId - The ID of the listing to remove from favourites
   * @returns Array of remaining favourite listing IDs or empty array on error
   */
  const removeFromFavourites = async (listingId: number): Promise<number[]> => {
    try {
      const favListings = await $fetch<number[]>(`/api/favourite/delete/${listingId}`, {
        method: "DELETE",
        body: { listing: listingId }, // Optional depending on your backend
      });
      return favListings;
    } catch (error) {
      console.error("Error removing from favourites:", error);
      return [];
    }
  };

  /**
   * Get all favourite listing IDs for the user
   */
  const getUserFavouriteIds = async (userFavourites?: number[]) => {
    return await $fetch<number[]>("/api/favourite/get/all-listing-ids");
  };

  /**
   * Check if a listing is a favourite
   */
  const isFavourite = (listingId: number, favouriteIds: number[]) => {
    return favouriteIds.includes(listingId);
  };

  /**
   * Remove a listing from an array favourite Listings
   */
  function removeListingFromArray(listings: ListingWithFullProperty[], idToRemove: number) {
    return listings.filter((listing) => listing?.id !== idToRemove);
  }

  return {
    addToFavourites,
    getFavourites,
    removeFromFavourites,
    removeListingFromArray,
    isFavourite,
    getUserFavouriteIds,
  };
}
