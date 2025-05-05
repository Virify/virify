import type { MinMaxPrice } from "~~/shared/types/price";

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

  return [minMaxPrice._min.price ?? 0, minMaxPrice._max.price ?? 0];
}
