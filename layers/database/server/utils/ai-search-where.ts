import { filterEnum, filterScalar } from "./ai-search-enums";

// ---------------------------------------------------------------------------
// buildWhereClause — deterministic Prisma WHERE clause from flat parameters.
// Zero AI involvement. All nesting, operators, and enum placement is correct.
// ---------------------------------------------------------------------------

// ── Param sanitisation ──────────────────────────────────────────────────────

/** Strips any out-of-range enum values GPT may have returned before they reach Prisma. */
function sanitiseParams(raw: SearchParameters): SearchParameters {
  return {
    ...raw,
    outdoorSpaceFeatures: filterEnum(raw.outdoorSpaceFeatures, "outdoorSpaceFeatures"),
    landFeatures: filterEnum(raw.landFeatures, "landFeatures"),
    parkingFeatures: filterEnum(raw.parkingFeatures, "parkingFeatures"),
    primaryHeatingTypes: filterEnum(raw.primaryHeatingTypes, "primaryHeatingTypes"),
    secondaryHeatingTypes: filterEnum(raw.secondaryHeatingTypes, "secondaryHeatingTypes"),
    bedSizes: filterEnum(raw.bedSizes, "bedSizes"),
    renewables: filterEnum(raw.renewables, "renewables"),
    connectedUtilitiesInclude: filterEnum(raw.connectedUtilitiesInclude, "connectedUtilities"),
    connectedUtilitiesExclude: filterEnum(raw.connectedUtilitiesExclude, "connectedUtilities"),
    securityFeatures: filterEnum(raw.securityFeatures, "securityFeatures"),
    storageFeatures: filterEnum(raw.storageFeatures, "storageFeatures"),
    accessibilityFeatures: filterEnum(raw.accessibilityFeatures, "accessibilityFeatures"),
    buildingFeatures: filterEnum(raw.buildingFeatures, "buildingFeatures"),
    bedroomFeatures: filterEnum(raw.bedroomFeatures, "bedroomFeatures"),
    bathroomFeatures: filterEnum(raw.bathroomFeatures, "bathroomFeatures"),
    kitchenFeatures: filterEnum(raw.kitchenFeatures, "kitchenFeatures"),
    receptionTypes: filterEnum(raw.receptionTypes, "receptionTypes"),
    receptionFeatures: filterEnum(raw.receptionFeatures, "receptionFeatures"),
    otherRoomTypes: filterEnum(raw.otherRoomTypes, "otherRoomTypes"),
    otherRoomFeatures: filterEnum(raw.otherRoomFeatures, "otherRoomFeatures"),
    gardenPositions: filterEnum(raw.gardenPositions, "gardenPositions"),
    yardPositions: filterEnum(raw.yardPositions, "yardPositions"),
    utilityFeatures: filterEnum(raw.utilityFeatures, "utilityFeatures"),
    epcRatings: filterEnum(raw.epcRatings, "epcRatings"),
    councilTaxBand: filterScalar(raw.councilTaxBand, "councilTaxBand"),
  };
}

// ── Listing-level filter helpers ─────────────────────────────────────────────

/** Returns a Prisma `price` range filter, or `undefined` if no price bounds are set. */
function buildPriceFilter(p: SearchParameters): any {
  if (p.priceMin === undefined && p.priceMax === undefined) return undefined;
  const price: any = {};
  if (p.priceMin !== undefined) price.gte = p.priceMin;
  if (p.priceMax !== undefined) price.lte = p.priceMax;
  return price;
}

/** Returns a Prisma `moveInDate` range filter, or `undefined` if no date bounds are set. */
function buildMoveInDateFilter(p: SearchParameters): any {
  if (p.moveInDateBefore === undefined && p.moveInDateAfter === undefined) return undefined;
  const moveInDate: any = {};
  if (p.moveInDateBefore) moveInDate.lte = new Date(p.moveInDateBefore);
  if (p.moveInDateAfter) moveInDate.gte = new Date(p.moveInDateAfter);
  return moveInDate;
}

