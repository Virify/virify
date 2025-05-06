import { getAllFeaturedListings } from "../../utils/listing";
import * as z from "zod";

const querySchema = z.object({
  amount: z.coerce.number().min(1).max(100).optional(),
});

export default defineEventHandler(async (event): Promise<ListingWithFullProperty[] | undefined> => {
  const { errorResponse } = useResponse();

  try {
    const { amount } = await getValidatedQuery(event, querySchema.parse)
    const listings = await getAllFeaturedListings(amount as number);

    if (!listings) {
      throw createError({
        statusCode: 404,
        statusMessage: "listings not found",
      });
    }
    return listings;
  } catch (error) {
    console.error("Error fetching all listings:", error);
    errorResponse(error, event);
  }
});