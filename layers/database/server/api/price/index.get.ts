import * as z from "zod";
import { getAllPricesCached } from "../../utils/price";

const buyOrRentSchema = z.object({
  listingType: z.enum(["buy", "rent"]),
});

/**
 * Get all prices for rentals or sales
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { listingType } = await getValidatedQuery(event, buyOrRentSchema.parse);
    return await getAllPricesCached(listingType);
  } catch (error) {
    console.error("Error fetching all prices:", error);
    return errorResponse(error, event);
  }
});
