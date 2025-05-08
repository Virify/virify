// imports require .ts extension to run seed
import { BedSizeType, PrismaClient, ConstructionType, FireplaceType, PlanningClassification, LandUse, BoilerType, BroadbandType, ConnectedUtilities, EPCRating, HeatingType, HotWaterSource, RenewableEnergy } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { type PropertyWithAddress } from "../../../../../shared/types/property.ts";
import { roundFloat } from "../../../../../shared/utils/float.ts";
import { updateLocationByAddressIdForSeed, getLocationByAddressIdForSeed } from "./location-for-seed.ts";
import { typeToClassificationMap } from "./property-type-map.ts";
const prisma = new PrismaClient();

/**
 * Generate random additiional features
 *
 * @returns Random AdditionalFeatures object
 */
export const generateAdditionalFeatures = (): Prisma.AdditionalFeaturesCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    petFriendly: faker.datatype.boolean(),
    moveInDate: faker.date.future(),
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

/**
 * Generate random Accessibility features object
 *
 * @returns Random Accessibility object
 */
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

/**
 * Generate a random number of bathrooms
 *
 * @returns Array of bathrooms
 */
export const generateBathrooms = (): { count: number; data: Prisma.BathroomCreateWithoutPropertyInput[] } => {
  const bathroomCount = faker.number.int({ min: 1, max: 3 });
  return {
    count: bathroomCount,
    data: Array.from({ length: bathroomCount }, (_, i) => ({
      roomNumber: i + 1,
      description: faker.word.words(10),
      enSuite: faker.datatype.boolean(),
      upstairs: faker.datatype.boolean(),
      downstairs: faker.datatype.boolean(),
      bathtub: faker.datatype.boolean(),
      walkInShower: faker.datatype.boolean(),
      size: faker.number.int({ min: 10, max: 50 }),
    })),
  };
};

/**
 * Generate a random number of bedrooms
 *
 * @returns Array of bedrooms
 */
export const generateBedrooms = (): { count: number; data: Prisma.BedroomCreateWithoutPropertyInput[] } => {
  const bedroomCount = faker.number.int({ min: 1, max: 5 });
  return {
    count: bedroomCount,
    data: Array.from({ length: bedroomCount }, (_, i) => ({
      roomNumber: i + 1,
      bed: [faker.helpers.arrayElement(Object.values(BedSizeType))],
      description: faker.word.words(10),
      enSuite: faker.datatype.boolean(),
      builtInStorage: faker.datatype.boolean(),
      walkInWardrobe: faker.datatype.boolean(),
      size: faker.number.int({ min: 10, max: 50 }),
    })),
  };
};
/**
 * Generate random Dining room Object
 *
 * @returns Single dining room object
 */
export const generateDiningRoom = (): Prisma.DiningroomCreateWithoutPropertyInput => {
  return {
    openConcept: faker.datatype.boolean(),
    description: faker.word.words(10),
    size: faker.number.int({ min: 10, max: 50 }),
  };
};
/**
 * Generate random Kitchen object
 *
 * @returns KitchenWithoutPropertyInput
 */
export const generateKitchen = (): Prisma.KitchenCreateWithoutPropertyInput => {
  return {
    modern: faker.datatype.boolean(),
    openPlan: faker.datatype.boolean(),
    whiteGoods: faker.datatype.boolean(),
    description: faker.word.words(10),
    size: faker.number.int({ min: 10, max: 50 }),
    breakfastBar: faker.datatype.boolean(),
    island: faker.datatype.boolean(),
    pantry: faker.datatype.boolean(),
  };
};

/**
 * Generate a random number of living area objects
 *
 * @returns Random LivingArea Objects
 */
export const generateLivingArea = (): Prisma.LivingAreaCreateWithoutPropertyInput => {
  return {
    fireplace: faker.helpers.arrayElement(Object.values(FireplaceType)),
    balcony: faker.datatype.boolean(),
    description: faker.word.words(10),
    openPlan: faker.datatype.boolean(),
    size: faker.number.int({ min: 10, max: 50 }),
  };
};

/**
 * Generate a random number of reception objects
 *
 * @returns Array of Reception objects
 */
