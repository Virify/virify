import type { Listing } from "@prisma/client";
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
export async function getSaleListingsByDistance(location: string, radius: number, propertyTypes?: string[], priceRange?: number[]): Promise<ListingSaleWithFullProperty[]> {
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
export async function getRentalListingsByDistance(location: string, radius: number, propertyTypes?: string[], priceRange?: number[]): Promise<ListingRentalWithFullProperty[]> {
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

