
import type { ListingSearch, ListingSearchOptional, ListingWithFullProperty, ListingCardType, SummaryCardData } from "~~/shared/types/listing";
import { listingCardFields } from "~~/shared/types/listing";
import { ListingTier, Prisma, RentalAvailabilityStatus, SaleAvailabilityStatus, type Listing } from "../database/prisma/generated/client";
import { prisma } from "./prisma-client";

// required for testing - auto-importing not working
import { propertyInclude } from "./property";
import { getPropertyIdsByDistance, getPropertyIdsByPolygons } from "./location";
import { getPriceFilter } from "./price";

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
      published: true,
    },
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          avatar: true,
        },
      },
      ListingPriceHistory: {
        orderBy: { createdAt: 'desc' as const },
        select: { id: true, oldPrice: true, newPrice: true, changePercent: true, createdAt: true },
      },
    },
  });
}

/**
 * Get a listing by ID for editing (no published filter, includes all property details)
 * Only returns the listing if it belongs to the specified user
 *
 * @param id Listing ID
 * @param userId User ID (for authorization)
 * @returns ListingWithFullProperty or null if not found or unauthorized
 */
export async function getListingByIdForEdit(id: number, userId: number): Promise<ListingWithFullProperty | null> {
  return await prisma.listing.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          avatar: true,
        },
      },
      ListingPriceHistory: {
        orderBy: { createdAt: 'desc' as const },
        select: { id: true, oldPrice: true, newPrice: true, changePercent: true, createdAt: true },
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
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          avatar: true,
        },
      },
      ListingPriceHistory: {
        orderBy: { createdAt: 'desc' as const },
        select: { id: true, oldPrice: true, newPrice: true, changePercent: true, createdAt: true },
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
    const propertyId = listing.property && listing.property.address ? listing.property.address.id : undefined;
    const property = propertyId !== undefined
      ? nearbyProperties.find((p) => p.propertyId === propertyId)
      : undefined;
    return {
      ...listing,
      distanceMiles: property ? property.distanceMiles : 0,
    };
  });

  return listingsWithDistance;
}

/**
 * Get listings by location and AI-generated filters
 * First applies location filtering to get property IDs, then applies AI filters
 *
 * @param lat number - latitude
 * @param lng number - longitude
 * @param radius number - radius in miles
 * @param whereClause object - AI-generated WHERE clause
 * @param includeClause object - Prisma include clause
 * @param limit number - optional limit
 * @returns ListingWithFullProperty[]
 */
export async function getListingsByLocationAndAIFilters(lat: number, lng: number, radius: number, whereClause: any, includeClause: any, limit?: number) {
  // First get property IDs within the specified location/radius
  const nearbyProperties = await getPropertyIdsByDistance(lat, lng, radius);
  const propertyIds = nearbyProperties.map((p) => p.propertyId);

  // If no properties found in the area, return empty array
  if (propertyIds.length === 0) {
    return [];
  }

  // Apply location filter to the WHERE clause
  const locationFilteredWhereClause = {
    ...whereClause,
    property: {
      ...whereClause.property,
      id: {
        in: propertyIds,
      },
    },
  };

  // Execute the query with both location and AI filters
  const listings = await prisma.listing.findMany({
    where: locationFilteredWhereClause,
    include: includeClause,
    ...(limit ? { take: limit } : {}),
  });

  return listings;
}

const fullListingInclude = {
  rentalListing: true,
  saleListing: true,
  property: {
    include: {
      ...propertyInclude,
    },
  },
  user: {
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      avatar: true,
    },
  },
  ListingPriceHistory: {
    orderBy: { createdAt: 'desc' as const },
    select: { id: true, oldPrice: true, newPrice: true, changePercent: true, createdAt: true },
  },
};

/**
 * Fetches listings from the database.
 */
export async function fetchListings(where: Prisma.ListingWhereInput): Promise<ListingWithFullProperty[]> {
  const listings = await prisma.listing.findMany({
    where,
    include: fullListingInclude,
  });
  return listings;
}

/**
 * Fetches paginated listings from the database with total count.
 */
export async function fetchPaginatedListings(where: Prisma.ListingWhereInput, page: number = 1, limit: number = 20): Promise<ListingWithFullProperty[]> {
  const skip = (page - 1) * limit;

  return await prisma.listing.findMany({
    where,
    include: fullListingInclude,
    skip,
    take: limit,
  });
}

/**
 * Fetches card-only listing data (lean select, no room details).
 */
export async function fetchListingsForCard(where: Prisma.ListingWhereInput): Promise<ListingCardType[]> {
  return await prisma.listing.findMany({
    where,
    select: listingCardFields,
  });
}

/**
 * Fetches paginated card-only listing data.
 */
export async function fetchPaginatedListingsForCard(where: Prisma.ListingWhereInput, page: number = 1, limit: number = 20): Promise<ListingCardType[]> {
  const skip = (page - 1) * limit;

  return await prisma.listing.findMany({
    where,
    select: listingCardFields,
    skip,
    take: limit,
  });
}
