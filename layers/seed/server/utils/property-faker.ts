// imports require .ts extension to run seed
import { faker } from "@faker-js/faker";
import { BedSizeType, BoilerType, BroadbandType, ConnectedUtilities, ConstructionType, EPCRating, FireplaceType, HeatingType, HotWaterSource, OtherRoomType, ReceptionType, RenewableEnergy, type Prisma } from "~~/layers/database/server/database/prisma/generated/client";
import { roundFloat } from "~~/shared/utils/numbers";
import { typeToClassificationMap } from "./property-type-map";
import type { PropertyWithAddress } from "~~/shared/types/property";
import { prisma } from "~~/layers/database/server/utils/prisma-client";
import { updateLocationByAddressIdForSeed, getLocationByAddressIdForSeed } from "./location-for-seed";

/**LandUse
 * Generate random additiional features
 *
 * @returns Random AdditionalFeatures object
 */
export const generateAdditionalFeatures = (): Prisma.AdditionalFeaturesCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(10),
    petFriendly: faker.datatype.boolean(),
    moveInDate: faker.date.future(),
    pool: faker.datatype.boolean(),
    internet: faker.datatype.boolean(),
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
      floor: faker.number.int({ min: 1, max: 3 }),
      name: faker.word.words(2),
      description: faker.word.words(10),
      enSuite: faker.datatype.boolean(),
      toilet: faker.datatype.boolean(),
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
      name: faker.word.words(2),
      floor: faker.number.int({ min: 0, max: 3 }),
      bed: [faker.helpers.arrayElement(Object.values(BedSizeType))],
      description: faker.word.words(10),
      enSuite: faker.datatype.boolean(),
      builtInStorage: faker.datatype.boolean(),
      walkInWardrobe: faker.datatype.boolean(),
      bayWindow: faker.datatype.boolean(),
      balcony: faker.datatype.boolean(),
      hasView: faker.datatype.boolean(),
      patioDoors: faker.datatype.boolean(),
      builtInDesk: faker.datatype.boolean(),
      size: faker.number.int({ min: 10, max: 50 }),
    })),
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
    utilityAccess: faker.datatype.boolean(),
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
      floor: faker.number.int({ min: 0, max: 3 }),
      name: faker.word.words(2),
      type: faker.helpers.arrayElement(Object.values(ReceptionType)),
      description: faker.word.words(10),
      size: faker.number.int({ min: 10, max: 50 }),
      openPlan: faker.datatype.boolean(),
      fireplace: faker.helpers.arrayElement(Object.values(FireplaceType)),
      balcony: faker.datatype.boolean(),
      bayWindow: faker.datatype.boolean(),
      openConcept: faker.datatype.boolean(),
      conservatory: faker.datatype.boolean(),
      barArea: faker.datatype.boolean(),
      builtInDesk: faker.datatype.boolean(),
      builtInStorage: faker.datatype.boolean(),
      builtInShelving: faker.datatype.boolean(),
      hasView: faker.datatype.boolean(),
      soundProofing: faker.datatype.boolean(),
      accousticPanels: faker.datatype.boolean(),
      stoneFlooring: faker.datatype.boolean(),
      hardwoodFlooring: faker.datatype.boolean(),
    })),
  };
};

/**
 * Generate a random number of reception objects
 *
 * @returns Array of Reception objects
 */
export const generateOtherRooms = (): { count: number; data: Prisma.OtherRoomCreateWithoutPropertyInput[] } => {
  const otherRoomCount = faker.number.int({ min: 1, max: 3 });
  return {
    count: otherRoomCount,
    data: Array.from({ length: otherRoomCount }, (_, i) => ({
      roomNumber: i + 1,
      floor: faker.number.int({ min: 0, max: 3 }),
      name: faker.word.words(2),
      type: faker.helpers.arrayElement(Object.values(OtherRoomType)),
      description: faker.word.words(10),
      size: faker.number.int({ min: 10, max: 50 }),
      openPlan: faker.datatype.boolean(),
      fireplace: faker.helpers.arrayElement(Object.values(FireplaceType)),
      balcony: faker.datatype.boolean(),
      openConcept: faker.datatype.boolean(),
      barArea: faker.datatype.boolean(),
      builtInDesk: faker.datatype.boolean(),
      builtInStorage: faker.datatype.boolean(),
      builtInShelving: faker.datatype.boolean(),
      hasView: faker.datatype.boolean(),
      soundProofing: faker.datatype.boolean(),
      accousticPanels: faker.datatype.boolean(),
      stoneFlooring: faker.datatype.boolean(),
      hardwoodFlooring: faker.datatype.boolean(),
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
    storage: faker.datatype.boolean(),
    sink: faker.datatype.boolean(),
    plumbing: faker.datatype.boolean(),
    size: faker.number.float({ min: 5, max: 50 }),
  };
};

/**
 * Generate media objects for a specific room type
 *
 * @param roomId - The ID of the room to link the media to
 * @param roomType - The type of room (bedroom, bathroom, reception, otherRoom)
 * @param roomName - The display name of the room (for metadata)
 * @returns Array of media objects
 */
export const generateMediaForRoom = (roomId: number, roomType: 'bedroom' | 'bathroom' | 'reception' | 'otherRoom', roomName: string): Prisma.MediaUncheckedCreateWithoutPropertyInput[] => {
  const mediaCount = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: mediaCount }, () => {
    // Use realistic real estate image dimensions
    // 2048x1536 for high-quality web display (4:3 aspect ratio)
    // Common in real estate photography for MLS and web platforms
    const width = 2048;
    const height = 1536;
    
    const mediaData: Prisma.MediaUncheckedCreateWithoutPropertyInput = {
      image: faker.image.urlPicsumPhotos({ width, height }),
      metadata: JSON.stringify({
        alt: `${roomName} - ${faker.word.words(3)}`,
        description: faker.word.words(5),
        roomType: roomName,
        dimensions: `${width}x${height}`,
        aspectRatio: '4:3'
      }),
    };

    // Set the appropriate room ID based on room type
    switch (roomType) {
      case 'bedroom':
        mediaData.bedroomId = roomId;
        break;
      case 'bathroom':
        mediaData.bathroomId = roomId;
        break;
      case 'reception':
        mediaData.receptionId = roomId;
        break;
      case 'otherRoom':
        mediaData.otherRoomId = roomId;
        break;
    }

    return mediaData;
  });
};

/**
 * Generate general property media (not tied to specific rooms)
 *
 * @param imageType - The type of general image (Exterior, Hallway, etc.)
 * @returns Media object
 */
export const generateGeneralMedia = (imageType: string): Prisma.MediaUncheckedCreateWithoutPropertyInput => {
  const width = 2048;
  const height = 1536;
  
  return {
    image: faker.image.urlPicsumPhotos({ width, height }),
    metadata: JSON.stringify({
      alt: `${imageType} - ${faker.word.words(3)}`,
      description: faker.word.words(5),
      roomType: imageType,
      dimensions: `${width}x${height}`,
      aspectRatio: '4:3'
    }),
    // No room IDs set - this is general property media
  };
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
    description: faker.word.words(20),
  };
};

