import type {
  AccessibilityFeature,
  AmenitySubtype,
  AmenityType,
  BathroomFeature,
  BedSizeType,
  BedroomFeature,
  BoilerType,
  BroadbandType,
  BuildingFeature,
  ConnectedUtilities,
  ConstructionType,
  CouncilTaxBand,
  EPCRating,
  FurnishedStatus,
  GardenFacing,
  GardenPosition,
  HeatingType,
  HotWaterSource,
  KitchenFeature,
  LandFeature,
  ListingTier,
  OtherRoomType,
  OutdoorSpaceFeature,
  ParkingFeature,
  ReceptionType,
  RenewableEnergy,
  RentalAvailabilityStatus,
  RentalLengthType,
  RentalPriceType,
  RoomFeature,
  SaleAvailabilityStatus,
  SalePriceType,
  SecurityFeature,
  StorageFeature,
  TenureType,
  UtilityFeature,
  VerificationLevel,
} from "~~/layers/database/server/database/prisma/generated/enums";

// ---------------------------------------------------------------------------
// SearchParameters — flat typed interface.
// GPT's ONLY job is to fill these fields from natural language.
// buildWhereClause() handles ALL Prisma nesting deterministically.
// ---------------------------------------------------------------------------

/**
 * Flat parameter bag populated by GPT via function calling.
 * All fields are optional — only set what the user's query mentions.
 * `buildWhereClause()` in ai-search-where.ts converts this to a Prisma WHERE clause.
 */
export interface SearchParameters {
  // Root listing
  listingType?: "SALE" | "RENT";
  priceMin?: number;
  priceMax?: number;
  listingTier?: ListingTier;

  // Sale listing
  tenureTypes?: TenureType[];
  chain?: boolean;
  sharedOwnership?: boolean;
  priceType?: SalePriceType;
  saleAvailabilityStatuses?: SaleAvailabilityStatus[];

  // Rental listing
  furnishedStatuses?: FurnishedStatus[];
  isBillsIncluded?: boolean;
  rentalLength?: RentalLengthType;
  rentFrequency?: RentalPriceType;
  rentalAvailabilityStatuses?: RentalAvailabilityStatus[];
  depositMax?: number;
  holdingDepositMax?: number;

  // Move-in date
  moveInDateBefore?: string; // ISO date — available on or before
  moveInDateAfter?: string;  // ISO date — available from

  // Listing
  verificationLevel?: VerificationLevel;

  // Property
  numberBedroomsExact?: number;
  numberBedroomsMin?: number;
  numberBedroomsMax?: number;
  numberBedroomsLt?: number;
  numberBathroomsExact?: number;
  numberBathroomsMin?: number;
  numberBathroomsMax?: number;
  numberBathroomsLt?: number;
  numberReceptionsExact?: number;
  numberReceptionsMin?: number;
  numberKitchensExact?: number;
  numberKitchensMin?: number;
  numberOtherRoomsExact?: number;
  numberOtherRoomsMin?: number;
  sizeMin?: number;
  yearBuiltAfter?: number;
  yearBuiltBefore?: number;
  totalFloorsMax?: number;
  vacant?: boolean;
  constructionType?: ConstructionType;
  floorLevel?: number;
  propertyTypeName?: string;
  classificationNames?: string[];

  // Parking
  parkingFeatures?: ParkingFeature[];

  // Outdoor space
  hasGarden?: boolean;
  gardenFacing?: GardenFacing;
  gardenPositions?: GardenPosition[];
  gardenSizeMin?: number;
  outdoorAreaMin?: number;
  outdoorSpaceFeatures?: OutdoorSpaceFeature[];
  landFeatures?: LandFeature[];
  landSizeMin?: number;
  landSeparateParcel?: boolean;
  hasYard?: boolean;
  yardFacing?: GardenFacing;
  yardPositions?: GardenPosition[];
  yardSizeMin?: number;

  // Energy & utilities
  epcRatings?: EPCRating[];
  primaryHeatingTypes?: HeatingType[];
  secondaryHeatingTypes?: HeatingType[];
  boilerType?: BoilerType;
  hotWaterSource?: HotWaterSource;
  renewables?: RenewableEnergy[];
  connectedUtilitiesInclude?: ConnectedUtilities[];
  connectedUtilitiesExclude?: ConnectedUtilities[];
  broadbandType?: BroadbandType;
  fullFibreAvailable?: boolean;
  maxDownloadSpeedMin?: number;

  // Features
  securityFeatures?: SecurityFeature[];
  storageFeatures?: StorageFeature[];
  accessibilityFeatures?: AccessibilityFeature[];
  petFriendly?: boolean;
  buildingFeatures?: BuildingFeature[];

  // Rooms
  bedroomFeatures?: BedroomFeature[];
  bedSizes?: BedSizeType[];
  bedroomSizeMin?: number;
  bathroomFeatures?: BathroomFeature[];
  bathroomSizeMin?: number;
  kitchenFeatures?: KitchenFeature[];
  kitchenSizeMin?: number;
  receptionTypes?: ReceptionType[];
  receptionFeatures?: RoomFeature[];
  receptionSizeMin?: number;
  otherRoomTypes?: OtherRoomType[];
  otherRoomFeatures?: RoomFeature[];
  otherRoomSizeMin?: number;
  utilityFeatures?: UtilityFeature[];

  // Amenity (single nearest amenity — most queries only ask for one)
  amenityType?: AmenityType;
  amenitySubtype?: AmenitySubtype;
  amenityDistanceMax?: number;

  // Running costs
  councilTaxBand?: CouncilTaxBand;
  serviceChargesMax?: number;
  groundRentMax?: number;

  // Seller
  sellerUsername?: string;

  // Query analysis
  usedTerms?: string[];
  ignoredTerms?: string[];
}
