import { AccessibilityFeaturesType, AgentRole, BedSizeType, ListingType, ListingTier, PriceType, AvailabilityStatus, OwnerRole, PropertyType, PropertyClassification, ConstructionType, RoofConstruction, FurnishingStatus, Tenure, EpcType, Reviewed } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeAdditionalFeatures() {
  return {
    investmentPotential: faker.lorem.words(5),
    petPolicy: faker.datatype.boolean(),
    accessibilityFeatures: faker.helpers.arrayElement([AccessibilityFeaturesType.WHEELCHAIR_ACCESSIBLE, AccessibilityFeaturesType.WHEELCHAIR_RAMP, AccessibilityFeaturesType.ELEVATOR, AccessibilityFeaturesType.STAIRS, AccessibilityFeaturesType.PARKING, AccessibilityFeaturesType.OTHER] as const),
    moveInDate: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAdditionalFeaturesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    investmentPotential: faker.lorem.words(5),
    petPolicy: faker.datatype.boolean(),
    accessibilityFeatures: faker.helpers.arrayElement([AccessibilityFeaturesType.WHEELCHAIR_ACCESSIBLE, AccessibilityFeaturesType.WHEELCHAIR_RAMP, AccessibilityFeaturesType.ELEVATOR, AccessibilityFeaturesType.STAIRS, AccessibilityFeaturesType.PARKING, AccessibilityFeaturesType.OTHER] as const),
    moveInDate: faker.date.anytime(),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAddress() {
  return {
    number: undefined,
    flat: undefined,
    street: undefined,
    city: undefined,
    postcode: undefined,
    country: undefined,
    county: undefined,
    propertyId: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAddressComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    number: undefined,
    flat: undefined,
    street: undefined,
    city: undefined,
    postcode: undefined,
    country: undefined,
    county: undefined,
    propertyId: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAgent() {
  return {
    firstName: undefined,
    lastName: undefined,
    email: faker.internet.email(),
    password: undefined,
    passwordResetToken: undefined,
    lastLogin: undefined,
    activationToken: undefined,
    tokenExpiry: undefined,
    updatedAt: faker.date.anytime(),
    deletedAt: undefined,
  };
}
export function fakeAgentComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    firstName: undefined,
    lastName: undefined,
    email: faker.internet.email(),
    password: undefined,
    ownerId: faker.number.int(),
    role: AgentRole.SENIOR,
    passwordResetToken: undefined,
    lastLogin: undefined,
    activationToken: undefined,
    tokenExpiry: undefined,
    isActivated: false,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
    deletedAt: undefined,
  };
}
export function fakeAmenities() {
  return {
    transportLinks: undefined,
    schools: undefined,
    hospitals: undefined,
    shopping: undefined,
    greenSpaces: undefined,
    description: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeAmenitiesComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    transportLinks: undefined,
    schools: undefined,
    hospitals: undefined,
    shopping: undefined,
    greenSpaces: undefined,
    description: undefined,
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBathroom() {
  return {
    enSuite: faker.datatype.boolean(),
    bathtub: faker.datatype.boolean(),
    walkInShower: faker.datatype.boolean(),
    downstairs: faker.datatype.boolean(),
    upstairs: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    size: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBathroomComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: 1,
    enSuite: faker.datatype.boolean(),
    bathtub: faker.datatype.boolean(),
    walkInShower: faker.datatype.boolean(),
    downstairs: faker.datatype.boolean(),
    upstairs: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    size: undefined,
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBedroom() {
  return {
    roomNumber: faker.number.int(),
    bed: faker.helpers.arrayElement([BedSizeType.SINGLE, BedSizeType.DOUBLE, BedSizeType.QUEEN, BedSizeType.KING, BedSizeType.SUPER_KING, BedSizeType.BUNK] as const),
    description: faker.lorem.words(5),
    size: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeBedroomComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: faker.number.int(),
    bed: faker.helpers.arrayElement([BedSizeType.SINGLE, BedSizeType.DOUBLE, BedSizeType.QUEEN, BedSizeType.KING, BedSizeType.SUPER_KING, BedSizeType.BUNK] as const),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    size: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeDiningroom() {
  return {
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    size: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeDiningroomComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: 1,
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    propertyId: faker.number.int(),
    size: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakespatial_ref_sys() {
  return {
    auth_name: undefined,
    auth_srid: undefined,
    srtext: undefined,
    proj4text: undefined,
  };
}
export function fakespatial_ref_sysComplete() {
  return {
    srid: faker.number.int({ max: 2147483647 }),
    auth_name: undefined,
    auth_srid: undefined,
    srtext: undefined,
    proj4text: undefined,
  };
}
export function fakeKitchen() {
  return {
    modern: faker.datatype.boolean(),
    openPlan: faker.datatype.boolean(),
    appliancesIncluded: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    size: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeKitchenComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    modern: faker.datatype.boolean(),
    openPlan: faker.datatype.boolean(),
    appliancesIncluded: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    size: undefined,
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeListing() {
  return {
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    price: undefined,
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
    price: undefined,
    priceType: faker.helpers.arrayElement([PriceType.OFFERS_IN_EXCESS_OF, PriceType.GUIDE_PRICE, PriceType.OFFERS_IN_THE_REGION_OF, PriceType.PER_CALENDAR_MONTH, PriceType.PER_WEEK] as const),
    listingType: faker.helpers.arrayElement([ListingType.FOR_SALE, ListingType.FOR_LONG_TERM_LET, ListingType.SHORT_TERM_LET, ListingType.AUCTION] as const),
    availabilityStatus: faker.helpers.arrayElement([AvailabilityStatus.AVAILABLE, AvailabilityStatus.UNDER_OFFER, AvailabilityStatus.SOLD, AvailabilityStatus.LET_AGREED] as const),
    listingTier: faker.helpers.arrayElement([ListingTier.BASIC, ListingTier.PREMIUM, ListingTier.FEATURED] as const),
    ownerId: undefined,
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
export function fakeLivingArea() {
  return {
    fireplace: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    size: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeLivingAreaComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    roomNumber: 1,
    fireplace: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    openConcept: faker.datatype.boolean(),
    description: faker.lorem.words(5),
    size: undefined,
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeMedia() {
  return {
    images: undefined,
    videoTour: undefined,
    floorPlans: undefined,
    metadata: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeMediaComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    images: undefined,
    videoTour: undefined,
    floorPlans: undefined,
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
export function fakeOwner() {
  return {
    firstName: undefined,
    lastName: undefined,
    username: undefined,
    email: faker.internet.email(),
    mainContact: undefined,
    password: undefined,
    businessName: undefined,
    addressLine1: undefined,
    addressLine2: undefined,
    city: undefined,
    county: undefined,
    postcode: undefined,
    country: undefined,
    companyRegistration: undefined,
    passwordResetToken: undefined,
    passwordResetTokenExpiry: undefined,
    lastLogin: undefined,
    deletedAt: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeOwnerComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    firstName: undefined,
    lastName: undefined,
    username: undefined,
    email: faker.internet.email(),
    mainContact: undefined,
    password: undefined,
    businessName: undefined,
    addressLine1: undefined,
    addressLine2: undefined,
    city: undefined,
    county: undefined,
    postcode: undefined,
    country: undefined,
    companyRegistration: undefined,
    umbrellaId: undefined,
    role: OwnerRole.USER,
    passwordResetToken: undefined,
    passwordResetTokenExpiry: undefined,
    lastLogin: undefined,
    deletedAt: undefined,
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
    propertyClassification: faker.helpers.arrayElement([PropertyClassification.SEMI_DETACHED, PropertyClassification.END_OF_TERRACE, PropertyClassification.DETACHED, PropertyClassification.TERRACED, PropertyClassification.NON_WORKING_FARM, PropertyClassification.WORKING_FARM] as const),
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
    propertyClassification: faker.helpers.arrayElement([PropertyClassification.SEMI_DETACHED, PropertyClassification.END_OF_TERRACE, PropertyClassification.DETACHED, PropertyClassification.TERRACED, PropertyClassification.NON_WORKING_FARM, PropertyClassification.WORKING_FARM] as const),
    size: undefined,
    yearBuilt: faker.lorem.words(5),
    constructionType: faker.helpers.arrayElement([ConstructionType.STONE, ConstructionType.BRICK, ConstructionType.STANDARD] as const),
    roofConstruction: faker.helpers.arrayElement([RoofConstruction.SLATE_TILE, RoofConstruction.CONCRETE_TILE] as const),
    floorLevel: undefined,
    furnishingStatus: faker.helpers.arrayElement([FurnishingStatus.FURNISHED, FurnishingStatus.UNFURNISHED, FurnishingStatus.PART_FURNISHED] as const),
    tenure: faker.helpers.arrayElement([Tenure.LEASEHOLD, Tenure.FREEHOLD] as const),
    leaseTerm: undefined,
    addressId: undefined,
    bedrooms: 3,
    bathrooms: 1,
    kitchens: 1,
    livingRooms: 1,
    diningRooms: 1,
    ownerId: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeRunningCosts() {
  return {
    councilTaxBand: faker.lorem.words(5),
    serviceCharges: undefined,
    groundRent: undefined,
    epc: faker.helpers.arrayElement([EpcType.A, EpcType.B, EpcType.C, EpcType.D, EpcType.E, EpcType.F, EpcType.G] as const),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeRunningCostsComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    councilTaxBand: faker.lorem.words(5),
    serviceCharges: undefined,
    groundRent: undefined,
    epc: faker.helpers.arrayElement([EpcType.A, EpcType.B, EpcType.C, EpcType.D, EpcType.E, EpcType.F, EpcType.G] as const),
    propertyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeSecurity() {
  return {
    gatedCommunity: faker.datatype.boolean(),
    cctv: faker.datatype.boolean(),
    alarmSystem: faker.datatype.boolean(),
    neighborhoodWatch: faker.datatype.boolean(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeSecurityComplete() {
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
export function fakeStorage() {
  return {
    closets: faker.datatype.boolean(),
    attic: faker.datatype.boolean(),
    basement: faker.datatype.boolean(),
    walkInWardrobe: faker.datatype.boolean(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeStorageComplete() {
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
export function fakeUmbrella() {
  return {
    name: faker.person.fullName(),
    businessName: faker.lorem.words(5),
    addressLine1: faker.lorem.words(5),
    addressLine2: undefined,
    city: faker.lorem.words(5),
    county: undefined,
    postcode: faker.lorem.words(5),
    country: faker.lorem.words(5),
    companyRegistration: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeUmbrellaComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    name: faker.person.fullName(),
    businessName: faker.lorem.words(5),
    addressLine1: faker.lorem.words(5),
    addressLine2: undefined,
    city: faker.lorem.words(5),
    county: undefined,
    postcode: faker.lorem.words(5),
    country: faker.lorem.words(5),
    companyRegistration: faker.lorem.words(5),
    verified: false,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeVerification() {
  return {
    identity: undefined,
    address: undefined,
    bank: undefined,
    payslip: undefined,
    business: undefined,
    reviewToken: undefined,
    reviewTokenExpiry: undefined,
    activationToken: undefined,
    activationTokenExpiry: undefined,
    updatedAt: faker.date.anytime(),
  };
}
export function fakeVerificationComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    ownerId: faker.number.int(),
    identity: undefined,
    address: undefined,
    bank: undefined,
    payslip: undefined,
    business: undefined,
    reviewed: Reviewed.PENDING,
    reviewToken: undefined,
    reviewTokenExpiry: undefined,
    activated: false,
    activationToken: undefined,
    activationTokenExpiry: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
