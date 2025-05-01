import { Prisma, type Listing } from '@prisma/client';

export type ListingWithProperty = Prisma.ListingGetPayload<{
  include: {
    property: {
      include: {
        address: true;
        media: true;
        type: true;
        classification: true;
        bedroomFeatures: true;
        bathroomFeatures: true;
        parking: true;
      };
    };
  };
}> & Listing;