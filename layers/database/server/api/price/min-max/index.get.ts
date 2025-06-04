import type { MinMaxPriceResponse } from "~~/shared/types/price";

/**
 * Retrieves the minimum and maximum price of sale and rental listings from the database.
 * 
 * @returns { MinMaxPriceResponse }
 */
export default defineEventHandler(async (event): Promise<MinMaxPriceResponse | undefined> => {
  const { errorResponse } = useResponse();
  try {
    const saleMinMax = await getMinMaxPrice('sales');
    const rentalMinMax = await getMinMaxPrice('rentals');

    if (!saleMinMax || !rentalMinMax) throw createError({ statusCode: 500, statusMessage: "Failed to retrieve min and max prices" });

    return {
      sale: saleMinMax,
      rental: rentalMinMax,
    };
  } catch (error) {
    console.error("Error fetching min and max prices:", error);
    errorResponse(error, event);
  }
});
