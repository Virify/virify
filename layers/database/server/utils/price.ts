import type { MinMaxPrice, PriceFilter } from "~~/shared/types/price";

/**
 * Retrieves the minimum and maximum price of sale listings from the database.
 *
 * @returns { MinMaxPrice }
 */
type ListingType = "sales" | "rentals";

export async function getMinMaxPrice(type: ListingType = "sales"): Promise<MinMaxPrice> {
  const listingType = type === "sales" ? "saleListing" : "rentalListing";

  const minMaxPrice = await prisma.listing.aggregate({
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
    where: {
      [listingType]: {
        isNot: null,
      },
    },
  });

  return [Math.round(minMaxPrice._min.price ?? 0), Math.round(minMaxPrice._max.price ?? 0)];
}

/**
 * Generate a price filter object if the price range is valid.
 *
 * @param priceRange number[] | undefined
 * @returns {PriceFilter | undefined} The price filter object or undefined if invalid
 */
export function getPriceFilter(priceRange: number[] | undefined): PriceFilter | undefined {
  if (!priceRange || priceRange.length !== 2 || priceRange[0] === undefined || priceRange[1] === undefined) {
    return undefined;
  }
  return {
    gte: priceRange[0],
    lte: priceRange[1],
  };
}

/**
 * Get All prices for rentals or sales
 *
 * @param type - The type of listing to filter by (sales or rentals)
 * @returns {number[]} An array of prices for the specified listing type
 */
export async function getAllPrices(type: ListingType = "sales"): Promise<number[]> {
  const listingType = type === "sales" ? "saleListing" : "rentalListing";

  const prices = await prisma.listing.findMany({
    where: {
      [listingType]: {
        isNot: null,
      },
    },
    select: {
      price: true,
    },
  });

  return prices.map((price: { price: any; }) => price.price);
}

/**
 * A version of getAllPrices that converts the listing type input format.
 * This is now a regular function without caching.
 * 
 * @param listingType - "buy" or "rent"
 * @returns {Promise<number[]>} The prices for the specified listing type
 */
export const getAllPricesCached = async (listingType: string): Promise<number[]> => {
  return await getAllPrices(listingType === "buy" ? "sales" : "rentals");
};