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

export type ListingSaleWithFullProperty = Prisma.ListingGetPayload<{
  include: {
    saleListing: true;
    property: true;
  };
}>;

export type ListingRentalWithFullProperty = Prisma.ListingGetPayload<{
  include: {
    rentalListing: true;
    property: true;
  };
}>;

export type ListingSearch = {
  location: string;
  radius: number;
};

export type ListingSearchOptional = {
  bedrooms?: number[];
  bathrooms?: number[];
  propertyTypes?: string[];
  priceRange?: number[];
  take?: number | undefined;
  skip?: number | undefined;
}
