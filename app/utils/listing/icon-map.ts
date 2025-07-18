/**
 * Map classification to icon
 */
export const getClassificationIcon = (classification: string | undefined) => {
  // Map of classifications to icons
  const iconMappings: Record<string, string> = {
    Terraced: "property/terraced",
    "Semi-detached": "property/terraced",
    "End of terrace": "property/terraced",
    Detached: "property/detatched",
    Mansion: "property/mansion",
    Cottage: "property/cottage",
    Bungalow: "property/bungalow",
    "Converted flat": "property/flat",
    "Studio flat": "property/flat",
    Maisonette: "property/flat",
    "High-rise": "property/flat",
    "Within a complex": "property/flat",
    Penthouse: "property/flat",
    Land: "property/land",
    "Residential Land": "property/land",
    "Commercial Land": "property/land",
    "Agricultural Land": "property/land",
    "Development plot": "property/land",
    "Development potential": "property/land",
    "Non-working Farmhouse": "property/farm",
    "Working Farm": "property/farm",
    "Small Holding": "property/farm",
    "Shared Ownership": "property/shared",
    "Retirement Home": "property/other",
    "New Build Home": "property/newbuild",
    "Student Accommodation": "property/other",
    House: "property/house",
    "House-share": "property/shared",
  };

  return classification && iconMappings[classification]
    ? iconMappings[classification]
    : "property/other";
};

/**
 * Map property type to icon
 */
export const getPropertyTypeIcon = (propertyType: string | undefined) => {
  // Map of property types to icons
  const iconMappings: Record<string, string> = {
    House: "property/house",
    Cottage: "property/cottage",
    Bungalow: "property/bungalow",
    Flat: "property/flat",
    Land: "property/land",
    Farms: "property/farm",
    Farm: "property/farm",
    Specialty: "property/other",
    "Student Accommodation": "property/shared",
    "Shared Ownership": "property/shared",
    "New Build": "property/newbuild",
    Retirement: "property/other",
    Terraced: "property/terraced",
    Detached: "property/detatched",
    "Semi-detached": "property/terraced",
    Mansion: "property/mansion",
  };

  return propertyType && iconMappings[propertyType]
    ? iconMappings[propertyType]
    : "property/other";
};