/**
 * Returns a `saleListing` relation filter. Produces `{ isNot: null }` when only the listing
 * type is SALE (no sale-specific fields), or `{ is: {...} }` when there are field conditions.
 */
function buildSaleListingFilter(p: SearchParameters): any {
  const saleFields: any = {};
  if (p.tenureType) saleFields.tenureType = filterScalar(p.tenureType, "tenureType") ?? undefined;
  if (p.chain !== undefined) saleFields.chain = p.chain;
  if (p.sharedOwnership !== undefined) saleFields.sharedOwnership = p.sharedOwnership;
  // chainFree is removed from Property — chain false on SaleListing is the canonical mapping
  if (p.priceType) saleFields.priceType = filterScalar(p.priceType, "priceType") ?? undefined;
  if (p.saleAvailabilityStatus) saleFields.availabilityStatus = filterScalar(p.saleAvailabilityStatus, "saleAvailabilityStatus") ?? undefined;

  if (p.listingType === "SALE" || Object.keys(saleFields).length > 0) {
    return Object.keys(saleFields).length > 0 ? { is: saleFields } : { isNot: null };
  }
  return undefined;
}

/**
 * Returns a `rentalListing` relation filter. Produces `{ isNot: null }` when only the listing
 * type is RENT (no rental-specific fields), or `{ is: {...} }` when there are field conditions.
 */
function buildRentalListingFilter(p: SearchParameters): any {
  const rentalFields: any = {};
  if (p.furnishedStatus) rentalFields.furnishedStatus = filterScalar(p.furnishedStatus, "furnishedStatus") ?? undefined;
  if (p.isBillsIncluded !== undefined) rentalFields.isBillsIncluded = p.isBillsIncluded;
  if (p.rentalLength) rentalFields.rentalLength = filterScalar(p.rentalLength, "rentalLength") ?? undefined;
  if (p.rentFrequency) rentalFields.rentFrequency = filterScalar(p.rentFrequency, "rentFrequency") ?? undefined;
  if (p.rentalAvailabilityStatus) rentalFields.availabilityStatus = filterScalar(p.rentalAvailabilityStatus, "rentalAvailabilityStatus") ?? undefined;
  if (p.depositMax !== undefined) rentalFields.deposit = { lte: p.depositMax };
  if (p.holdingDepositMax !== undefined) rentalFields.holdingDeposit = { lte: p.holdingDepositMax };

  if (p.listingType === "RENT" || Object.keys(rentalFields).length > 0) {
    return Object.keys(rentalFields).length > 0 ? { is: rentalFields } : { isNot: null };
  }
  return undefined;
}

// ── Property sub-filter helpers ──────────────────────────────────────────────

/** Returns a `numberBedrooms` scalar or range filter, or `undefined` if no bedroom count is set. */
function buildBedroomsFilter(p: SearchParameters): any {
  if (p.numberBedroomsExact !== undefined) return p.numberBedroomsExact;
  if (p.numberBedroomsMin !== undefined || p.numberBedroomsMax !== undefined || p.numberBedroomsLt !== undefined) {
    const f: any = {};
    if (p.numberBedroomsMin !== undefined) f.gte = p.numberBedroomsMin;
    if (p.numberBedroomsMax !== undefined) f.lte = p.numberBedroomsMax;
    if (p.numberBedroomsLt !== undefined) f.lt = p.numberBedroomsLt;
    return f;
  }
  return undefined;
}

/** Returns a `numberBathrooms` scalar or range filter, or `undefined` if no bathroom count is set. */
function buildBathroomsFilter(p: SearchParameters): any {
  if (p.numberBathroomsExact !== undefined) return p.numberBathroomsExact;
  if (p.numberBathroomsMin !== undefined || p.numberBathroomsMax !== undefined || p.numberBathroomsLt !== undefined) {
    const f: any = {};
    if (p.numberBathroomsMin !== undefined) f.gte = p.numberBathroomsMin;
    if (p.numberBathroomsMax !== undefined) f.lte = p.numberBathroomsMax;
    if (p.numberBathroomsLt !== undefined) f.lt = p.numberBathroomsLt;
    return f;
  }
  return undefined;
}

