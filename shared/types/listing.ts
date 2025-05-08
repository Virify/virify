import { Prisma, RentalAvailabilityStatus, SaleAvailabilityStatus } from "@prisma/client";

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
  type: "buy" | "rent";
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
  availabilityOptions?: string[];
  featured?: { key: string; group: string }[];
  take?: number | undefined;
  skip?: number | undefined;
}

export type AvailabilityOptions = SaleAvailabilityStatus | RentalAvailabilityStatus | (SaleAvailabilityStatus | RentalAvailabilityStatus)[];
