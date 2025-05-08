import { ListingTier, type Listing } from "@prisma/client";
import type { ListingRentalWithFullProperty, ListingSaleWithFullProperty, ListingSearch, ListingSearchOptional, ListingWithFullProperty } from "~~/shared/types/listing";
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
export async function getAllFeaturedListings(take: number = 20, skip: number = 0): Promise<ListingWithFullProperty[] | undefined> {
  return await prisma.listing.findMany({
    where: {
      listingTier: ListingTier.FEATURED,
    },
    take,
    skip,
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

// TODO: Add include and popular filters
export async function getListingByDistanceAndFilters(
  { buyOrRent, location, radius }: ListingSearch,
  { propertyTypes, priceRange, bedrooms, bathrooms, addedToSite, take, skip }: ListingSearchOptional = {}
): Promise<ListingSaleWithFullProperty[] | ListingRentalWithFullProperty[]> {
  const nearbyProperties = await getNearbyPropertiesByTextQuery(location, radius);
  return await prisma.listing.findMany({
    where: {
      ...(buyOrRent === "buy" && {
        saleListing: {
          isNot: null,
        },
      }),
      ...(buyOrRent === "rent" && {
        rentalListing: {
          isNot: null,
        },
      }),
      price: getPriceFilter(priceRange),
      published: true,
      publishedAt: addedToSite
        ? {
            gte: new Date(addedToSite),
          }
        : undefined,
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
    take,
    skip,
    include: {
      ...(buyOrRent === "buy" && { saleListing: true }),
      ...(buyOrRent === "rent" && { rentalListing: true }),
      property: {
        include: {
          ...propertyInclude,
        },
      },
    },
  });
}