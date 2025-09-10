
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
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
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
    },
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
 * Get similar listings based on property characteristics and location
 */
export async function getSimilarListings(listing: ListingWithFullProperty, limit: number = 10): Promise<SummaryCardData[]> {
  const property = listing.property;
  if (!property?.address || !property.type) {
    return [];
  }

  // Get nearby properties within 3 mile radius
  const lat = property.address.lat ?? 0;
  const lon = property.address.lon ?? 0;
  const nearbyProperties = await getPropertyIdsByDistance(
    lat,
    lon,
    10 // 10 mile radius
  );

  const propertyIds = nearbyProperties.map(p => p.propertyId);
  if (propertyIds.length === 0) {
    return [];
  }
  
  // Determine listing type filter
  const listingTypeFilter = listing.saleListing ? 'saleListing' : 'rentalListing';
  
  // Calculate price range (±30%)
  const basePrice = listing.price;
  const priceMin = Math.floor(basePrice * 0.7);
  const priceMax = Math.ceil(basePrice * 1.3);

  // Determine if the current listing is a house share
  const isHouseShare = property.classification?.name?.toLowerCase() === 'house share';

  // Build classification filter for house share logic
  let classificationFilter: any = {};
  if (isHouseShare) {
    classificationFilter = {
      classification: {
        name: {
          equals: 'House Share',
        },
      },
    };
  } else {
    classificationFilter = {
      classification: {
        name: {
          not: 'House Share',
        },
      },
    };
  }

  // Query for similar listings with strict filters and house share logic
  const similarListings = await prisma.listing.findMany({
    where: {
      id: {
        not: listing.id, // Exclude the current listing
      },
      published: true,
      [listingTypeFilter]: {
        isNot: null, // Just check that the listing type exists
      },
      price: {
        gte: priceMin,
        lte: priceMax,
      },
      property: {
        id: {
          in: propertyIds, // Nearby location
        },
        type: {
          id: property.type.id, // Same property type
        },
        ...classificationFilter,
      },
    },
    take: limit,
    select: listingCardFields,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Convert to SummaryCardData format
  return transformToSummaryCardData(similarListings);
}

/**
 * Transform listing data to SummaryCardData format
 */
function transformToSummaryCardData(listings: any[]): SummaryCardData[] {
  return listings.map((listing): SummaryCardData => {
    const property = listing.property;
    return {
      id: listing.id || 0,
      lat: property?.address?.lat || 0,
      lon: property?.address?.lon || 0,
      title: listing.title,
      bedrooms: property?.numberBedrooms || null,
      bathrooms: property?.numberBathrooms || null,
      receptions: property?.numberReceptions || null,
      price: listing.price,
      propertyType: property?.type?.name || null,
      classification: property?.classification?.name || null,
      priceType: listing.saleListing?.priceType || listing.rentalListing?.rentFrequency || null,
      address: property?.address ? {
        street: property.address.street,
        city: property.address.city,
        postcode: property.address.postcode,
      } : null,
      image: property?.media || [],
      tier: listing.listingTier,
    };
  });
}

/**
 * Get trending listings analytics data from ListingView table
 */
export async function getTrendingListingsAnalytics(days: number, limit: number) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  return await prisma.listingView.groupBy({
    by: ['listingId'],
    where: {
      createdAt: {
        gte: sinceDate
      }
    },
    _count: {
      id: true, // Total views
      userId: true, // Views by registered users
      sessionId: true, // Unique sessions
    },
    orderBy: {
      _count: {
        id: 'desc' // Order by total view count
      }
    },
    take: limit * 2 // Get more than needed to filter active listings
  });
}

/**
 * Get trending listings by IDs in SummaryCardData format
 */
export async function getTrendingListingsByIds(listingIds: number[], limit: number): Promise<SummaryCardData[]> {
  const listings = await prisma.listing.findMany({
    where: {
      id: {
        in: listingIds
      },
      // Only include published listings
      published: true,
      property: {
        isNot: null
      }
    },
    select: listingCardFields,
    take: limit
  });

  // Transform to SummaryCardData format using shared utility
  return transformToSummaryCardData(listings);
}
