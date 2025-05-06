import { getAllFeaturedListings } from "../../utils/listing";
import * as z from "zod";

const querySchema = z.object({
  pageSize: z.coerce.number().min(1).max(100).optional(),
  page: z.coerce.number().min(1).max(100).optional(),
});

export default defineEventHandler(async (event): Promise<ListingWithFullProperty[] | undefined> => {
  const { errorResponse } = useResponse();

  try {
    const { page = 1, pageSize = 10 } = await getValidatedQuery(event, querySchema.parse);

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const listings = await getAllFeaturedListings(take, skip);

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