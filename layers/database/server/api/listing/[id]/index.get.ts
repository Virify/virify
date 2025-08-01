import type { ListingWithSimilar } from "~~/shared/types/listing";
import { getSimilarListings, getFullListingById } from "~~/layers/database/server/utils/listing";


// Helper to fetch cached listing (1 year)
const getCachedListing = defineCachedFunction(async (id: number) => {
  return await getFullListingById(id);
}, {
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  name: 'listing',
  getKey: (id) => `listing:${id}`,
});

// Helper to fetch cached similar listings (1 day)
const getCachedSimilarListings = defineCachedFunction(async (listing: any, count: number) => {
  return await getSimilarListings(listing, count);
}, {
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  name: 'similarListings',
  getKey: (listing, count) => `similarListings:${listing.id}:${count}`,
});

export default defineEventHandler(async (event): Promise<ListingWithSimilar> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Listing ID",
    });
  }

  // Fetch cached listing
  const listing = await getCachedListing(Number(id));

  if (!listing) {
    throw createError({
      statusCode: 404,
      statusMessage: "listing not found",
    });
  }

  // Fetch cached similar listings (1 day)
  const similarListings = await getCachedSimilarListings(listing, 10);

  return {
    listing,
    similarListings,
  };
});
