import { getFullListingById } from "~~/layers/database/server/utils/listing";

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing Listing ID",
      });
    }

    const storage = useStorage("cache:listing");
    const cacheKey = `listing:${id}`;

    // Try to get from cache first
    let listing = await storage.getItem(cacheKey);

    if (!listing) {
      // Fetch from database if not in cache
      listing = await getFullListingById(Number(id));

      if (listing) {
        // Cache for 1 year
        await storage.setItem(cacheKey, listing, {
          ttl: 1000 * 60 * 60 * 24 * 365,
        });
      }
    }

    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: "listing not found",
      });
    }

    return { listing };
  } catch (error) {
    return errorResponse(error, event);
  }
});
