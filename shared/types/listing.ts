import { Prisma } from "@prisma/client";

export type ListingWithFullProperty = Prisma.ListingGetPayload<{
  include: {
    rentalListing: true;
    saleListing: true;
    property: {
      include: {
        address: true;
        media: true;
        type: true;
        classification: true;
        bedroomFeatures: true;
        bathroomFeatures: true;
        parking: true;
        amenities: true;
        additionalFeatures: true;
        accessibilityFeatures: true;
        diningroomFeatures: true;
        kitchenFeatures: true;
        livingAreaFeatures: true;
        reception: true;
        utility: true;
        additionalToilet: true;
        outdoorSpace: true;
        energyAndUtilities: true;
        securityFeatures: true;
        storageFeatures: true;
        runningCosts: true;
      };
    };
  };
}>;

/**
 * Buy or Rent 
 */
export type ListingSearch = {
  buyOrRent: "buy" | "rent";
  location: string;
  radius: number;
};

/**
 * Arguments for searching listings
 */
export type ListingSearchOptional = {
  bedrooms?: number[];
  bathrooms?: number[];
  propertyTypes?: string[];
  priceRange?: number[];
  addedToSite?: Date;
  include?: string;
  featured?: { key: string; group: string }[];
  take?: number | undefined;
  skip?: number | undefined;
}

/**
 * Listing Card Type
 */
export type ListingCardType = Prisma.ListingGetPayload<{
  select: {
    id: true;
    title: true;
    price: true;
    publishedAt: true;
    rentalListing: {
      select: {
        rentFrequency: true;
      } | null;
    };
    saleListing: {
      select: {
        priceType: true;
      } | null;
    };
    property: {
      select: {
        media: {
          select: {
            image: true;
            metadata: true
          };
        };
        address: {
          select: {
            number: true;
            id: true;
            flat: true;
            street: true;
            city: true;
            postcode: true;
            country: true;
            county: true;
            lat: true;
            lon: true;
          };
        }
        type: {
          select: {
            name: true;
          };
        };
        numberBedrooms: true;
        numberBathrooms: true;
        parking: {
          select: {
            evCharging: true;
          };
        };
        outdoorSpace: {
          select: {
            frontGarden: true;
            rearGarden: true;
          };
        };
        additionalFeatures: {
          select: {
            petFriendly: true;
          };
        };
      };
    };
  };
}>;
