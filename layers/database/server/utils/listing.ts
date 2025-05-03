import type { Listing } from "@prisma/client";
import type { ListingRentalWithFullProperty, ListingSaleWithFullProperty, ListingWithFullProperty } from "~~/shared/types/listing";
import { propertyInclude } from "./property";

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
export async function getSaleListingsByPropertyIds(propertyIds: number[]): Promise<ListingSaleWithFullProperty[]> {
  return await prisma.listing.findMany({
    where: {
      propertyId: {
        in: propertyIds,
      },
      saleListing: {
        isNot: null,
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
export async function getRentalListingsByPropertyIds(propertyIds: number[]): Promise<ListingRentalWithFullProperty[]> {
  return await prisma.listing.findMany({
    where: {
      propertyId: {
        in: propertyIds,
      },
      rentalListing: {
        isNot: null,
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
