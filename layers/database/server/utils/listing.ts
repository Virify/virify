import { ListingTier, RentalAvailabilityStatus, SaleAvailabilityStatus, type Listing } from "@prisma/client";
import type { ListingSearch, ListingSearchOptional, ListingWithFullProperty } from "~~/shared/types/listing";
import { prisma } from "./prisma-client";
import { propertyInclude } from "./property";
import { getPriceFilter } from "./price";
import { getPropertyIdsByDistance, getPropertyIdsByPolygons } from "./location";

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
export async function getAllFeaturedListings(take?: number, skip?: number): Promise<ListingCardType[] | undefined> {
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

export async function getListingByDistanceAndFilters(
  { type, coordinates, radius, geometries }: ListingSearch,
  { propertyTypes, priceRange, bedrooms, bathrooms, addedToSite, availabilityOptions, featured, take, skip }: ListingSearchOptional
): Promise<ListingCardType[]> {
  let nearbyProperties: PropertySearchResult = [];

  if (geometries && geometries.length > 0) {
    nearbyProperties = await getPropertyIdsByPolygons(geometries);
  } else if (coordinates && radius) {
    nearbyProperties = await getPropertyIdsByDistance(coordinates.lat, coordinates.lon, radius);
  }

  const listingFilter = type === "rent" ? "rentalListing" : "saleListing";

  // Process the propertyTypes to create appropriate filters
  let propertyTypeFilter = {};
  let classificationFilter = {};

  if (propertyTypes && Object.keys(propertyTypes).length > 0) {
    // Collect all propertyTypeIds
    const propertyTypeIds = Object.keys(propertyTypes);
    if (propertyTypeIds.length > 0) {
      propertyTypeFilter = {
        type: {
          id: {
            in: propertyTypeIds.map((id) => parseInt(id, 10)),
          },
        },
      };

      // Collect all classification IDs per property type
      const allClassificationIds: number[] = [];
      Object.values(propertyTypes).forEach((classIds) => {
        if (classIds && classIds.length > 0) {
          allClassificationIds.push(...classIds);
        }
      });

      if (allClassificationIds.length > 0) {
        classificationFilter = {
          classification: {
            id: {
              in: allClassificationIds,
            },
          },
        };
      }
    }
  }

  // Fetch listings from the database
  const listings = await prisma.listing.findMany({
    where: {
      [listingFilter]: {
        availabilityStatus: {
          in: availabilityOptions as typeof type extends "rent" ? RentalAvailabilityStatus[] : SaleAvailabilityStatus[],
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
          in: nearbyProperties.map((p) => p.propertyId), // Use the nearby property IDs
        },
        ...propertyTypeFilter,
        ...classificationFilter,
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
        ...featured,
      },
    },
    take,
    skip,
    select: listingCardFields,
  });

  // Map the listings to include the distance
  const listingsWithDistance = listings.map((listing) => {
    const property = nearbyProperties.find((p) => p.propertyId === listing.property?.address?.id);
    return {
      ...listing,
      distanceMiles: property ? property.distanceMiles : 0,
    };
  });

  return listingsWithDistance;
}