/** Returns a `parking.is.features` filter for requested parking types, or `undefined`. */
function buildParkingFilter(p: SearchParameters): any {
  if (!p.parkingFeatures?.length) return undefined;
  return {
    is: {
      features: p.parkingFeatures.length === 1
        ? { has: p.parkingFeatures[0] }
        : { hasSome: p.parkingFeatures },
    },
  };
}

/**
 * Returns an `outdoorSpace.is` filter covering garden position/facing/size,
 * outdoor features, land features, and total area. Returns `undefined` if no outdoor params are set.
 */
function buildOutdoorFilter(p: SearchParameters): any {
  const outdoorIs: any = {};

  if (p.hasGarden || p.gardenFacing || p.gardenPositions?.length) {
    if (p.gardenPositions && p.gardenPositions.length > 1) {
      // Multiple positions: property must have a garden at each position (AND)
      outdoorIs.AND = p.gardenPositions.map((pos) => ({
        garden: { some: { position: pos } },
      }));
    } else {
      const gardenFilter: any = {};
      if (p.gardenFacing) gardenFilter.facing = filterScalar(p.gardenFacing, "gardenFacing");
      if (p.gardenPositions?.length === 1) gardenFilter.position = p.gardenPositions[0];
      outdoorIs.garden = { some: gardenFilter };
    }
  }
  if (p.outdoorSpaceFeatures?.length) {
    outdoorIs.features = p.outdoorSpaceFeatures.length === 1
      ? { has: p.outdoorSpaceFeatures[0] }
      : { hasSome: p.outdoorSpaceFeatures };
  }
  if (p.landFeatures?.length) {
    outdoorIs.land = { some: { features: p.landFeatures.length === 1 ? { has: p.landFeatures[0] } : { hasSome: p.landFeatures } } };
  }
  if (p.landSeparateParcel !== undefined) {
    outdoorIs.land = { some: { ...(outdoorIs.land?.some ?? {}), separateParcel: p.landSeparateParcel } };
  }
  if (p.landSizeMin !== undefined) {
    outdoorIs.land = { some: { ...(outdoorIs.land?.some ?? {}), size: { gte: p.landSizeMin } } };
  }
  if (p.hasYard || p.yardFacing || p.yardPositions?.length) {
    if (p.yardPositions && p.yardPositions.length > 1) {
      // Multiple positions: property must have a yard at each position (AND)
      outdoorIs.AND = [...(outdoorIs.AND ?? []), ...p.yardPositions.map((pos) => ({ yard: { some: { position: pos } } }))];
    } else {
      const yardFilter: any = {};
      if (p.yardFacing) yardFilter.facing = filterScalar(p.yardFacing, "gardenFacing");
      if (p.yardPositions?.length === 1) yardFilter.position = p.yardPositions[0];
      outdoorIs.yard = { some: yardFilter };
    }
  }
  if (p.yardSizeMin !== undefined) {
    outdoorIs.yard = { some: { ...(outdoorIs.yard?.some ?? {}), size: { gte: p.yardSizeMin } } };
  }
  if (p.gardenSizeMin !== undefined) {
    outdoorIs.garden = { some: { ...(outdoorIs.garden?.some ?? {}), size: { gte: p.gardenSizeMin } } };
  }
  if (p.outdoorAreaMin !== undefined) {
    outdoorIs.totalArea = { gte: p.outdoorAreaMin };
  }

  return Object.keys(outdoorIs).length > 0 ? { is: outdoorIs } : undefined;
}

/**
 * Returns an `energyAndUtilities.is` filter covering EPC, heating, renewables,
 * connected utilities, broadband, and download speed. Returns `undefined` if nothing is set.
 */