export const generateReception = (): { count: number; data: Prisma.ReceptionCreateWithoutPropertyInput[] } => {
  const receptionCount = faker.number.int({ min: 1, max: 3 });
  return {
    count: receptionCount,
    data: Array.from({ length: receptionCount }, (_, i) => ({
      roomNumber: i + 1,
      description: faker.word.words(10),
      size: faker.number.int({ min: 10, max: 50 }),
      openPlan: faker.datatype.boolean(),
      fireplace: faker.helpers.arrayElement(Object.values(FireplaceType)),
      gamesRoom: faker.datatype.boolean(),
      homeCinema: faker.datatype.boolean(),
    })),
  };
};

/**
 * Generate random Utility object
 *
 * @returns Random Utility object
 */
export const generateUtility = (): Prisma.UtilityCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    appliances: faker.helpers.arrayElements(["Washing Machine", "Dishwasher", "Microwave", "Fridge", "Oven"], faker.number.int({ min: 1, max: 3 })),
    storage: faker.datatype.boolean(),
    sink: faker.datatype.boolean(),
    plumbing: faker.datatype.boolean(),
    size: faker.number.float({ min: 5, max: 50 }),
  };
};

/**
 * Generate random AdditionalToilet object
 *
 * @returns Random AdditionalToilet object
 */
export const generateAdditionalToilet = (): Prisma.AdditionalToiletCreateWithoutPropertyInput => {
  return {
    downstairs: faker.datatype.boolean(),
    upstairs: faker.datatype.boolean(),
    guestCloakroom: faker.datatype.boolean(),
    description: faker.word.words(10),
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
 * Generate a random number of outdoor space objects
 *
 * @returns Random OutdoorSpace object
 */
export const generateOutDoorSpace = (): Prisma.OutdoorSpaceCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    totalSize: faker.number.int({ min: 10, max: 50 }),
    frontGarden: faker.datatype.boolean(),
    frontGardenSize: faker.number.int({ min: 10, max: 50 }),
    rearGarden: faker.datatype.boolean(),
    rearGardenSize: faker.number.int({ min: 10, max: 50 }),
    sunTerrace: faker.datatype.boolean(),
    terrace: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    patio: faker.datatype.boolean(),
    separateParcel: faker.datatype.boolean(),
    shed: faker.datatype.boolean(),
    summerHouse: faker.datatype.boolean(),
    gardenOffice: faker.datatype.boolean(),
    pool: faker.datatype.boolean(),
  };
};

/**
 * Generate a random Land object
 *
 * @returns Random GenerateLand object
 */
export const generateLand = (): Prisma.LandCreateWithoutPropertyInput => {
  return {
    planningClassification: faker.helpers.arrayElement(Object.values(PlanningClassification)),
    landSize: faker.number.int({ min: 10, max: 50 }),
    accessRights: faker.datatype.boolean(),
    roadFrontage: faker.datatype.boolean(),
    utilitiesAvailable: faker.datatype.boolean(),
    currentUse: faker.helpers.arrayElement(Object.values(LandUse)),
    agriculturalSubsidies: faker.datatype.boolean(),
    stewardshipScheme: faker.datatype.boolean(),
    tenanted: faker.datatype.boolean(),
    vacant: faker.datatype.boolean(),
    agriculturalUse: faker.datatype.boolean(),
    description: faker.word.words(10),
  };
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
 * Generate random Energy and Utilities data
 *
 * @returns Random EnergyAndUtilities object
 */
export const generateEnergyAndUtilities = (): Prisma.EnergyAndUtilitiesCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    epcRating: faker.helpers.arrayElement(Object.values(EPCRating)),
    epcCertificateUrl: faker.internet.url(),
    primaryHeatingType: faker.helpers.arrayElements(Object.values(HeatingType), faker.number.int({ min: 1, max: 3 })),
    secondaryHeatingType: faker.helpers.arrayElements(Object.values(HeatingType), faker.number.int({ min: 1, max: 2 })),
    boilerType: faker.helpers.arrayElement(Object.values(BoilerType)),
    hotWaterSource: faker.helpers.arrayElement(Object.values(HotWaterSource)),
    renewables: faker.helpers.arrayElements(Object.values(RenewableEnergy), faker.number.int({ min: 1, max: 3 })),
    connectedUtilities: faker.helpers.arrayElements(Object.values(ConnectedUtilities), faker.number.int({ min: 2, max: 4 })),
    broadbandType: faker.helpers.arrayElement(Object.values(BroadbandType)),
    fullFibreAvailable: faker.datatype.boolean(),
    maxDownloadSpeedMbps: faker.number.int({ min: 30, max: 1000 }),
  };
};

/**
 * Generate random RunningCosts data
 *
 * @returns Random RunningCosts object
 */
