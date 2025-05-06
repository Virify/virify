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

  return [
    Math.round(minMaxPrice._min.price ?? 0),
    Math.round(minMaxPrice._max.price ?? 0)
  ];
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
