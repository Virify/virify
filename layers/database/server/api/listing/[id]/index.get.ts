import {
  getFullListingById,
  getListingByIdForEdit,
} from "~~/layers/database/server/utils/listing";

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

    const listingId = Number(id);

    if (!Number.isInteger(listingId) || listingId < 1) {
      throw createError({
        statusCode: 404,
        statusMessage: "listing not found",
      });
    }

    const storage = useStorage("cache:listing");
    const cacheKey = `listing:${listingId}`;

    // Try to get from cache first
    let listing = await storage.getItem(cacheKey);

    if (!listing) {
      // Fetch from database if not in cache
      listing = await getFullListingById(listingId);

      if (listing) {
        // Cache for 24 hours. TTL is in seconds (unstorage convention).
        // The cache is explicitly invalidated on any listing write (publish,
        // archive, step updates, availability change) via invalidateListingCache().
        await storage.setItem(cacheKey, listing, {
          ttl: 60 * 60 * 24,
        });
      }
    }

    // If no published listing found, check if the authenticated user owns an
    // unpublished/restored version of this listing and return it for editing.
    if (!listing) {
      const session = await getUserSession(event);
      if (session?.user) {
        listing = await getListingByIdForEdit(listingId, session.user as any);
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
