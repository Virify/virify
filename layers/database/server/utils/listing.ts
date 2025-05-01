import type { Listing } from "@prisma/client";
import type { ListingWithFullProperty } from "~~/shared/types/listing";

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
          address: true,
          media: true,
          type: true,
          classification: true,
          bedroomFeatures: true,
          bathroomFeatures: true,
          parking: true,
          amenities: true,
          additionalFeatures: true,
          accessibilityFeatures: true,
          diningroomFeatures: true,
          kitchenFeatures: true,
          livingAreaFeatures: true,
          reception: true,
          utility: true,
          additionalToilet: true,
          outdoorSpace: true,
          energyAndUtilities: true,
          securityFeatures: true,
          storageFeatures: true,
          runningCosts: true,
        },
      },
    },
  });
}