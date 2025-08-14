import { getSimilarListings, getFullListingById } from "~~/layers/database/server/utils/listing";

// Helper to fetch cached similar listings (1 day)
const getCachedSimilarListings = defineCachedFunction(async (listing: any, count: number) => {
  return await getSimilarListings(listing, count);
}, {
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  name: 'similarListings',
  getKey: (listing, count) => `similarListings:${listing.id}:${count}`,
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Listing ID",
    });
  }

  // Get the base listing info needed for similar listings lookup
  const listing = await getFullListingById(Number(id));
  
  if (!listing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Listing not found",
    });
  }

  // Fetch cached similar listings
  const similarListings = await getCachedSimilarListings(listing, 10);

  return similarListings;
});