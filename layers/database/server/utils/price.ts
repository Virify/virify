import type { MinMaxPrice } from "~~/shared/types/price";

/**
 * Retrieves the minimum and maximum price of sale listings from the database.
 * 
 * @returns { MinMaxPrice }
 */
export async function getMinMaxPriceBySaleListings(): Promise<MinMaxPrice> {
  const minMaxPrice = await prisma.listing.aggregate({
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
    where: {
      saleListing: {
        isNot: null,
      },
    }
  });
  
  return [
    minMaxPrice._min.price ?? 0,
    minMaxPrice._max.price ?? 0,
  ]
}

/**
 * Retrieves the minimum and maximum price of rental listings from the database.
 * 
 * @returns { MinMaxPrice }
 */
export async function getMinMaxPriceByRentalListings(): Promise<MinMaxPrice> {
  const minMaxPrice = await prisma.listing.aggregate({
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
    where: {
      rentalListing: {
        isNot: null,
      },
    }
  });
  
  return [
    minMaxPrice._min.price ?? 0,
    minMaxPrice._max.price ?? 0
  ]
}