import {
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
} from "../database/prisma/generated/client";

// ---------------------------------------------------------------------------
// Enum validation — GPT-4o-mini occasionally ignores JSON schema enum constraints,
// so we filter all array params against the known-valid sets before touching Prisma.
// ---------------------------------------------------------------------------

/** Allowed values for every array-type enum parameter. Used by `filterEnum`. */
export const VALID: Record<string, Set<string>> = {
  gardenPositions: new Set(Object.values(GardenPosition)),
  yardPositions: new Set(Object.values(GardenPosition)),
  outdoorSpaceFeatures: new Set(Object.values(OutdoorSpaceFeature)),
  landFeatures: new Set(Object.values(LandFeature)),
  parkingFeatures: new Set(Object.values(ParkingFeature)),
  primaryHeatingTypes: new Set(Object.values(HeatingType)),
  secondaryHeatingTypes: new Set(Object.values(HeatingType)),
  bedSizes: new Set(Object.values(BedSizeType)),
  renewables: new Set(Object.values(RenewableEnergy)),
  connectedUtilities: new Set(Object.values(ConnectedUtilities)),
  securityFeatures: new Set(Object.values(SecurityFeature)),
  storageFeatures: new Set(Object.values(StorageFeature)),
  accessibilityFeatures: new Set(Object.values(AccessibilityFeature)),
  buildingFeatures: new Set(Object.values(BuildingFeature)),
  bedroomFeatures: new Set(Object.values(BedroomFeature)),
  bathroomFeatures: new Set(Object.values(BathroomFeature)),
  kitchenFeatures: new Set(Object.values(KitchenFeature)),
  receptionTypes: new Set(Object.values(ReceptionType)),
  // Reception rooms and other rooms both use the RoomFeature enum
  receptionFeatures: new Set(Object.values(RoomFeature)),
  otherRoomFeatures: new Set(Object.values(RoomFeature)),
  otherRoomTypes: new Set(Object.values(OtherRoomType)),
  utilityFeatures: new Set(Object.values(UtilityFeature)),
  epcRatings: new Set(Object.values(EPCRating)),
};

/** Allowed values for every scalar enum parameter. Used by `filterScalar`. */
export const VALID_SCALAR: Record<string, Set<string>> = {
  hotWaterSource: new Set(Object.values(HotWaterSource)),
  boilerType: new Set(Object.values(BoilerType)),
  broadbandType: new Set(Object.values(BroadbandType)),
  constructionType: new Set(Object.values(ConstructionType)),
  tenureType: new Set(Object.values(TenureType)),
  priceType: new Set(Object.values(SalePriceType)),
  saleAvailabilityStatus: new Set(Object.values(SaleAvailabilityStatus)),
  furnishedStatus: new Set(Object.values(FurnishedStatus)),
  rentalLength: new Set(Object.values(RentalLengthType)),
  rentFrequency: new Set(Object.values(RentalPriceType)),
  rentalAvailabilityStatus: new Set(Object.values(RentalAvailabilityStatus)),
  verificationLevel: new Set(Object.values(VerificationLevel)),
  listingTier: new Set(Object.values(ListingTier)),
  gardenFacing: new Set(Object.values(GardenFacing)),
  // Amenity enums validated here to prevent invalid Prisma enum crashes
  amenityType: new Set(Object.values(AmenityType)),
  amenitySubtype: new Set(Object.values(AmenitySubtype)),
  councilTaxBand: new Set(Object.values(CouncilTaxBand)),
};

/** Returns `val` only if it is a member of the allowed set for `key`; otherwise `undefined`. */
export function filterScalar(val: string | undefined, key: keyof typeof VALID_SCALAR): string | undefined {
  if (!val) return undefined;
  return VALID_SCALAR[key].has(val) ? val : undefined;
}

/**
 * Filters `arr` to only values present in the allowed set for `key`.
 * Also normalises a scalar string to a single-element array (GPT occasionally returns one).
 */
export function filterEnum(arr: string[] | string | undefined, key: keyof typeof VALID): string[] | undefined {
  if (!arr) return undefined;
  // GPT occasionally returns a scalar string instead of an array — normalise it
  const normalised = Array.isArray(arr) ? arr : [arr];
  if (!normalised.length) return undefined;
  const filtered = normalised.filter((v) => VALID[key].has(v));
  return filtered.length ? filtered : undefined;
}
