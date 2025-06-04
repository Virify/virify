/**
 * Get All Listings
 *
 * @returns Listing[]
 */
export default defineEventHandler(async (event): Promise<ListingCardType[]> => {
  try {
    const listings = await getAllListings();

    if (!listings) {
      throw createError({
        statusCode: 404,
        statusMessage: "listings not found",
      });
    }
    return listings;
  } catch (error) {
    throw error;
  }
});