function buildEnergyFilter(p: SearchParameters): any {
  const energyIs: any = {};

  if (p.epcRatings?.length) energyIs.epcRating = { in: p.epcRatings };
  if (p.primaryHeatingTypes?.length) {
    energyIs.primaryHeatingType = p.primaryHeatingTypes.length === 1
      ? { has: p.primaryHeatingTypes[0] }
      : { hasSome: p.primaryHeatingTypes };
  }
  if (p.secondaryHeatingTypes?.length) {
    energyIs.secondaryHeatingType = p.secondaryHeatingTypes.length === 1
      ? { has: p.secondaryHeatingTypes[0] }
      : { hasSome: p.secondaryHeatingTypes };
  }
  const boilerType = filterScalar(p.boilerType, "boilerType");
  if (boilerType) energyIs.boilerType = boilerType;
  const hotWaterSource = filterScalar(p.hotWaterSource, "hotWaterSource");
  if (hotWaterSource) energyIs.hotWaterSource = hotWaterSource;
  if (p.renewables?.length) {
    energyIs.renewables = p.renewables.length === 1
      ? { has: p.renewables[0] }
      : { hasSome: p.renewables };
  }
  if (p.connectedUtilitiesInclude?.length) {
    // Multiple must-have utilities need separate AND conditions
    if (p.connectedUtilitiesInclude.length === 1) {
      energyIs.connectedUtilities = { has: p.connectedUtilitiesInclude[0] };
    } else {
      energyIs.AND = p.connectedUtilitiesInclude.map((u) => ({ connectedUtilities: { has: u } }));
    }
  }
  const broadbandType = filterScalar(p.broadbandType, "broadbandType");
  if (broadbandType) energyIs.broadbandType = broadbandType;
  if (p.fullFibreAvailable !== undefined) energyIs.fullFibreAvailable = p.fullFibreAvailable;
  if (p.maxDownloadSpeedMin !== undefined) energyIs.maxDownloadSpeedMbps = { gte: p.maxDownloadSpeedMin };

  return Object.keys(energyIs).length > 0 ? { is: energyIs } : undefined;
}

/** Returns a `securityFeatures.is.features` filter, or `undefined`. */
function buildSecurityFilter(p: SearchParameters): any {
  if (!p.securityFeatures?.length) return undefined;
  return { is: { features: p.securityFeatures.length === 1 ? { has: p.securityFeatures[0] } : { hasSome: p.securityFeatures } } };
}

/** Returns a `storageFeatures.is.features` filter, or `undefined`. */
function buildStorageFilter(p: SearchParameters): any {
  if (!p.storageFeatures?.length) return undefined;
  return { is: { features: p.storageFeatures.length === 1 ? { has: p.storageFeatures[0] } : { hasSome: p.storageFeatures } } };
}

/** Returns an `accessibilityFeatures.is.features` filter, or `undefined`. */
function buildAccessibilityFilter(p: SearchParameters): any {
  if (!p.accessibilityFeatures?.length) return undefined;
  return { is: { features: p.accessibilityFeatures.length === 1 ? { has: p.accessibilityFeatures[0] } : { hasSome: p.accessibilityFeatures } } };
}

/** Returns an `additionalFeatures.is` filter for pet-friendliness and building features, or `undefined`. */
function buildAdditionalFeaturesFilter(p: SearchParameters): any {
  const additionalIs: any = {};
  if (p.petFriendly !== undefined) additionalIs.petFriendly = p.petFriendly;
  if (p.buildingFeatures?.length) {
    additionalIs.features = p.buildingFeatures.length === 1
      ? { has: p.buildingFeatures[0] }
      : { hasSome: p.buildingFeatures };
  }
  return Object.keys(additionalIs).length > 0 ? { is: additionalIs } : undefined;
}

/**
 * Returns a `bedroomFeatures.some` filter combining bedroom feature flags and bed sizes.
 * Merges both into a single `some` condition so they apply to the same bedroom record.
 */
