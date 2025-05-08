import { ListingTier, Prisma, RentalAvailabilityStatus, SaleAvailabilityStatus, type Listing } from "@prisma/client";
import type { ListingSearch, ListingSearchOptional, ListingWithFullProperty } from "~~/shared/types/listing";
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
 * Get a full listing by ID including property details for a detailed listing page
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
 * Get featured listings for a card
 *
 * @returns ListingCardType[]
 */
export async function getAllFeaturedListings(take: number = 20, skip: number = 0): Promise<ListingCardType[] | undefined> {
  return await prisma.listing.findMany({
    where: {
      listingTier: ListingTier.FEATURED,
    },
    take,
    skip,
    select: listingCardFields,
  });
}

/**
 * Get All Listings for cards
 *
 * @returns ListingCardType[]
 */
export async function getAllListings(): Promise<ListingCardType[]> {
  return await prisma.listing.findMany({
    select: listingCardFields,
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
 * Get Listings By Distance and Filters
 *
 * @param location - coordinates for the search
 * @param radius - search radius in miles
 * @param type - listing type ('rent' or 'buy')
 * @param filters - filters to apply (propertyTypes, priceRange, etc.)
 * @returns ListingCardType[]
 */
export async function getListingByDistanceAndFilters(
  { type, location, radius }: ListingSearch,
  { propertyTypes, priceRange, bedrooms, bathrooms, addedToSite, availabilityOptions, take, skip }: ListingSearchOptional
): Promise<ListingCardType[]> {

  const nearbyProperties = await getNearbyPropertiesByTextQuery(location, radius);
  const listingFilter = type === "rent" ? "rentalListing" : "saleListing";

  return await prisma.listing.findMany({
    where: {
      [listingFilter]: {
        availabilityStatus: {
          in: availabilityOptions as (typeof type extends "rent" ? RentalAvailabilityStatus[] : SaleAvailabilityStatus[]),
        },
      },
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
    select: listingCardFields,
  });
}


/**
 * Listing Card Select Object
 */
export const listingCardFields = {
  id: true,
  title: true,
  price: true,
  publishedAt: true,
  rentalListing: true,
  saleListing: true,
  property: {
    select: {
      media: {
        select: {
          image: true,
          metadata: true,
        },
      },
      address: {
        select: {
          number: true,
          id: true,
          flat: true,
          street: true,
          city: true,
          postcode: true,
          country: true,
          county: true,
          lat: true,
          lon: true,
        },
      },
      type: {
        select: {
          name: true,
        },
      },
      additionalFeatures: {
        select: {
          petFriendly: true,
        },
      },
      numberBedrooms: true,
      numberBathrooms: true,
      parking: {
        select: {
          evCharging: true,
        },
      },
      outdoorSpace: {
        select: {
          frontGarden: true,
          rearGarden: true,
        },
      },
    },
  },
};

/**
 * Listing Card Type
 */
export type ListingCardType = Prisma.ListingGetPayload<{
  select: typeof listingCardFields;
}>;