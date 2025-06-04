import type { ListingWithFullProperty } from "~~/shared/types/listing";

export default defineEventHandler(async (event): Promise<ListingWithFullProperty> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Listing ID",
    });
  }
  try {
    const listing = await getFullListingById(Number(id));

    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: "listing not found",
      });
    }

    return listing
  } catch (error) {
    throw error;
  }
});
