import { Prisma } from "@prisma/client";

export type PropertyWithRelations = Prisma.PropertyGetPayload<{
  include: {
    additionalFeatures: true;
    accessibilityFeatures: true;
    amenities: true;
    bathroomFeatures: true;
    bedroomFeatures: true;
    diningroomFeatures: true;
    kitchenFeatures: true;
    livingAreaFeatures: true;
    reception: true;
    utility: true;
    additionalToilet: true;
    media: true;
    outdoorSpace: true;
    Land: true;
    parking: true;
    energyAndUtilities: true;
    securityFeatures: true;
    storageFeatures: true;
    runningCosts: true;
    type: true;
    classification: true;
    address: true;
  };
}>

export type PropertyWithAddress = Prisma.PropertyGetPayload<{
  include: {
    address: true;
  };
}>