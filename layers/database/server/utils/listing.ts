import { ListingTier, type Listing } from "@prisma/client";
import type { ListingRentalWithFullProperty, ListingSaleWithFullProperty, ListingWithFullProperty } from "~~/shared/types/listing";
import { propertyInclude } from "./property";
import { getPriceFilter } from "./price";
import { getNearbyPropertiesByTextQuery } from "./location";

/**
 * Get a listing by ID
 *
 * @param id number
 * @returns Listing
 */
export async function getListingById(id: number): Promise<Listing | null> {
  return await prisma.listing.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Get a full listing by ID including property details
 *
 * @param id number
 * @returns ListingWithFullProperty
 */
export async function getFullListingById(id: number): Promise<ListingWithFullProperty | null> {
  return await prisma.listing.findUnique({
    where: {
      id,
    },
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
    },
  });
}

/**
 * Get featured listings
 *
 * @returns ListingWithFullProperty[]
 */
export async function getAllFeaturedListings(amount: number = 9): Promise<ListingWithFullProperty[] | undefined> {
  return await prisma.listing.findMany({
    where: {
      listingTier: ListingTier.FEATURED,
    },
    take: amount,
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
    },
  });
}

/**
 * Get All Listings
 *
 * @returns Listing[]
 */
export async function getAllListings(): Promise<ListingWithFullProperty[]> {
  return await prisma.listing.findMany({
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
    },
  });
}

/**
 * Get Listings by Property IDs
 *
 * @param propertyIds number[]
 * @returns ListingWithFullProperty[]
 */
export async function getAllListingsByPropertyIds(propertyIds: number[]): Promise<ListingWithFullProperty[]> {
  return await prisma.listing.findMany({
    where: {
      propertyId: {
        in: propertyIds,
      },
    },
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
    },
  });
}

/**
 * Get Sale Listings by Property IDs
 *
 * @param propertyIds number[]
 * @returns ListingWithFullProperty[]
 */
export async function getSaleListingsByDistance(location: string, radius: number, propertyTypes?: string[], priceRange?: number[], bedrooms?: number[], bathrooms?: number[]): Promise<ListingSaleWithFullProperty[]> {
  const nearbyProperties = await getNearbyPropertiesByTextQuery(location, radius);

  return await prisma.listing.findMany({
    where: {
      saleListing: {
        isNot: null,
      },
      price: getPriceFilter(priceRange),
      property: {
        id: {
          in: nearbyProperties.map((p) => p.propertyId),
        },
        type: {
          name: {
            in: propertyTypes,
          },
        },
        numberBedrooms: bedrooms
          ? {
              gte: bedrooms[0], // min bedroom
              lte: bedrooms[1], // max bedroom
            }
          : undefined,
        numberBathrooms: bathrooms
          ? {
              gte: bathrooms[0], // min bathroom
              lte: bathrooms[1], // max bathroom
            }
          : undefined,
      },
    },
    include: {
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
    },
  });
}

/**
 * Get Rental Listings by Property IDs
 *
 * @param propertyIds number[]
 * @returns ListingWithFullProperty[]
 */
export async function getRentalListingsByDistance(location: string, radius: number, propertyTypes?: string[], priceRange?: number[], bedrooms?: number[], bathrooms?: number[]): Promise<ListingRentalWithFullProperty[]> {
  const nearbyProperties = await getNearbyPropertiesByTextQuery(location, radius);
  return await prisma.listing.findMany({
    where: {
      rentalListing: {
        isNot: null,
      },
      price: getPriceFilter(priceRange),
      property: {
        id: {
          in: nearbyProperties.map((p) => p.propertyId),
        },
        type: {
          name: {
            in: propertyTypes,
          },
        },
        numberBedrooms: bedrooms
          ? {
              gte: bedrooms[0], // min bedroom
              lte: bedrooms[1], // max bedroom
            }
          : undefined,
        numberBathrooms: bathrooms
          ? {
              gte: bathrooms[0], // min bathroom
              lte: bathrooms[1], // max bathroom
            }
          : undefined,
      },
    },
    include: {
      rentalListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
    },
  });
}
