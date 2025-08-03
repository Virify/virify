import { getFullListingById } from "~~/layers/database/server/utils/listing";

// Helper to fetch cached listing (1 year)
const getCachedListing = defineCachedFunction(async (id: number) => {
  return await getFullListingById(id);
}, {
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  name: 'listing',
  getKey: (id) => `listing:${id}`,
});

export default defineEventHandler(async (event) => {
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

  return { listing };
});
