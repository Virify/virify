import { Prisma } from "@prisma/client";

export type PropertyWithRelations = Prisma.PropertyGetPayload<{
  include: {
    address: true;
    media: true;
    type: true;
    classification: true;
    bedroomFeatures: true;
    bathroomFeatures: true;
    parking: true;
  };
}>

export type PropertyWithAddress = Prisma.PropertyGetPayload<{
  include: {
    address: true;
  };
}>