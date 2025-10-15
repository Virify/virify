import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";
import type { SaleAvailabilityStatus, RentalAvailabilityStatus } from "~~/layers/database/server/database/prisma/generated/client";
import type { MapMarker } from "~~/shared/types/map";

export type ListingWithFullProperty = Prisma.ListingGetPayload<{
  include: {
    rentalListing: true,
    saleListing: true,
    property: {
      include: {
        address: true,
        media: true,
        type: true,
        classification: true,
        bedroomFeatures: {
          include: {
            media: true,
          },
        },
        bathroomFeatures: {
          include: {
            media: true,
          },
        },
        otherRoom: {
          include: {
            media: true,
          },
        },
        parking: true,
        amenities: true,
        additionalFeatures: true,
        accessibilityFeatures: true,
        kitchenFeatures: {
          include: {
            media: true,
          },
        },
        reception: {
          include: {
            media: true,
          },
        },
        utility: true,
        outdoorSpace: {
          include: {
            garden: {
              include: {
                media: true,
              },
            },
            yard: {
              include: {
                media: true,
              },
            },
            land: {
              include: {
                media: true,
              },
            },
            media: true,
          },
        },
        energyAndUtilities: true,
        securityFeatures: true,
        storageFeatures: true,
        runningCosts: true,
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
}>;

export type ListingCardData = Omit<ListingWithFullProperty, 'property' | 'user'> & {
  property: NonNullable<ListingWithFullProperty['property']> & {
    address: NonNullable<ListingWithFullProperty['property']>['address'];
    type: NonNullable<ListingWithFullProperty['property']>['type'];
    classification: NonNullable<ListingWithFullProperty['property']>['classification'];
  };
  user: NonNullable<ListingWithFullProperty['user']> & {
    username: string;
  };
};

export type AiSearchResponse = {
  results: ListingWithFullProperty[];
  queryAnalysis: QueryAnalysis;
};

/**
 * Buy or Rent
 */
export type ListingSearch = {
  type: "buy" | "rent";
  coordinates?: {
    lat: number;
    lon: number;
  };
  radius?: number;
  geometries?: GeoJSONPolygon[]; // Support for single or multiple polygon search
};

/**
 * Arguments for searching listings
 */
export type ListingSearchOptional = {
  bedrooms?: number[];
  bathrooms?: number[];
  propertyTypes?: Record<string, number[]>;
  priceRange?: number[];
  addedToSite?: Date;
  availabilityOptions?: string[];
  featured?: Record<string, Record<string, boolean>>;
  take?: number | undefined;
  skip?: number | undefined;
};

export type AvailabilityOptions = SaleAvailabilityStatus | RentalAvailabilityStatus | (SaleAvailabilityStatus | RentalAvailabilityStatus)[];

/**
 * Listing Card Select Object
 */
export const listingCardFields = {
  id: true,
  title: true,
  price: true,
  listingTier: true,
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
          fullAddress: true,
          lat: true,
          lon: true,
        },
      },
      type: {
        select: {
          name: true,
        },
      },
      classification: {
        select: {
          name: true,
        },
      },
      accessibilityFeatures: {
        select: {
          wheelchairFriendly: true,
        },
      },
      additionalFeatures: {
        select: {
          petFriendly: true,
        },
      },
      numberBedrooms: true,
      numberBathrooms: true,
      numberReceptions: true,
      numberOtherRooms: true,
      parking: {
        select: {
          evCharging: true,
          garage: true,
        },
      },
      outdoorSpace: {
        select: {
          garden: true,
          yard: true,
          land: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
};

/**
 * Listing Card Type
 */
export type ListingCardType = Prisma.ListingGetPayload<{
  select: typeof listingCardFields;
}> & {
  distanceMiles?: number;
};

export type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: number[][][];
};

/**
 * Summary card data type - alias of MapMarker to ensure they stay in sync
 */
export type SummaryCardData = MapMarker;

/**
 * Listing response with similar listings
 */
export type ListingWithSimilar = {
  listing: ListingWithFullProperty;
  similarListings: SummaryCardData[];
};
