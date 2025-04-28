// Enums

export enum PropertyType {
  HOUSE = "HOUSE",
  COTTAGE = "COTTAGE",
  BUNGALOW = "BUNGALOW",
  PENTHOUSE = "PENTHOUSE",
  FLAT = "FLAT",
  LAND = "LAND",
  FARM = "FARM",
  SHARED_OWNERSHIP = "SHARED_OWNERSHIP",
  RETIREMENT_HOME = "RETIREMENT_HOME",
  NEW_BUILD_HOME = "NEW_BUILD_HOME",
  STUDENT_ACCOMMODATION = "STUDENT_ACCOMMODATION"
}

export enum PropertyClassification {
  // Houses
  TERRACED_HOUSE = "TERRACED_HOUSE",
  SEMI_DETACHED_HOUSE = "SEMI_DETACHED_HOUSE",
  END_OF_TERRACE_HOUSE = "END_OF_TERRACE_HOUSE",
  DETACHED_HOUSE = "DETACHED_HOUSE",
  MANSION = "MANSION",

  // Cottages
  TERRACED_COTTAGE = "TERRACED_COTTAGE",
  SEMI_DETACHED_COTTAGE = "SEMI_DETACHED_COTTAGE",
  END_OF_TERRACE_COTTAGE = "END_OF_TERRACE_COTTAGE",
  DETACHED_COTTAGE = "DETACHED_COTTAGE",

  // Bungalows
  TERRACED_BUNGALOW = "TERRACED_BUNGALOW",
  SEMI_DETACHED_BUNGALOW = "SEMI_DETACHED_BUNGALOW",
  END_OF_TERRACE_BUNGALOW = "END_OF_TERRACE_BUNGALOW",
  DETACHED_BUNGALOW = "DETACHED_BUNGALOW",

  // Flats
  PENTHOUSE = "PENTHOUSE",
  CONVERTED_FLAT = "CONVERTED_FLAT",
  STUDIO_FLAT = "STUDIO_FLAT",
  MAISONETTE = "MAISONETTE",
  HIGH_RISE_FLAT = "HIGH_RISE_FLAT",
  COMPLEX_FLAT = "COMPLEX_FLAT",

  // Land
  RESIDENTIAL_LAND = "RESIDENTIAL_LAND",
  COMMERCIAL_LAND = "COMMERCIAL_LAND",
  AGRICULTURAL_LAND = "AGRICULTURAL_LAND",
  DEVELOPMENT_PLOT = "DEVELOPMENT_PLOT",

  // Farms
  NON_WORKING_FARMHOUSE = "NON_WORKING_FARMHOUSE",
  WORKING_FARM = "WORKING_FARM",

  // Other
  SHARED_OWNERSHIP = "SHARED_OWNERSHIP",
  RETIREMENT_HOME = "RETIREMENT_HOME",
  NEW_BUILD_HOME = "NEW_BUILD_HOME",

  // Student Accommodation
  STUDENT_FLAT = "STUDENT_FLAT",
  STUDENT_HOUSE = "STUDENT_HOUSE",
  STUDENT_HOUSE_SHARE = "STUDENT_HOUSE_SHARE"
}

export enum ConstructionType {
  STANDARD = "STANDARD",
  NON_STANDARD = "NON_STANDARD"
}

export enum RoofConstruction {
  SLATE_TILE = "SLATE_TILE",
  CONCRETE_TILE = "CONCRETE_TILE"
}

export enum FurnishingStatus {
  FURNISHED = "FURNISHED",
  UNFURNISHED = "UNFURNISHED",
  PART_FURNISHED = "PART_FURNISHED"
}

export enum Tenure {
  LEASEHOLD = "LEASEHOLD",
  FREEHOLD = "FREEHOLD"
}

function formatLabel(key: string): string {
  return key
    .toLowerCase()
    .split('_')
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

export const propertyTypeOptions = Object.values(PropertyType).map(type => ({
  label: formatLabel(type),
  value: type
}));

export const propertyClassificationOptions = Object.values(PropertyClassification).map(value => ({
  label: formatLabel(value),
  value
}));

export const constructionTypeOptions = Object.values(ConstructionType).map(value => ({
  label: formatLabel(value),
  value
}));

export const roofConstructionOptions = Object.values(RoofConstruction).map(value => ({
  label: formatLabel(value),
  value
}));

export const furnishingStatusOptions = Object.values(FurnishingStatus).map(value => ({
  label: formatLabel(value),
  value
}));

export const tenureOptions = Object.values(Tenure).map(value => ({
  label: formatLabel(value),
  value
}));
