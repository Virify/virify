import type { Listing } from "@prisma/client";
import type { ListingWithFullProperty } from "~~/shared/types/listing";
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
      listingCosts: true,
      property: {
        include: {
          ...propertyInclude
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
      listingCosts: true,
      property: {
        include: {
          ...propertyInclude
        },
      },
    },
  });
}
