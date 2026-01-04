// imports require .ts extension to run seed
import { faker } from "@faker-js/faker";
import { AccessibilityFeature, BathroomFeature, BedSizeType, BedroomFeature, BoilerType, BroadbandType, BuildingFeature, ConnectedUtilities, ConstructionType, EPCRating, HeatingType, HotWaterSource, KitchenFeature, LandFeature, OtherRoomType, OutdoorSpaceFeature, ParkingFeature, ReceptionType, RenewableEnergy, RoomFeature, SecurityFeature, StorageFeature, UtilityFeature, type Address, type Prisma } from "../../../database/server/database/prisma/generated/client";
import { roundFloat } from "../../../../shared/utils/numbers";
import { typeToClassificationMap } from "./property-type-map";
import type { PropertyWithAddress } from "../../../../shared/types/property";
import { updateLocationByAddressIdForSeed, getLocationByAddressIdForSeed } from "./location-for-seed";
import { getRequiredImages, getRandomAdditionalImages, getAllImagesByRoom } from "./images-to-seed";
import type { AddressCreateWithoutPropertiesInput } from "../../../database/server/database/prisma/generated/models";
import { prisma } from "../../../database/server/utils/prisma-client";

/**
 * Helper function to randomly select enum values based on probability
 * @param enumValues - Array of enum values
 * @param probability - Probability for each enum to be included (0-1)
 * @returns Array of selected enum values
 */
const selectRandomEnumValues = <T>(enumValues: T[], probability: number = 0.3): T[] => {
  return enumValues.filter(() => faker.datatype.boolean({ probability }));
};

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
    features: selectRandomEnumValues(Object.values(BuildingFeature), 0.4),
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
    features: selectRandomEnumValues(Object.values(AccessibilityFeature), 0.3),
  };
};

/**
 * Generate a random number of bathrooms
 *
 * @param totalFloors - The total number of floors in the property
 * @returns Array of bathrooms
 */
export const generateBathrooms = (totalFloors: number): { count: number; data: Prisma.BathroomCreateWithoutPropertyInput[] } => {
  // 50% of properties have 2 bathrooms, 50% have 1 bathroom
  const bathroomCount = faker.datatype.boolean({ probability: 0.5 }) ? 2 : 1;
  
  const bathroomNames = [
    'Master Bathroom',
    'Guest Bathroom',
    'Family Bathroom',
    'En Suite Bathroom',
    'Powder Room',
    'Shared Bathroom',
  ];
  
  const bathrooms = Array.from({ length: bathroomCount }, (_, i) => {
    const features = selectRandomEnumValues(Object.values(BathroomFeature), 0.6);
    // Ground floor bathroom not en-suite
    if (i === 0 && features.includes(BathroomFeature.EN_SUITE)) {
      const index = features.indexOf(BathroomFeature.EN_SUITE);
      features.splice(index, 1);
    }
    return {
      roomNumber: i + 1,
      floor: i === 0 ? 0 : faker.number.int({ min: 1, max: totalFloors }),
      name: faker.helpers.arrayElement(bathroomNames),
      description: faker.word.words(10),
      features,
      size: faker.number.int({ min: 10, max: 50 }),
    };
  });
  
  return {
    count: bathroomCount,
    data: bathrooms,
  };
};

/**
 * Generate a random number of bedrooms
 *
 * @param totalFloors - The total number of floors in the property
 * @returns Array of bedrooms
 */
export const generateBedrooms = (totalFloors: number): { count: number; data: Prisma.BedroomCreateWithoutPropertyInput[] } => {
  const bedroomCount = faker.number.int({ min: 1, max: 5 });
  const bedroomNames = [
    'Master Bedroom',
    'Guest Bedroom',
    'Child\'s Bedroom',
    'Spare Bedroom',
    'Nursery',
    'Teenager\'s Bedroom',
  ];
  return {
    count: bedroomCount,
    data: Array.from({ length: bedroomCount }, (_, i) => ({
      roomNumber: i + 1,
      name: faker.helpers.arrayElement(bedroomNames),
      floor: faker.number.int({ min: 1, max: totalFloors }),
      bed: [faker.helpers.arrayElement(Object.values(BedSizeType))],
      description: faker.word.words(10),
      features: selectRandomEnumValues(Object.values(BedroomFeature), 0.4),
      size: faker.number.int({ min: 10, max: 50 }),
    })),
  };
};

