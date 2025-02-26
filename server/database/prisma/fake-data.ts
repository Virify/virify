import { accessibilityFeaturesType, petPolicyType, BedSizeType, ListingType, ListingTier, PriceType, AvailabilityStatus, PropertyType, propertyClassification, ConstructionType, RoofConstruction, FurnishingStatus, Tenure, epcType, verificationStatus, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeAdditionalFeatures() {
  return {
    investmentPotential: faker.lorem.words(5),
    petPolicy: faker.lorem.words(5),
    accessibilityFeatures: faker.helpers.arrayElement([accessibilityFeaturesType.WHEELCHAIR_ACCESSIBLE, accessibilityFeaturesType.WHEELCHAIR_RAMP, accessibilityFeaturesType.ELEVATOR, accessibilityFeaturesType.STAIRS, accessibilityFeaturesType.PARKING, accessibilityFeaturesType.OTHER] as const),
    moveInDate: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAdditionalFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    investmentPotential: faker.lorem.words(5),
    petPolicy: faker.lorem.words(5),
    accessibilityFeatures: faker.helpers.arrayElement([accessibilityFeaturesType.WHEELCHAIR_ACCESSIBLE, accessibilityFeaturesType.WHEELCHAIR_RAMP, accessibilityFeaturesType.ELEVATOR, accessibilityFeaturesType.STAIRS, accessibilityFeaturesType.PARKING, accessibilityFeaturesType.OTHER] as const),
    moveInDate: faker.date.anytime(),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAddress() {
  return {
    street: faker.lorem.words(5),
    city: faker.lorem.words(5),
    postcode: faker.lorem.words(5),
    country: faker.lorem.words(5),
    latitude: undefined,
    longitude: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAddressComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    street: faker.lorem.words(5),
    city: faker.lorem.words(5),
    postcode: faker.lorem.words(5),
    country: faker.lorem.words(5),
    latitude: undefined,
    longitude: undefined,
    propertyId: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAgent() {
  return {
    email: faker.internet.email(),
    password: faker.lorem.words(5),
    name: faker.person.fullName(),
    contactInfo: faker.lorem.words(5),
    directContactOptions: undefined,
    viewingAvailability: undefined,
    addressLine1: faker.lorem.words(5),
    addressLine2: undefined,
    city: faker.lorem.words(5),
    county: faker.lorem.words(5),
    postcode: faker.lorem.words(5),
    country: faker.lorem.words(5),
    companyRegistration: faker.lorem.words(5),
    addressId: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAgentComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
    name: faker.person.fullName(),
    contactInfo: faker.lorem.words(5),
    directContactOptions: undefined,
    viewingAvailability: undefined,
    addressLine1: faker.lorem.words(5),
    addressLine2: undefined,
    city: faker.lorem.words(5),
    county: faker.lorem.words(5),
    postcode: faker.lorem.words(5),
    country: faker.lorem.words(5),
    companyRegistration: faker.lorem.words(5),
    addressId: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAmenitiesFeature() {
  return {
    transportLinks: faker.lorem.words(5),
    schools: faker.lorem.words(5),
    hospitals: faker.lorem.words(5),
    shopping: faker.lorem.words(5),
    greenSpaces: faker.lorem.words(5),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAmenitiesFeatureComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    transportLinks: faker.lorem.words(5),
    schools: faker.lorem.words(5),
    hospitals: faker.lorem.words(5),
    shopping: faker.lorem.words(5),
    greenSpaces: faker.lorem.words(5),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBathroomFeatures() {
  return {
    enSuite: faker.datatype.boolean(),
    bathtub: faker.datatype.boolean(),
    walkInShower: faker.datatype.boolean(),
    downstairs: faker.datatype.boolean(),
    upstairs: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBathroomFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: 1,
    enSuite: faker.datatype.boolean(),
    bathtub: faker.datatype.boolean(),
    walkInShower: faker.datatype.boolean(),
    downstairs: faker.datatype.boolean(),
    upstairs: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBedroomFeatures() {
  return {
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBedroomFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: 2,
    bedNumber: 1,
    bedSize: BedSizeType.SINGLE,
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeDiningroomFeatures() {
  return {
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeDiningroomFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: 2,
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeKitchenFeatures() {
  return {
    modern: faker.datatype.boolean(),
    openPlan: faker.datatype.boolean(),
    appliancesIncluded: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeKitchenFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    modern: faker.datatype.boolean(),
    openPlan: faker.datatype.boolean(),
    appliancesIncluded: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeListing() {
  return {
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    price: faker.number.float(),
    priceType: faker.helpers.arrayElement([PriceType.OFFERS_IN_EXCESS_OF, PriceType.GUIDE_PRICE, PriceType.OFFERS_IN_THE_REGION_OF, PriceType.PER_CALENDAR_MONTH, PriceType.PER_WEEK] as const),
    listingType: faker.helpers.arrayElement([ListingType.FOR_SALE, ListingType.FOR_LONG_TERM_LET, ListingType.SHORT_TERM_LET, ListingType.AUCTION] as const),
    availabilityStatus: faker.helpers.arrayElement([AvailabilityStatus.AVAILABLE, AvailabilityStatus.UNDER_OFFER, AvailabilityStatus.SOLD, AvailabilityStatus.LET_AGREED] as const),
    listingTier: faker.helpers.arrayElement([ListingTier.BASIC, ListingTier.PREMIUM, ListingTier.FEATURED] as const),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeListingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    price: faker.number.float(),
    priceType: faker.helpers.arrayElement([PriceType.OFFERS_IN_EXCESS_OF, PriceType.GUIDE_PRICE, PriceType.OFFERS_IN_THE_REGION_OF, PriceType.PER_CALENDAR_MONTH, PriceType.PER_WEEK] as const),
    listingType: faker.helpers.arrayElement([ListingType.FOR_SALE, ListingType.FOR_LONG_TERM_LET, ListingType.SHORT_TERM_LET, ListingType.AUCTION] as const),
    availabilityStatus: faker.helpers.arrayElement([AvailabilityStatus.AVAILABLE, AvailabilityStatus.UNDER_OFFER, AvailabilityStatus.SOLD, AvailabilityStatus.LET_AGREED] as const),
    listingTier: faker.helpers.arrayElement([ListingTier.BASIC, ListingTier.PREMIUM, ListingTier.FEATURED] as const),
    userId: undefined,
    agentId: undefined,
    propertyId: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeListingCosts() {
  return {
    deposit: faker.number.float(),
    upfrontCosts: faker.number.float(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeListingCostsComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    deposit: faker.number.float(),
    upfrontCosts: faker.number.float(),
    description: faker.lorem.words(5),
    listingId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeLivingAreaFeatures() {
  return {
    fireplace: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeLivingAreaFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: 1,
    fireplace: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeMedia() {
  return {
    images: faker.lorem.words(5),
    videoTour: faker.lorem.words(5),
    floorPlans: faker.lorem.words(5),
    metadata: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeMediaComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    images: faker.lorem.words(5),
    videoTour: faker.lorem.words(5),
    floorPlans: faker.lorem.words(5),
    metadata: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeOutdoorSpace() {
  return {
    land: faker.datatype.boolean(),
    landSize: undefined,
    garden: faker.datatype.boolean(),
    gardenSize: undefined,
    terrace: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    patio: faker.datatype.boolean(),
    separateParcel: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeOutdoorSpaceComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    land: faker.datatype.boolean(),
    landSize: undefined,
    garden: faker.datatype.boolean(),
    gardenSize: undefined,
    terrace: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    patio: faker.datatype.boolean(),
    separateParcel: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeParking() {
  return {
    garage: faker.datatype.boolean(),
    driveway: faker.datatype.boolean(),
    permitParking: faker.datatype.boolean(),
    onStreet: faker.datatype.boolean(),
    noParking: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeParkingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    garage: faker.datatype.boolean(),
    driveway: faker.datatype.boolean(),
    permitParking: faker.datatype.boolean(),
    onStreet: faker.datatype.boolean(),
    noParking: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeProperty() {
  return {
    propertyValue: undefined,
    propertyType: faker.helpers.arrayElement([PropertyType.HOUSE, PropertyType.COTTAGE, PropertyType.BUNGALOW, PropertyType.CONDO, PropertyType.PENTHOUSE, PropertyType.FLAT, PropertyType.LAND, PropertyType.NEW_BUILD, PropertyType.SHARED_OWNERSHIP, PropertyType.RETIREMENT, PropertyType.STUDENT] as const),
    propertyClassification: faker.helpers.arrayElement([propertyClassification.SEMI_DETACHED, propertyClassification.END_OF_TERRACE, propertyClassification.DETACHED, propertyClassification.TERRACED, propertyClassification.NON_WORKING_FARM, propertyClassification.WORKING_FARM] as const),
    size: undefined,
    yearBuilt: faker.lorem.words(5),
    constructionType: faker.helpers.arrayElement([ConstructionType.STONE, ConstructionType.BRICK, ConstructionType.STANDARD] as const),
    roofConstruction: faker.helpers.arrayElement([RoofConstruction.SLATE_TILE, RoofConstruction.CONCRETE_TILE] as const),
    floorLevel: undefined,
    furnishingStatus: faker.helpers.arrayElement([FurnishingStatus.FURNISHED, FurnishingStatus.UNFURNISHED, FurnishingStatus.PART_FURNISHED] as const),
    tenure: faker.helpers.arrayElement([Tenure.LEASEHOLD, Tenure.FREEHOLD] as const),
    leaseTerm: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakePropertyComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    propertyValue: undefined,
    propertyType: faker.helpers.arrayElement([PropertyType.HOUSE, PropertyType.COTTAGE, PropertyType.BUNGALOW, PropertyType.CONDO, PropertyType.PENTHOUSE, PropertyType.FLAT, PropertyType.LAND, PropertyType.NEW_BUILD, PropertyType.SHARED_OWNERSHIP, PropertyType.RETIREMENT, PropertyType.STUDENT] as const),
    propertyClassification: faker.helpers.arrayElement([propertyClassification.SEMI_DETACHED, propertyClassification.END_OF_TERRACE, propertyClassification.DETACHED, propertyClassification.TERRACED, propertyClassification.NON_WORKING_FARM, propertyClassification.WORKING_FARM] as const),
    size: undefined,
    yearBuilt: faker.lorem.words(5),
    constructionType: faker.helpers.arrayElement([ConstructionType.STONE, ConstructionType.BRICK, ConstructionType.STANDARD] as const),
    roofConstruction: faker.helpers.arrayElement([RoofConstruction.SLATE_TILE, RoofConstruction.CONCRETE_TILE] as const),
    floorLevel: undefined,
    furnishingStatus: faker.helpers.arrayElement([FurnishingStatus.FURNISHED, FurnishingStatus.UNFURNISHED, FurnishingStatus.PART_FURNISHED] as const),
    tenure: faker.helpers.arrayElement([Tenure.LEASEHOLD, Tenure.FREEHOLD] as const),
    leaseTerm: undefined,
    bedrooms: 3,
    bathrooms: 1,
    kitchens: 1,
    livingRooms: 1,
    diningRooms: 1,
    agentId: undefined,
    userId: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeRunningCosts() {
  return {
    councilTaxBand: faker.lorem.words(5),
    serviceCharges: undefined,
    groundRent: undefined,
    epc: faker.helpers.arrayElement([epcType.A, epcType.B, epcType.C, epcType.D, epcType.E, epcType.F, epcType.G] as const),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeRunningCostsComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    councilTaxBand: faker.lorem.words(5),
    serviceCharges: undefined,
    groundRent: undefined,
    epc: faker.helpers.arrayElement([epcType.A, epcType.B, epcType.C, epcType.D, epcType.E, epcType.F, epcType.G] as const),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeSecurityFeatures() {
  return {
    gatedCommunity: faker.datatype.boolean(),
    cctv: faker.datatype.boolean(),
    alarmSystem: faker.datatype.boolean(),
    neighborhoodWatch: faker.datatype.boolean(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeSecurityFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    gatedCommunity: faker.datatype.boolean(),
    cctv: faker.datatype.boolean(),
    alarmSystem: faker.datatype.boolean(),
    neighborhoodWatch: faker.datatype.boolean(),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeStorageFeatures() {
  return {
    closets: faker.datatype.boolean(),
    attic: faker.datatype.boolean(),
    basement: faker.datatype.boolean(),
    walkInWardrobe: faker.datatype.boolean(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeStorageFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    closets: faker.datatype.boolean(),
    attic: faker.datatype.boolean(),
    basement: faker.datatype.boolean(),
    walkInWardrobe: faker.datatype.boolean(),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeUser() {
  return {
    firstName: undefined,
    lastName: undefined,
    username: undefined,
    email: faker.internet.email(),
    password: undefined,
    addressLine1: undefined,
    addressLine2: undefined,
    city: undefined,
    county: undefined,
    postcode: undefined,
    country: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeUserComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    firstName: undefined,
    lastName: undefined,
    username: undefined,
    email: faker.internet.email(),
    password: undefined,
    verified: verificationStatus.NO,
    addressLine1: undefined,
    addressLine2: undefined,
    city: undefined,
    county: undefined,
    postcode: undefined,
    country: undefined,
    agentId: undefined,
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