function buildBedroomFeaturesFilter(p: SearchParameters): any {
  if (!p.bedroomFeatures?.length && !p.bedSizes?.length && p.bedroomSizeMin === undefined) return undefined;
  const someFilter: any = {};
  if (p.bedroomFeatures?.length) someFilter.features = p.bedroomFeatures.length === 1 ? { has: p.bedroomFeatures[0] } : { hasSome: p.bedroomFeatures };
  if (p.bedSizes?.length) someFilter.bed = p.bedSizes.length === 1 ? { has: p.bedSizes[0] } : { hasSome: p.bedSizes };
  if (p.bedroomSizeMin !== undefined) someFilter.size = { gte: p.bedroomSizeMin };
  return { some: someFilter };
}

/** Returns a `bathroomFeatures.some` filter, or `undefined`. */
function buildBathroomFeaturesFilter(p: SearchParameters): any {
  if (!p.bathroomFeatures?.length && p.bathroomSizeMin === undefined) return undefined;
  const someFilter: any = {};
  if (p.bathroomFeatures?.length) someFilter.features = p.bathroomFeatures.length === 1 ? { has: p.bathroomFeatures[0] } : { hasSome: p.bathroomFeatures };
  if (p.bathroomSizeMin !== undefined) someFilter.size = { gte: p.bathroomSizeMin };
  return { some: someFilter };
}

/** Returns a `kitchenFeatures.some` filter, or `undefined`. */
function buildKitchenFeaturesFilter(p: SearchParameters): any {
  if (!p.kitchenFeatures?.length && p.kitchenSizeMin === undefined) return undefined;
  const someFilter: any = {};
  if (p.kitchenFeatures?.length) someFilter.features = p.kitchenFeatures.length === 1 ? { has: p.kitchenFeatures[0] } : { hasSome: p.kitchenFeatures };
  if (p.kitchenSizeMin !== undefined) someFilter.size = { gte: p.kitchenSizeMin };
  return { some: someFilter };
}

/** Returns a `reception.some` filter for type, features, and/or size, or `undefined`. */
function buildReceptionFilter(p: SearchParameters): any {
  if (!p.receptionTypes?.length && !p.receptionFeatures?.length && p.receptionSizeMin === undefined) return undefined;
  const recFilter: any = {};
  if (p.receptionTypes?.length) {
    recFilter.type = p.receptionTypes.length === 1
      ? p.receptionTypes[0]
      : { in: p.receptionTypes };
  }
  if (p.receptionFeatures?.length) {
    recFilter.features = p.receptionFeatures.length === 1 ? { has: p.receptionFeatures[0] } : { hasSome: p.receptionFeatures };
  }
  if (p.receptionSizeMin !== undefined) recFilter.size = { gte: p.receptionSizeMin };
  return { some: recFilter };
}

/** Returns an `otherRoom.some` filter for requested room types, features, and/or min size, or `undefined`. */
function buildOtherRoomFilter(p: SearchParameters): any {
  if (!p.otherRoomTypes?.length && !p.otherRoomFeatures?.length && p.otherRoomSizeMin === undefined) return undefined;
  const otherFilter: any = {};
  if (p.otherRoomTypes?.length) otherFilter.type = p.otherRoomTypes.length === 1 ? p.otherRoomTypes[0] : { in: p.otherRoomTypes };
  if (p.otherRoomFeatures?.length) otherFilter.features = p.otherRoomFeatures.length === 1 ? { has: p.otherRoomFeatures[0] } : { hasSome: p.otherRoomFeatures };
  if (p.otherRoomSizeMin !== undefined) otherFilter.size = { gte: p.otherRoomSizeMin };
  return { some: otherFilter };
}

