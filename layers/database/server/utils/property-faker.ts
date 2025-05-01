import { BedSizeType, PrismaClient, ConstructionType, FurnishingStatus, Tenure } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { type PropertyWithAddress } from '../../../../shared/types/property.ts';
import { roundFloat } from '../../../../shared/utils/float.ts';
import { updateLocationByAddressId, getLocationByAddressId } from "./location.ts";

const prisma = new PrismaClient();

/**
 * Generate a random number of bedrooms
 *
 * @returns Array of bedrooms
 */
export const generateBedrooms = (): Prisma.BedroomCreateWithoutPropertyInput[] => {
  const bedroomCount = faker.number.int({ min: 1, max: 5 });
  return Array.from({ length: bedroomCount }, (_, i) => ({
    roomNumber: i + 1,
    bed: [faker.helpers.arrayElement(Object.values(BedSizeType))],
    description: faker.word.words(10),
    enSuite: faker.datatype.boolean(),
    builtInStorage: faker.datatype.boolean(),
    walkInWardrobe: faker.datatype.boolean(),
    size: faker.number.int({ min: 10, max: 50 }),
  }));
};

/**
 * Generate a random number of bathrooms
 *
 * @returns Array of bathrooms
 */
export const generateBathrooms = (): Prisma.BathroomCreateWithoutPropertyInput[] => {
  const bathroomCount = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: bathroomCount }, (_, i) => ({
    roomNumber: i + 1,
    description: faker.word.words(10),
    enSuite: faker.datatype.boolean(),
    upstairs: faker.datatype.boolean(),
    downstairs: faker.datatype.boolean(),
    bathtub: faker.datatype.boolean(),
    walkInShower: faker.datatype.boolean(),
    size: faker.number.int({ min: 10, max: 50 }),
  }));
};

/**
 * Generate a random parking object
 *
 * @returns Random parking object
 */
export const generateParking = (): Prisma.ParkingCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    garage: faker.datatype.boolean(),
    driveway: faker.datatype.boolean(),
    onStreet: faker.datatype.boolean(),
    carport: faker.datatype.boolean(),
    allocatedParking: faker.datatype.boolean(),
    evCharging: faker.datatype.boolean(),
  };
};

/**
 * Generate a random number of media objects
 *
 * @returns Array of media objects
 */
export const generateMedia = (): Prisma.MediaCreateWithoutPropertyInput[] => {
  const mediaCount = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: mediaCount }, () => ({
    image: faker.image.url({ width: 300, height: 300 }),
    metadata: faker.word.words(10),
  }));
};

/**
 * Generate random additiional features
 * 
 * @returns Random AdditionalFeatures object
 */
export const generateAdditionalFeatures = (): Prisma.AdditionalFeaturesCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    petFriendly: true,
    moveInDate: faker.date.future(),
    chainFree: faker.datatype.boolean(),
    homeOffice: faker.datatype.boolean(),
    pool: faker.datatype.boolean(),
    internet: faker.datatype.boolean(),
    cableTv: faker.datatype.boolean(),
    phone: faker.datatype.boolean(),
    laundry: faker.datatype.boolean(),
    concierge: faker.datatype.boolean(),
    shop: faker.datatype.boolean(),
    gym: faker.datatype.boolean(),
  };
};

export const generateAccessability = (): Prisma.AccessibilityCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    wheelchairFriendly: faker.datatype.boolean(),
    stepFreeAccess: faker.datatype.boolean(),
    wideDoorways: faker.datatype.boolean(),
    wetRoom: faker.datatype.boolean(),
    handrails: faker.datatype.boolean(),
    elevator: faker.datatype.boolean(),
    stairs: faker.datatype.boolean(),
    accessibleParking: faker.datatype.boolean(),
  };
};

export const generateProperty = async (address: Prisma.AddressCreateWithoutPropertiesInput): Promise<PropertyWithAddress> => {
  const property: PropertyWithAddress = await prisma.property.create({
    data: {
      title: faker.word.words(10),
      description: faker.word.words(20),
      value: roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
      size: faker.number.int({ min: 50, max: 500 }),
      yearBuilt: faker.date.past().getFullYear().toString(),
      constructionType: faker.helpers.arrayElement(Object.values(ConstructionType)),
      floorLevel: undefined,
      furnishingStatus: faker.helpers.arrayElement(Object.values(FurnishingStatus)),
      tenure: faker.helpers.arrayElement(Object.values(Tenure)),
      leaseTerm: faker.number.int({ min: 1, max: 99 }),
      additionalFeatures: {
        create: generateAdditionalFeatures(),
      },
      accessibilityFeatures: {
        create: generateAccessability(),
      },
      amenities: {
        create: [],
      },
      bathroomFeatures: {
        create: generateBathrooms(),
      },
      bedroomFeatures: {
        create: generateBedrooms(),
      },
      diningroomFeatures: {
        create: [], // if any
      },
      kitchenFeatures: {
        create: [], // if any
      },
      livingAreaFeatures: {
        create: [], // if any
      },
      media: {
        create: generateMedia(),
      },
      outdoorSpace: undefined,
      Land: undefined,
      parking: {
        create: generateParking(),
      },
      energyAndUtilities: undefined,
      reception: {
        create: [], // if any
      },
      utility: {
        create: [], // if any
      },
      additionalToilet: {
        create: [], // if any
      },
      address: {
        create: address,
      },
      user: undefined,
      runningCosts: undefined,
      securityFeatures: undefined,
      storageFeatures: undefined,
      agents: {
        connect: [], // if any
      },
      estateAgent: undefined,
      type: {
        connect: {
          id: 1, // House
        },
      },
      classification: {
        connect: {
          id: 2, // Semi-Detached
        },
      },
    },
    include: {
      address: true,
    },
  });

  const updateLocation = await updateLocationByAddressId(property.addressId, property.address.lon!, property.address.lat!);
  const location = await getLocationByAddressId(property.addressId);

  return property;
}
