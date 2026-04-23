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
  tenureTypes: new Set(Object.values(TenureType)),
  saleAvailabilityStatuses: new Set(Object.values(SaleAvailabilityStatus)),
  furnishedStatuses: new Set(Object.values(FurnishedStatus)),
  rentalAvailabilityStatuses: new Set(Object.values(RentalAvailabilityStatus)),
};

/** Allowed values for every scalar enum parameter. Used by `filterScalar`. */
export const VALID_SCALAR: Record<string, Set<string>> = {
  hotWaterSource: new Set(Object.values(HotWaterSource)),
  boilerType: new Set(Object.values(BoilerType)),
  broadbandType: new Set(Object.values(BroadbandType)),
  constructionType: new Set(Object.values(ConstructionType)),
  priceType: new Set(Object.values(SalePriceType)),
  rentalLength: new Set(Object.values(RentalLengthType)),
  rentFrequency: new Set(Object.values(RentalPriceType)),

  listingTier: new Set(Object.values(ListingTier)),
  gardenFacing: new Set(Object.values(GardenFacing)),
  // Amenity enums validated here to prevent invalid Prisma enum crashes
  amenityType: new Set(Object.values(AmenityType)),
  amenitySubtype: new Set(Object.values(AmenitySubtype)),
  councilTaxBand: new Set(Object.values(CouncilTaxBand)),
};

/** Returns `val` only if it is a member of the allowed set for `key`; otherwise `undefined`. */
export function filterScalar<T extends string>(
  val: T | undefined,
  key: keyof typeof VALID_SCALAR,
): T | undefined {
  if (!val) return undefined;
  return VALID_SCALAR[key].has(val) ? val : undefined;
}

/**
 * Filters `arr` to only values present in the allowed set for `key`.
 * Also normalises a scalar string to a single-element array (GPT occasionally returns one).
 */
export function filterEnum<T extends string>(
  arr: T[] | string | undefined,
  key: keyof typeof VALID,
): T[] | undefined {
  if (!arr) return undefined;
  // GPT occasionally returns a scalar string instead of an array — normalise it
  const normalised: T[] = Array.isArray(arr) ? arr : [arr as T];
  if (!normalised.length) return undefined;
  const filtered = normalised.filter((v) => VALID[key].has(v));
  return filtered.length ? filtered : undefined;
}