/** Returns an `amenities.some` filter for a nearby amenity by type, subtype, and/or max distance. */
function buildAmenityFilter(p: SearchParameters): any {
  if (!p.amenityType && !p.amenitySubtype && p.amenityDistanceMax === undefined) return undefined;
  const amenityFilter: any = {};
  const amenityType = filterScalar(p.amenityType, "amenityType");
  if (amenityType) amenityFilter.type = amenityType;
  const amenitySubtype = filterScalar(p.amenitySubtype, "amenitySubtype");
  if (amenitySubtype) amenityFilter.subtype = amenitySubtype;
  if (p.amenityDistanceMax !== undefined) amenityFilter.distanceM = { lte: p.amenityDistanceMax };
  if (Object.keys(amenityFilter).length === 0) return undefined;
  return { some: amenityFilter };
}

/** Returns a `runningCosts.is` filter for council tax band, service charges, and ground rent, or `undefined`. */
function buildRunningCostsFilter(p: SearchParameters): any {
  const runningIs: any = {};
  if (p.councilTaxBand) runningIs.councilTaxBand = p.councilTaxBand;
  if (p.serviceChargesMax !== undefined) runningIs.serviceCharges = { lte: p.serviceChargesMax };
  if (p.groundRentMax !== undefined) runningIs.groundRent = { lte: p.groundRentMax };
  return Object.keys(runningIs).length > 0 ? { is: runningIs } : undefined;
}

/** Returns a `utility.is.features` filter for utility room features, or `undefined`. */
function buildUtilityFilter(p: SearchParameters): any {
  if (!p.utilityFeatures?.length) return undefined;
  return { is: { features: p.utilityFeatures.length === 1 ? { has: p.utilityFeatures[0] } : { hasSome: p.utilityFeatures } } };
}

/**
 * Returns a `NOT` condition that excludes properties connected to specified utilities.
 * Each utility requires a separate `NOT` entry because Prisma array `hasNone` is not available.
 */
function buildExcludedUtilitiesFilter(p: SearchParameters): any {
  if (!p.connectedUtilitiesExclude?.length) return undefined;
  const notConditions = p.connectedUtilitiesExclude.map((u) => ({
    property: { is: { energyAndUtilities: { is: { connectedUtilities: { has: u } } } } },
  }));
  // Array form: where.NOT = [cond1, cond2] = NOT cond1 AND NOT cond2 (correct)
  // NOT: { AND: [...] } would be a NAND — wrong for exclusions
  return notConditions.length === 1 ? notConditions[0] : notConditions;
}

// ── Main export ──────────────────────────────────────────────────────────────

/**
 * Converts flat `SearchParameters` (populated by GPT) into a complete Prisma WHERE clause.
 * Sanitises all enum values before use and delegates each filter domain to a focused helper.
 */
