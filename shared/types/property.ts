import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";

export type PropertyWithAddress = Prisma.PropertyGetPayload<{
  include: {
    address: true;
  };
}>

export type Fullproperty = Prisma.PropertyGetPayload<{
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
    kitchenFeatures: true;
    reception: true;
    utility: true;
    outdoorSpace: {
      include: {
        garden: true;
        yard: true;
        land: true;
      };
    };
    energyAndUtilities: true;
    securityFeatures: true;
    storageFeatures: true;
    runningCosts: true;
  };
}>;

export type PropertySearchResult = {
  propertyId: number;
  distanceMiles: number;
}[]