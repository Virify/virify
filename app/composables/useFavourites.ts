/**
 * Favourites Composable
 *
 * @returns { addToFavourites }
 */
export function useFavourites() {
  /**
   * Add a listing to the user's favourites
   *
   * @param listingId - The ID of the listing to add to favourites
   */
  const addToFavourites = async (listingId: number) => {
    try {
      console.log("Adding to favourites:", listingId);
      await $fetch(`/api/favourite/update/${listingId}`, {
        method: "POST",
        body: { listing: listingId },
      });
      console.log("Successfully added to favourites:", listingId);
    } catch (error) {
      console.error("Error adding to favourites:", error);
      throw error;
    }
  };

  /**
   * Get all favourite listings for the user
   * @returns {Promise<ListingWithFullProperty[]>} - A promise that resolves to an array of favourite listings
   */
  const getFavourites = async (): Promise<ListingWithFullProperty[]> => {
    try {
      const { listings } = await $fetch<{ listings: ListingWithFullProperty[] }>("/api/favourite/get/all");
      return listings;
    } catch (error) {
      console.error("Error fetching favourites:", error);
      throw error;
    }
  };

  /**
   * Deletes ALL favourites for the user
   *
   * @returns {Promise<void>} - A promise that resolves when all favourites are removed
   */
  const removeAllFavourites = async () => {
    try {
      await $fetch("/api/favourite/delete/all", {
        method: "DELETE",
      });
      console.log("Successfully removed all favourites");
    } catch (error) {
      console.error("Error removing all favourites:", error);
      throw error;
    }
  };

  /**
   * Remove a listing from the user's favourites
   *
   * @param listingId - The ID of the listing to remove from favourites
   */
  const removeFromFavourites = async (listingId: number) => {
    try {
      console.log("Removing from favourites:", listingId);
      await $fetch(`/api/favourite/delete/${listingId}`, {
        method: "DELETE",
        body: { listing: listingId },
      });
      console.log("Successfully removed from favourites:", listingId);
    } catch (error) {
      console.error("Error removing from favourites:", error);
      throw error;
    }
  };

  return {
    addToFavourites,
    getFavourites,
    removeAllFavourites,
    removeFromFavourites
  };
}
