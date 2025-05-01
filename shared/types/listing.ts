import { Prisma, type Listing } from '@prisma/client';

export type ListingWithProperty = Prisma.ListingGetPayload<{
  include: {
    property: {
      include: {
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
        Land: true,
      };
    };
  };
}> & Listing;