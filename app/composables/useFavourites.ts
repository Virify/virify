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
      console.log('Adding to favourites:', listingId);
      await $fetch('/api/favourite/add-to-favourite', {
        method: 'POST',
        body: { listing: listingId },
      });
      console.log('Successfully added to favourites:', listingId);
    } catch (error) {
      console.error('Error adding to favourites:', error);
      throw error;
    }
  };

  // TODO: Remove and IsFavourite

  return {
    addToFavourites,
  };
}