/**
 * Generate random Kitchen object
 *
 * @param totalFloors - The total number of floors in the property
 * @returns KitchenWithoutPropertyInput
 */
export const generateKitchen = (totalFloors: number): { count: number, data: Prisma.KitchenCreateWithoutPropertyInput[] } => {
  const kitchenCount = faker.number.int({ min: 1, max: 3 });
  return {
    count: kitchenCount,
    data: Array.from({ length: kitchenCount }, () => ({
      roomNumber: faker.number.int({ min: 1, max: 3 }),
      floor: faker.number.int({ min: 1, max: totalFloors }),
      name: faker.word.words(2),
      features: selectRandomEnumValues(Object.values(KitchenFeature), 0.5),
      description: faker.word.words(10),
      size: faker.number.int({ min: 10, max: 50 }),
    }))
  };
};

/**
 * Generate a random number of reception objects
 *
 * @param totalFloors - The total number of floors in the property
 * @returns Array of Reception objects
 */
export const generateReception = (totalFloors: number): { count: number; data: Prisma.ReceptionCreateWithoutPropertyInput[] } => {
  const receptionCount = faker.number.int({ min: 1, max: 3 });
  return {
    count: receptionCount,
    data: Array.from({ length: receptionCount }, (_, i) => {
      const features = selectRandomEnumValues(Object.values(RoomFeature), 0.35);
      // Add fireplace randomly
      if (faker.datatype.boolean({ probability: 0.3 })) {
        features.push(RoomFeature.FIREPLACE);
      }
      return {
        roomNumber: i + 1,
        floor: faker.number.int({ min: 1, max: totalFloors }),
        name: faker.word.words(2),
        type: faker.helpers.arrayElement(Object.values(ReceptionType)),
        description: faker.word.words(10),
        size: faker.number.int({ min: 10, max: 50 }),
        features,
      };
    }),
  };
};

/**
 * Generate a random number of reception objects
 *
 * @param totalFloors - The total number of floors in the property
 * @returns Array of Reception objects
 */
export const generateOtherRooms = (totalFloors: number): { count: number; data: Prisma.OtherRoomCreateWithoutPropertyInput[] } => {
  const otherRoomCount = faker.number.int({ min: 1, max: 3 });
  return {
    count: otherRoomCount,
    data: Array.from({ length: otherRoomCount }, (_, i) => {
      const features: RoomFeature[] = selectRandomEnumValues(Object.values(RoomFeature).filter(f => f !== RoomFeature.FIREPLACE && f !== RoomFeature.CONSERVATORY) as RoomFeature[], 0.35);
      // Add fireplace randomly
      if (faker.datatype.boolean({ probability: 0.25 })) {
        features.push(RoomFeature.FIREPLACE);
      }
      return {
        roomNumber: i + 1,
        floor: faker.number.int({ min: 0, max: totalFloors - 1 }),
        name: faker.word.words(2),
        type: faker.helpers.arrayElement(Object.values(OtherRoomType)),
        description: faker.word.words(10),
        size: faker.number.int({ min: 10, max: 50 }),
        features,
      };
    }),
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
    features: selectRandomEnumValues(Object.values(UtilityFeature), 0.6),
    size: faker.number.float({ min: 5, max: 50 }),
  };
};

/**
 * Generate media objects for a specific room type using Cloudflare images
 *
 * @param roomId - The ID of the room to link the media to
 * @param roomType - The type of room (bedroom, bathroom, reception, otherRoom, garden, kitchen, outdoorSpace, yard)
 * @param roomName - The display name of the room (for metadata)
 * @returns Array of media objects
 */