export const generateRunningCosts = (): Prisma.RunningCostsCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(15),
    councilTaxBand: faker.helpers.arrayElement(["A", "B", "C", "D", "E", "F", "G"]),
    serviceCharges: roundFloat(faker.number.float({ min: 50, max: 300 }), 2),
    groundRent: roundFloat(faker.number.float({ min: 0, max: 500 }), 2),
  };
};

/**
 * Generate random Security data
 *
 * @returns Random Security object
 */
export const generateSecurity = (): Prisma.SecurityCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(15),
    gatedCommunity: faker.datatype.boolean(),
    cctv: faker.datatype.boolean(),
    alarmSystem: faker.datatype.boolean(),
    neighborhoodWatch: faker.datatype.boolean(),
    intercomSystem: faker.datatype.boolean(),
    security: faker.datatype.boolean(),
    reception: faker.datatype.boolean(),
  };
};

/**
 * Generate random Storage data
 *
 * @returns Random Storage object
 */
export const generateStorage = (): Prisma.StorageCreateWithoutPropertyInput => {
  return {
    attic: faker.datatype.boolean(),
    basement: faker.datatype.boolean(),
    separateDressing: faker.datatype.boolean(),
    underStairsStorage: faker.datatype.boolean(),
    pantry: faker.datatype.boolean(),
    description: faker.word.words(20),
  };
};

/**
 * Generates a full property object with address
 *
 * @param address Address
 * @returns PropertyWithAddress
 */
export const generateProperty = async (address: Prisma.AddressCreateWithoutPropertiesInput): Promise<PropertyWithAddress> => {
  // Generate mapped property types and classifications
  const typeId = faker.helpers.arrayElement(Object.keys(typeToClassificationMap).map(Number));
  const classificationOptions = typeToClassificationMap[typeId];
  const classificationId = faker.helpers.arrayElement(classificationOptions!);

  const { count: bedroomCount, data: bedrooms } = generateBedrooms();
  const { count: bathroomCount, data: bathrooms } = generateBathrooms();
  const { count: receptionCount, data: receptions } = generateReception();

  const property: PropertyWithAddress = await prisma.property.create({
    data: {
      title: faker.word.words(10),
      description: faker.word.words(20),
      value: roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
      size: faker.number.int({ min: 50, max: 500 }),
      yearBuilt: faker.date.past().getFullYear().toString(),
      chainFree: faker.datatype.boolean(),
      vacant: faker.datatype.boolean(),
      constructionType: faker.helpers.arrayElement(Object.values(ConstructionType)),
      floorLevel: undefined,
      additionalFeatures: {
        create: generateAdditionalFeatures(),
      },
      accessibilityFeatures: {
        create: generateAccessability(),
      },
      amenities: {},
      numberBedrooms: bedroomCount,
      numberBathrooms: bathroomCount,
      numberReceptions: receptionCount,
      bathroomFeatures: {
        create: bathrooms,
      },
      bedroomFeatures: {
        create: bedrooms,
      },
      diningroomFeatures: {
        create: generateDiningRoom(),
      },
      kitchenFeatures: {
        create: generateKitchen(),
      },
      livingAreaFeatures: {
        create: generateLivingArea(),
      },
      reception: {
        create: receptions,
      },
      utility: {
        create: generateUtility(),
      },
      additionalToilet: {
        create: generateAdditionalToilet(),
      },
      media: {
        create: generateMedia(),
      },
      outdoorSpace: {
        create: generateOutDoorSpace(),
      },
      Land: {
        create: generateLand(),
      },
      parking: {
        create: generateParking(),
      },
      energyAndUtilities: {
        create: generateEnergyAndUtilities(),
      },
      address: {
        create: address,
      },
      runningCosts: {
        create: generateRunningCosts(),
      },
      securityFeatures: {
        create: generateSecurity(),
      },
      storageFeatures: {
        create: generateStorage(),
      },
      user: {
        connect: {
          id: 1, // admin user
        },
      },
      agents: {
        connect: [], // if any
      },
      estateAgent: undefined,
      type: {
        connect: {
          id: typeId,
        },
      },
      classification: {
        connect: {
          id: classificationId,
        },
      },
    },
    include: {
      address: true,
    },
  });

  const updateLocation = await updateLocationByAddressIdForSeed(property.addressId, property.address.lon!, property.address.lat!);
  const location = await getLocationByAddressIdForSeed(property.addressId);

  return property;
};