export function buildWhereClause(rawParams: SearchParameters): any {
  const params = sanitiseParams(rawParams);

  const where: any = { published: true, archived: false };

  const price = buildPriceFilter(params);
  if (price) where.price = price;

  if (params.listingTier) where.listingTier = filterScalar(params.listingTier, "listingTier") ?? undefined;
  if (params.verificationLevel) where.verificationLevel = filterScalar(params.verificationLevel, "verificationLevel") ?? undefined;

  const moveInDate = buildMoveInDateFilter(params);
  if (moveInDate) where.moveInDate = moveInDate;

  const saleListing = buildSaleListingFilter(params);
  if (saleListing) where.saleListing = saleListing;

  const rentalListing = buildRentalListingFilter(params);
  if (rentalListing) where.rentalListing = rentalListing;

  // Property
  const property: any = {};

  const bedrooms = buildBedroomsFilter(params);
  if (bedrooms !== undefined) property.numberBedrooms = bedrooms;

  const bathrooms = buildBathroomsFilter(params);
  if (bathrooms !== undefined) property.numberBathrooms = bathrooms;

  if (params.numberReceptionsExact !== undefined) property.numberReceptions = params.numberReceptionsExact;
  else if (params.numberReceptionsMin !== undefined) property.numberReceptions = { gte: params.numberReceptionsMin };
  if (params.numberKitchensExact !== undefined) property.numberKitchens = params.numberKitchensExact;
  else if (params.numberKitchensMin !== undefined) property.numberKitchens = { gte: params.numberKitchensMin };
  if (params.numberOtherRoomsExact !== undefined) property.numberOtherRooms = params.numberOtherRoomsExact;
  else if (params.numberOtherRoomsMin !== undefined) property.numberOtherRooms = { gte: params.numberOtherRoomsMin };
  if (params.sizeMin !== undefined) property.size = { gte: params.sizeMin };
  if (params.vacant !== undefined) property.vacant = params.vacant;
  if (params.constructionType) property.constructionType = filterScalar(params.constructionType, "constructionType") ?? undefined;
  if (params.floorLevel !== undefined) property.floorLevel = params.floorLevel;
  if (params.totalFloorsMax !== undefined) property.totalFloors = { lte: params.totalFloorsMax };
  // yearBuilt is stored as a String in Prisma — filter with string comparison
  if (params.yearBuiltAfter !== undefined || params.yearBuiltBefore !== undefined) {
    property.yearBuilt = {};
    if (params.yearBuiltAfter !== undefined) property.yearBuilt.gte = String(params.yearBuiltAfter);
    if (params.yearBuiltBefore !== undefined) property.yearBuilt.lte = String(params.yearBuiltBefore);
  }

  // Type & classification
  if (params.propertyTypeName) {
    property.type = { is: { name: params.propertyTypeName } };
  }
  if (params.classificationNames?.length) {
    property.classification = params.classificationNames.length === 1
      ? { is: { name: params.classificationNames[0] } }
      : { is: { name: { in: params.classificationNames } } };
  }

  const parking = buildParkingFilter(params);
  if (parking) property.parking = parking;

  const outdoorSpace = buildOutdoorFilter(params);
  if (outdoorSpace) property.outdoorSpace = outdoorSpace;

  const energyAndUtilities = buildEnergyFilter(params);
  if (energyAndUtilities) property.energyAndUtilities = energyAndUtilities;

  const securityFeatures = buildSecurityFilter(params);
  if (securityFeatures) property.securityFeatures = securityFeatures;

  const storageFeatures = buildStorageFilter(params);
  if (storageFeatures) property.storageFeatures = storageFeatures;

  const accessibilityFeatures = buildAccessibilityFilter(params);
  if (accessibilityFeatures) property.accessibilityFeatures = accessibilityFeatures;

  const additionalFeatures = buildAdditionalFeaturesFilter(params);
  if (additionalFeatures) property.additionalFeatures = additionalFeatures;

  const bedroomFeatures = buildBedroomFeaturesFilter(params);
  if (bedroomFeatures) property.bedroomFeatures = bedroomFeatures;

  const bathroomFeatures = buildBathroomFeaturesFilter(params);
  if (bathroomFeatures) property.bathroomFeatures = bathroomFeatures;

  const kitchenFeatures = buildKitchenFeaturesFilter(params);
  if (kitchenFeatures) property.kitchenFeatures = kitchenFeatures;

  const reception = buildReceptionFilter(params);
  if (reception) property.reception = reception;

  const otherRoom = buildOtherRoomFilter(params);
  if (otherRoom) property.otherRoom = otherRoom;

  const amenities = buildAmenityFilter(params);
  if (amenities) property.amenities = amenities;

  const runningCosts = buildRunningCostsFilter(params);
  if (runningCosts) property.runningCosts = runningCosts;

  const utility = buildUtilityFilter(params);
  if (utility) property.utility = utility;

  if (Object.keys(property).length > 0) where.property = { is: property };

  // Seller username filter — Listing.user.username
  if (params.sellerUsername) {
    where.user = { is: { username: params.sellerUsername } };
  }

  // Excluded utilities — NOT wrapper at top level
  const notFilter = buildExcludedUtilitiesFilter(params);
  if (notFilter) where.NOT = notFilter;

  return where;
}
