import { z } from "zod";

const limitsSchema = z.object({
  limit: z.coerce.number().int().positive().optional()
});

/**
 * Get All Listings
 *
 * @returns Listing[]
 */
export default defineEventHandler(async (event): Promise<ListingCardType[]> => {
  const { limit } = await getValidatedQuery(event, limitsSchema.parse)

  try {
    const listings = await getAllPublishedListings();

    if (!listings) {
      throw createError({
        statusCode: 404,
        statusMessage: "listings not found",
      });
    }

    if (typeof limit === 'number' && limit > 0) {
      return listings.slice(0, limit)
    }

    return listings;
  } catch (error) {
    throw error;
  }
});