export const generateAddress = (address: any) => {
  return {
    street: address.street,
    city: address.city,
    postcode: address.postcode,
    fullAddress: address.street + ", " + address.city + ", " + address.postcode,
    lat: address.lat,
    lon: address.lon,
  }
}
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
  const { count: otherRoomCount, data: otherRooms } = generateOtherRooms();

  // First create the property with all features
  const propertyWithFeatures = await prisma.property.create({
    data: {
      title: faker.word.words(10),
      description: faker.word.words(20),
      value: roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
      totalFloors: faker.number.int({ min: 1, max: 5 }),
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
      numberOtherRooms: otherRoomCount,
      bathroomFeatures: {
        create: bathrooms,
      },
      bedroomFeatures: {
        create: bedrooms,
      },
      kitchenFeatures: {
        create: generateKitchen(),
      },
      reception: {
        create: receptions,
      },
      otherRoom: {
        create: otherRooms,
      },
      utility: {
        create: generateUtility(),
      },
      outdoorSpace: {
        create: generateOutDoorSpace(),
      },
      parking: {
        create: generateParking(),
      },
      energyAndUtilities: {
        create: generateEnergyAndUtilities(),
      },
      address: {
        create: generateAddress(address),
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
      bedroomFeatures: true,
      bathroomFeatures: true,
      otherRoom: true,
      reception: true,
      kitchenFeatures: true,
      outdoorSpace: true,
      utility: true,
    },
  });

  // Now create media for each feature
  const mediaToCreate: Prisma.MediaUncheckedCreateWithoutPropertyInput[] = [];
  
  // General property images (exterior, hallways, etc.)
  const generalImageTypes = ['Exterior', 'Hallway', 'Staircase', 'Entrance', 'Overview', 'Garden', 'Street View'];
  const generalImageCount = faker.number.int({ min: 2, max: 5 });
  for (let i = 0; i < generalImageCount; i++) {
    const imageType = faker.helpers.arrayElement(generalImageTypes);
    mediaToCreate.push(generateGeneralMedia(imageType));
  }
  
  // Bedroom media
  propertyWithFeatures.bedroomFeatures.forEach((bedroom: { id: number; roomNumber: any; }) => {
    mediaToCreate.push(...generateMediaForRoom(bedroom.id, 'bedroom', `Bedroom ${bedroom.roomNumber}`));
  });
  
  // Bathroom media
  propertyWithFeatures.bathroomFeatures.forEach((bathroom: { id: number; roomNumber: any; }) => {
    mediaToCreate.push(...generateMediaForRoom(bathroom.id, 'bathroom', `Bathroom ${bathroom.roomNumber}`));
  });
  
  // Reception media
  propertyWithFeatures.reception.forEach((reception: { id: number; roomNumber: any; }) => {
    mediaToCreate.push(...generateMediaForRoom(reception.id, 'reception', `Reception ${reception.roomNumber}`));
  });

  // Other room media
  propertyWithFeatures.otherRoom.forEach((otherRoom: { id: number; roomNumber: any; }) => {
    mediaToCreate.push(...generateMediaForRoom(otherRoom.id, 'otherRoom', `Other Room ${otherRoom.roomNumber}`));
  });
  
  // Kitchen media (general property media since it's not room-specific)
  if (propertyWithFeatures.kitchenFeatures) {
    mediaToCreate.push(generateGeneralMedia('Kitchen'));
  }
  
  // Outdoor space media (general property media)
  if (propertyWithFeatures.outdoorSpace) {
    mediaToCreate.push(generateGeneralMedia('Outdoor Space'));
  }
  
  // Utility media (general property media)
  if (propertyWithFeatures.utility) {
    mediaToCreate.push(generateGeneralMedia('Utility'));
  }

  // Create all media
  if (mediaToCreate.length > 0) {
    await prisma.media.createMany({
      data: mediaToCreate.map(media => ({
        ...media,
        propertyId: propertyWithFeatures.id,
      })),
    });
  }

  // Return the property with just address for compatibility
  const property: PropertyWithAddress = {
    ...propertyWithFeatures,
    address: propertyWithFeatures.address,
  };

  const updateLocation = await updateLocationByAddressIdForSeed(property.addressId, property.address.lon!, property.address.lat!);
  const location = await getLocationByAddressIdForSeed(property.addressId);

  return property;
};
