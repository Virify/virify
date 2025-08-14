/**
 * Map classification to icon
 */
export const getClassificationIcon = (classification: string | undefined) => {
  // Map of classifications to icons
  const iconMappings: Record<string, string> = {
    Terraced: "property/terraced",
    "Semi-detached": "property/terraced",
    "End of Terrace": "property/terraced",
    Detached: "property/detatched",
    Mansion: "property/mansion",
    Cottage: "property/cottage",
    Bungalow: "property/bungalow",
    "Converted": "property/flat",
    "Studio": "property/flat",
    Maisonette: "property/flat",
    "High-rise": "property/flat",
    "Within a Complex": "property/flat",
    Penthouse: "property/flat",
    Land: "property/land",
    "Residential": "property/land",
    "Commercial": "property/land",
    "Agricultural": "property/land",
    "Development Plot": "property/land",
    "Development Potential": "property/land",
    "Non-working Farmhouse": "property/farm",
    "Working": "property/farm",
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

/**
 * Map room type to icon
 */
export const getRoomTypeIcon = (room: any, roomType: string) => {
  // Check the room type from the props.type or infer from the room data structure
  if (roomType === 'Bedroom' || room.hasOwnProperty('bedSize')) {
    return 'property/bedrooms';
  }
  if (roomType === 'Bathroom' || room.hasOwnProperty('shower') || room.hasOwnProperty('bath')) {
    return 'property/bathrooms';
  }
  if (roomType === 'Kitchen' || room.hasOwnProperty('whiteGoods') || room.hasOwnProperty('breakfastBar') || room.hasOwnProperty('island')) {
    return 'property/kitchen';
  }

  // Map other room types
  const roomTypeMappings: Record<string, string> = {
    gym: 'property/gym',
    office: 'property/work',
    study: 'property/work',
  };

  const roomTypeString = room.type ? room.type.toLowerCase() : room.name?.toLowerCase();
  
  return roomTypeMappings[roomTypeString] || 'property/other-room';
};

/**
 * Map garden type to icon
 */
export const getGardenTypeIcon = (gardenType: 'front' | 'rear') => {
  return gardenType === 'front' ? 'property/front-garden' : 'property/rear-garden';
};

/**
 * Map feature type to icon
 */
export const getFeatureTypeIcon = (featureKey: string) => {
  const iconMappings: Record<string, string> = {
    parking: 'property/parking',
    security: 'property/security',
    utility: 'property/utility',
    accessibility: 'property/access',
    storage: 'property/storage',
  };

  return iconMappings[featureKey] || 'property/feature';
};