export const generateMediaForRoom = (roomId: number, roomType: 'bedroom' | 'bathroom' | 'reception' | 'otherRoom' | 'garden' | 'kitchen' | 'outdoorSpace' | 'land' | 'yard', roomName: string): Prisma.MediaUncheckedCreateWithoutPropertyInput[] => {
  const mediaCount = faker.number.int({ min: 1, max: 2 });
  const allImagesByRoom = getAllImagesByRoom();
  
  return Array.from({ length: mediaCount }, () => {
    let imageId: string;
    
    // Map room types to image collections
    switch (roomType) {
      case 'bedroom':
        imageId = faker.helpers.arrayElement(allImagesByRoom.bedroom);
        break;
      case 'bathroom':
        imageId = faker.helpers.arrayElement(allImagesByRoom.bathroom);
        break;
      case 'kitchen':
        imageId = faker.helpers.arrayElement(allImagesByRoom.kitchen);
        break;
      case 'garden':
      case 'outdoorSpace':
      case 'land':
      case 'yard':
        imageId = faker.helpers.arrayElement(allImagesByRoom.garden);
        break;
      case 'reception':
        imageId = faker.helpers.arrayElement(allImagesByRoom.livingroom);
        break;
      case 'otherRoom':
        // For other rooms, randomly pick from homeoffice, garage, or bathroom
        const otherRoomOptions = [...allImagesByRoom.homeoffice, ...allImagesByRoom.garage, ...allImagesByRoom.bathroom];
        imageId = faker.helpers.arrayElement(otherRoomOptions);
        break;
      default:
        imageId = faker.helpers.arrayElement(allImagesByRoom.house);
        break;
    }
    
    const mediaData: Prisma.MediaUncheckedCreateWithoutPropertyInput = {
      image: imageId,
      metadata: JSON.stringify({
        alt: `${roomName} - ${faker.word.words(3)}`,
        description: faker.word.words(5),
        roomType: roomName,
        cloudflareImageId: imageId
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
      case 'garden':
        mediaData.gardenId = roomId;
        break;
      case 'outdoorSpace':
        mediaData.outdoorSpaceId = roomId;
        break;
      case 'land':
        mediaData.landId = roomId;
        break;
      case 'yard':
        mediaData.yardId = roomId;
        break;
      case 'kitchen':
        mediaData.kitchenId = roomId;
        break;
    }

    return mediaData;
  });
};

/**
 * Generate general property media (not tied to specific rooms) using Cloudflare images
 *
 * @param imageType - The type of general image (Exterior, Hallway, etc.)
 * @returns Media object
 */
export const generateGeneralMedia = (imageType: string): Prisma.MediaUncheckedCreateWithoutPropertyInput => {
  const allImagesByRoom = getAllImagesByRoom();
  let imageId: string;
  
  // Map general image types to appropriate room collections
  switch (imageType.toLowerCase()) {
    case 'exterior':
    case 'entrance':
    case 'street view':
      imageId = faker.helpers.arrayElement(allImagesByRoom.house);
      break;
    case 'garden':
      imageId = faker.helpers.arrayElement(allImagesByRoom.garden);
      break;
    case 'hallway':
    case 'staircase':
    case 'overview':
      imageId = faker.helpers.arrayElement(allImagesByRoom.livingroom);
      break;
    case 'utility':
      imageId = faker.helpers.arrayElement(allImagesByRoom.garage);
      break;
    default:
      imageId = faker.helpers.arrayElement(allImagesByRoom.house);
      break;
  }
  
  return {
    image: imageId,
    metadata: JSON.stringify({
      alt: `${imageType} - ${faker.word.words(3)}`,
      description: faker.word.words(5),
      roomType: imageType,
      cloudflareImageId: imageId
    }),
    // No room IDs set - this is general property media
  };
};

/**
 * Generate a random garden object with position-appropriate features
 *
 * @param position - The position of the garden (FRONT, REAR, SIDE)
 * @returns Random Garden object
 */
export const generateGarden = (position: 'FRONT' | 'REAR' | 'SIDE'): Prisma.GardenCreateWithoutOutdoorSpaceInput => {
  // Generate name based on position
  const name = position === 'FRONT' ? 'Front Garden' : 
               position === 'REAR' ? 'Rear Garden' : 
               'Side Garden';

  // Randomly decide if this garden has additional details
  const additionalDetails = faker.datatype.boolean({ probability: 0.50 }); // 50% chance of having details

  // Base garden features
  const baseGarden = {
    name: name,
    description: additionalDetails ? faker.word.words(10) : null,
    size: parseFloat(faker.number.float({ min: 10, max: 150, fractionDigits: 2 }).toFixed(2)),
    additionalDetails: additionalDetails,
    facing: faker.helpers.arrayElement(['NORTH', 'EAST', 'SOUTH', 'WEST'] as const),
    position: position,
  };

  // Only add features if additionalDetails is true
  if (!additionalDetails) {
    return {
      ...baseGarden,
      features: [],
    };
  }

  let featureProbabilities: Record<OutdoorSpaceFeature, number>;
  
  if (position === 'REAR') {
    featureProbabilities = {
      [OutdoorSpaceFeature.SUN_TERRACE]: 0.45,
      [OutdoorSpaceFeature.TERRACE]: 0.55,
      [OutdoorSpaceFeature.BALCONY]: 0.30,
      [OutdoorSpaceFeature.PATIO]: 0.75,
      [OutdoorSpaceFeature.SHED]: 0.65,
      [OutdoorSpaceFeature.SUMMER_HOUSE]: 0.25,
      [OutdoorSpaceFeature.GARDEN_OFFICE]: 0.30,
      [OutdoorSpaceFeature.POOL]: 0.08,
      [OutdoorSpaceFeature.SEPARATE_PARCEL]: 0.05,
    };
  } else if (position === 'FRONT') {
    featureProbabilities = {
      [OutdoorSpaceFeature.SUN_TERRACE]: 0.20,
      [OutdoorSpaceFeature.TERRACE]: 0.25,
      [OutdoorSpaceFeature.BALCONY]: 0.20,
      [OutdoorSpaceFeature.PATIO]: 0.35,
      [OutdoorSpaceFeature.SHED]: 0.20,
      [OutdoorSpaceFeature.SUMMER_HOUSE]: 0.10,
      [OutdoorSpaceFeature.GARDEN_OFFICE]: 0.10,
      [OutdoorSpaceFeature.POOL]: 0.04,
      [OutdoorSpaceFeature.SEPARATE_PARCEL]: 0.05,
    };
  } else {
    featureProbabilities = {
      [OutdoorSpaceFeature.SUN_TERRACE]: 0.25,
      [OutdoorSpaceFeature.TERRACE]: 0.35,
      [OutdoorSpaceFeature.BALCONY]: 0.25,
      [OutdoorSpaceFeature.PATIO]: 0.40,
      [OutdoorSpaceFeature.SHED]: 0.45,
      [OutdoorSpaceFeature.SUMMER_HOUSE]: 0.15,
      [OutdoorSpaceFeature.GARDEN_OFFICE]: 0.18,
      [OutdoorSpaceFeature.POOL]: 0.04,
      [OutdoorSpaceFeature.SEPARATE_PARCEL]: 0.05,
    };
  }

  const features = Object.entries(featureProbabilities)
    .filter(([_, prob]) => faker.datatype.boolean({ probability: prob }))
    .map(([feature]) => feature as OutdoorSpaceFeature);

  return {
    ...baseGarden,
    features,
  };
};

/**
 * Generate land with features
 *
 * @returns Random Land object
 */
export const generateLand = (): Prisma.LandCreateWithoutOutdoorSpaceInput => {
  const landNames = [
    'Main Land',
    'Additional Land',
    'Field',
    'Paddock',
    'Woodland Area',
    'Orchard',
  ];

  // Randomly decide if this land has additional details
  const additionalDetails = faker.datatype.boolean({ probability: 0.50 }); // 50% chance of having details

  return {
    name: faker.helpers.arrayElement(landNames),
    description: additionalDetails ? faker.word.words(10) : null,
    size: parseFloat(faker.number.float({ min: 50, max: 500, fractionDigits: 2 }).toFixed(2)),
    additionalDetails: additionalDetails,
    separateParcel: faker.datatype.boolean({ probability: 0.3 }),
    features: additionalDetails ? selectRandomEnumValues(Object.values(LandFeature), 0.35) : [],
  };
};

/**
 * Generate a yard with features
 *
 * @param position - The position of the yard (FRONT, REAR, SIDE)
 * @returns Random Yard object
 */
export const generateYard = (position: 'FRONT' | 'REAR' | 'SIDE'): Prisma.YardCreateWithoutOutdoorSpaceInput => {
  // Generate name based on position
  const name = position === 'FRONT' ? 'Front Yard' : 
               position === 'REAR' ? 'Rear Yard' : 
               'Side Yard';

  // Randomly decide if this yard has additional details
  const additionalDetails = faker.datatype.boolean({ probability: 0.50 }); // 50% chance of having details

  // Base yard features
  const baseYard = {
    name: name,
    description: additionalDetails ? faker.word.words(10) : null,
    size: parseFloat(faker.number.float({ min: 10, max: 150, fractionDigits: 2 }).toFixed(2)),
    additionalDetails: additionalDetails,
    facing: faker.helpers.arrayElement(['NORTH', 'EAST', 'SOUTH', 'WEST'] as const),
    position: position,
  };

  // Only add features if additionalDetails is true
  if (!additionalDetails) {
    return {
      ...baseYard,
      features: [],
    };
  }

  let featureProbabilities: Record<OutdoorSpaceFeature, number>;
  
  if (position === 'REAR') {
    featureProbabilities = {
      [OutdoorSpaceFeature.SUN_TERRACE]: 0.45,
      [OutdoorSpaceFeature.TERRACE]: 0.55,
      [OutdoorSpaceFeature.BALCONY]: 0.30,
      [OutdoorSpaceFeature.PATIO]: 0.75,
      [OutdoorSpaceFeature.SHED]: 0.65,
      [OutdoorSpaceFeature.SUMMER_HOUSE]: 0.25,
      [OutdoorSpaceFeature.GARDEN_OFFICE]: 0.30,
      [OutdoorSpaceFeature.POOL]: 0.08,
      [OutdoorSpaceFeature.SEPARATE_PARCEL]: 0.05,
    };
  } else if (position === 'FRONT') {
    featureProbabilities = {
      [OutdoorSpaceFeature.SUN_TERRACE]: 0.20,
      [OutdoorSpaceFeature.TERRACE]: 0.25,
      [OutdoorSpaceFeature.BALCONY]: 0.20,
      [OutdoorSpaceFeature.PATIO]: 0.35,
      [OutdoorSpaceFeature.SHED]: 0.20,
      [OutdoorSpaceFeature.SUMMER_HOUSE]: 0.10,
      [OutdoorSpaceFeature.GARDEN_OFFICE]: 0.10,
      [OutdoorSpaceFeature.POOL]: 0.04,
      [OutdoorSpaceFeature.SEPARATE_PARCEL]: 0.05,
    };
  } else {
    featureProbabilities = {
      [OutdoorSpaceFeature.SUN_TERRACE]: 0.25,
      [OutdoorSpaceFeature.TERRACE]: 0.35,
      [OutdoorSpaceFeature.BALCONY]: 0.25,
      [OutdoorSpaceFeature.PATIO]: 0.40,
      [OutdoorSpaceFeature.SHED]: 0.45,
      [OutdoorSpaceFeature.SUMMER_HOUSE]: 0.15,
      [OutdoorSpaceFeature.GARDEN_OFFICE]: 0.18,
      [OutdoorSpaceFeature.POOL]: 0.04,
      [OutdoorSpaceFeature.SEPARATE_PARCEL]: 0.05,
    };
  }

  const features = Object.entries(featureProbabilities)
    .filter(([_, prob]) => faker.datatype.boolean({ probability: prob }))
    .map(([feature]) => feature as OutdoorSpaceFeature);

  return {
    ...baseYard,
    features,
  };
};

/**
 * Generate outdoor space with gardens, yards and land
 *
 * @returns Random OutdoorSpace object
 */
export const generateOutdoorSpace = (): Prisma.OutdoorSpaceCreateWithoutPropertyInput => {
  const hasGarden = faker.datatype.boolean({ probability: 0.80 }); // 80% chance
  const hasYard = faker.datatype.boolean({ probability: 0.80 }); // 80% chance
  const hasLand = faker.datatype.boolean({ probability: 0.80 }); // 80% chance
  
  if (!hasGarden && !hasYard && !hasLand) {
    return {
      description: faker.word.words(10),
      garden: {
        create: []
      },
      yard: {
        create: []
      },
      land: {
        create: []
      }
    };
  }

  const gardens: Prisma.GardenCreateWithoutOutdoorSpaceInput[] = [];
  const yards: Prisma.YardCreateWithoutOutdoorSpaceInput[] = [];
  const lands: Prisma.LandCreateWithoutOutdoorSpaceInput[] = [];
  
  // Generate gardens
  if (hasGarden) {
    if (faker.datatype.boolean({ probability: 0.70 })) {
      gardens.push(generateGarden('FRONT'));
    }
    
    if (faker.datatype.boolean({ probability: 0.85 })) {
      gardens.push(generateGarden('REAR'));
    }
    
    if (faker.datatype.boolean({ probability: 0.35 })) {
      gardens.push(generateGarden('SIDE'));
    }

    if (gardens.length === 0) {
      gardens.push(generateGarden('REAR'));
    }
  }

  // Generate yards
  if (hasYard) {
    if (faker.datatype.boolean({ probability: 0.70 })) {
      yards.push(generateYard('FRONT'));
    }
    
    if (faker.datatype.boolean({ probability: 0.85 })) {
      yards.push(generateYard('REAR'));
    }
    
    if (faker.datatype.boolean({ probability: 0.35 })) {
      yards.push(generateYard('SIDE'));
    }

    if (yards.length === 0) {
      yards.push(generateYard('REAR'));
    }
  }

  // Generate land (1-2 parcels)
  if (hasLand) {
    const landCount = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < landCount; i++) {
      lands.push(generateLand());
    }
  }

  // Calculate total area as sum of all garden, yard, and land sizes
  let totalArea: number | null = null;
  const gardenSizes = gardens.map(g => g.size || 0);
  const yardSizes = yards.map(y => y.size || 0);
  const landSizes = lands.map(l => l.size || 0);
  
  const allSizes = [...gardenSizes, ...yardSizes, ...landSizes];
  if (allSizes.length > 0) {
    totalArea = parseFloat(allSizes.reduce((sum, size) => sum + size, 0).toFixed(2));
  }

  return {
    description: faker.word.words(10),
    totalArea: totalArea,
    // Features for the outdoor space itself
    features: selectRandomEnumValues(Object.values(OutdoorSpaceFeature), 0.35),
    garden: {
      create: gardens
    },
    yard: {
      create: yards
    },
    land: {
      create: lands
    }
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
    features: selectRandomEnumValues(Object.values(ParkingFeature), 0.4),
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
    features: selectRandomEnumValues(Object.values(SecurityFeature), 0.35),
  };
};

/**
 * Generate random Storage data
 *
 * @returns Random Storage object
 */
export const generateStorage = (): Prisma.StorageCreateWithoutPropertyInput => {
  return {
    description: faker.word.words(20),
    features: selectRandomEnumValues(Object.values(StorageFeature), 0.4),
  };
};

/**
 * Generate fake amenities for seeding
 */
export const generateFakeAmenities = (): Prisma.AmenitiesCreateWithoutPropertyInput[] => {
  const amenities: Prisma.AmenitiesCreateWithoutPropertyInput[] = [];

  // Generate some schools
  for (let i = 0; i < 3; i++) {
    amenities.push({
      type: 'EDUCATION',
      subtype: 'SCHOOL',
      name: faker.company.name() + ' School',
      distanceM: faker.number.int({ min: 100, max: 9000 }),
      description: null,
    });
  }

  // Generate some hospitals
  for (let i = 0; i < 3; i++) {
    amenities.push({
      type: 'HEALTHCARE',
      subtype: 'HOSPITAL',
      name: faker.company.name() + ' Hospital',
      distanceM: faker.number.int({ min: 100, max: 9000 }),
      description: null,
    });
  }

  // Generate train stations
  for (let i = 0; i < 3; i++) {
    amenities.push({
      type: 'TRANSPORT',
      subtype: 'TRAIN_STATION',
      name: faker.location.city() + ' Train Station',
      distanceM: faker.number.int({ min: 100, max: 9000 }),
      description: null,
    });
  }

  // Generate bus stations
  for (let i = 0; i < 3; i++) {
    amenities.push({
      type: 'TRANSPORT',
      subtype: 'BUS_STOP',
      name: faker.location.street() + ' Bus Stop',
      distanceM: faker.number.int({ min: 100, max: 9000 }),
      description: null,
    });
  }

  // Generate parks
  for (let i = 0; i < 3; i++) {
    amenities.push({
      type: 'GREEN_SPACE',
      subtype: 'PARK',
      name: faker.location.city() + ' Park',
      distanceM: faker.number.int({ min: 100, max: 9000 }),
      description: null,
    });
  }

  // Generate gyms
  for (let i = 0; i < 3; i++) {
    amenities.push({
      type: 'SHOPPING_ENTERTAINMENT',
      subtype: 'GYM',
      name: faker.company.name() + ' Gym',
      distanceM: faker.number.int({ min: 100, max: 9000 }),
      description: null,
    });
  }

  return amenities;
};

export const generateAddress = (address: AddressCreateWithoutPropertiesInput) => {
  return {
    number: address.number,
    flat: address.flat,
    name: address.name,
    street: address.street,
    city: address.city,
    postcode: address.postcode,
    locality: address.locality,
    county: address.county,
    district: address.district,
    country: address.country,
    fullAddress: address.number + ", " + address.street + ", " + address.city + ", " + address.postcode,
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
  // Generate mapped property types and classifications with weighted distribution:
  // 70% houses (1), 5% cottages (2), 5% bungalows (3), 5% flats (4), 15% other (5-8)
  const weightedTypeIds = [
    ...Array(70).fill(1),  // 70% House
    ...Array(5).fill(2),   // 5% Cottage
    ...Array(5).fill(3),   // 5% Bungalow
    ...Array(5).fill(4),   // 5% Flat
    ...Array(4).fill(5),   // 4% Land
    ...Array(4).fill(6),   // 4% Farms
    ...Array(4).fill(7),   // 4% Specialty
    ...Array(3).fill(8),   // 3% Student Accommodation
  ];
  const typeId = faker.helpers.arrayElement(weightedTypeIds);
  const classificationOptions = typeToClassificationMap[typeId];
  const classificationId = faker.helpers.arrayElement(classificationOptions!);

  // Generate totalFloors first so we can constrain room floor numbers
  const totalFloors = faker.number.int({ min: 1, max: 5 });

  const { count: bedroomCount, data: bedrooms } = generateBedrooms(totalFloors);
  const { count: bathroomCount, data: bathrooms } = generateBathrooms(totalFloors);
  const { count: receptionCount, data: receptions } = generateReception(totalFloors);
  const { count: otherRoomCount, data: otherRooms } = generateOtherRooms(totalFloors);
  const { count: kitchenCount, data: kitchens } = generateKitchen(totalFloors);

  // First create the property with all features
  const propertyWithFeatures = await prisma.property.create({
    data: {
      description: faker.word.words(20),
      value: roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
      totalFloors,
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
      amenities: {
        create: generateFakeAmenities(),
      },
      numberBedrooms: bedroomCount,
      numberBathrooms: bathroomCount,
      numberReceptions: receptionCount,
      numberOtherRooms: otherRoomCount,
      numberKitchens: kitchenCount,
      bathroomFeatures: {
        create: bathrooms,
      },
      bedroomFeatures: {
        create: bedrooms,
      },
      kitchenFeatures: {
        create: kitchens,
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
      outdoorSpace: faker.datatype.boolean({ probability: 0.8 }) ? {
        create: generateOutdoorSpace(),
      } : undefined,
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
      outdoorSpace: {
        include: {
          garden: true,
          yard: true,
          land: true
        }
      },
      utility: true,
    },
  });

  // Now create media for each feature
  const mediaToCreate: Prisma.MediaUncheckedCreateWithoutPropertyInput[] = [];
  
  // Get required images first (mandatory room types)
  const requiredImages = getRequiredImages();
  const requiredImageIds = Object.values(requiredImages);
  
  // Add required property images
  mediaToCreate.push(generateGeneralMedia('Exterior')); // house image
  mediaToCreate.push(generateGeneralMedia('Garden')); // garden image
  
  // Add images for dining room and home office as general property media since they don't have dedicated tables
  const allImagesByRoom = getAllImagesByRoom();
  mediaToCreate.push({
    image: requiredImages.diningroom,
    metadata: JSON.stringify({
      alt: 'Dining Room',
      description: faker.word.words(5),
      roomType: 'Dining Room',
      cloudflareImageId: requiredImages.diningroom
    }),
  });
  
  mediaToCreate.push({
    image: requiredImages.homeoffice,
    metadata: JSON.stringify({
      alt: 'Home Office',
      description: faker.word.words(5),
      roomType: 'Home Office',
      cloudflareImageId: requiredImages.homeoffice
    }),
  });
  
  // Bedroom media - ensure at least one uses required bedroom image
  propertyWithFeatures.bedroomFeatures.forEach((bedroom: { id: number; roomNumber: any; }, index: number) => {
    if (index === 0) {
      // First bedroom gets the required bedroom image
      mediaToCreate.push({
        image: requiredImages.bedroom,
        metadata: JSON.stringify({
          alt: `Bedroom ${bedroom.roomNumber}`,
          description: faker.word.words(5),
          roomType: `Bedroom ${bedroom.roomNumber}`,
          cloudflareImageId: requiredImages.bedroom
        }),
        bedroomId: bedroom.id,
      });
    } else {
      // Other bedrooms get random bedroom images
      mediaToCreate.push(...generateMediaForRoom(bedroom.id, 'bedroom', `Bedroom ${bedroom.roomNumber}`));
    }
  });

  propertyWithFeatures.kitchenFeatures.forEach((kitchen: { id: number; roomNumber: any; }) => {
    mediaToCreate.push(...generateMediaForRoom(kitchen.id, 'kitchen', `Kitchen ${kitchen.roomNumber}`));
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
  
  // OutdoorSpace, Garden, Yard and Land media
  if (propertyWithFeatures.outdoorSpace) {
    // Add media for outdoor space itself
    mediaToCreate.push(...generateMediaForRoom(propertyWithFeatures.outdoorSpace.id, 'outdoorSpace', 'Outdoor Space'));
    
    // Add media for each garden
    if (propertyWithFeatures.outdoorSpace.garden) {
      propertyWithFeatures.outdoorSpace.garden.forEach((garden: { id: number; position: string | null; }) => {
        const gardenName = garden.position ? `${garden.position.charAt(0)}${garden.position.slice(1).toLowerCase()} Garden` : 'Garden';
        mediaToCreate.push(...generateMediaForRoom(garden.id, 'garden', gardenName));
      });
    }
    
    // Add media for each yard
    if (propertyWithFeatures.outdoorSpace.yard) {
      propertyWithFeatures.outdoorSpace.yard.forEach((yard: { id: number; position: string | null; }) => {
        const yardName = yard.position ? `${yard.position.charAt(0)}${yard.position.slice(1).toLowerCase()} Yard` : 'Yard';
        mediaToCreate.push(...generateMediaForRoom(yard.id, 'yard', yardName));
      });
    }
    
    // Add media for each land parcel
    if (propertyWithFeatures.outdoorSpace.land) {
      propertyWithFeatures.outdoorSpace.land.forEach((land: { id: number; name: string | null; }) => {
        const landName = land.name || 'Land';
        mediaToCreate.push(...generateMediaForRoom(land.id, 'land', landName));
      });
    }
  }
  
  // Add additional random images to ensure minimum of 5 total images
  const currentImageCount = mediaToCreate.length;
  if (currentImageCount < 5) {
    const additionalImagesNeeded = 5 - currentImageCount;
    const additionalImages = getRandomAdditionalImages(additionalImagesNeeded, requiredImageIds as string[]);
    
    additionalImages.forEach((imageId: string) => {
      mediaToCreate.push({
        image: imageId,
        metadata: JSON.stringify({
          alt: 'Property Image',
          description: faker.word.words(5),
          roomType: 'General',
          cloudflareImageId: imageId
        }),
      });
    });
  }
  
  // Utility media (general property media)
  if (propertyWithFeatures.utility) {
    mediaToCreate.push(generateGeneralMedia('Utility'));
  }

  // Create all media and update location in parallel
  await Promise.all([
    // Batch create all media
    mediaToCreate.length > 0 ? prisma.media.createMany({
      data: mediaToCreate.map(media => ({
        ...media,
        propertyId: propertyWithFeatures.id,
      })),
    }) : Promise.resolve(),
    // Update location
    updateLocationByAddressIdForSeed(propertyWithFeatures.addressId!, propertyWithFeatures.address?.lon!, propertyWithFeatures.address?.lat!)
  ]);

  // Return the property with just address for compatibility
  const property: PropertyWithAddress = {
    ...propertyWithFeatures,
    address: propertyWithFeatures.address,
  };

  await getLocationByAddressIdForSeed(property.addressId!);

  return property;
};
