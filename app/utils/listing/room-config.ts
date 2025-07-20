/**
 * Generate room configurations for property listings
 * @param property - Property object containing room feature data
 * @returns Array of room configurations for MoleculesFeatureSummary
 */
export const generateRoomConfig = (property: any) => {
  if (!property) return [];

  return [
    {
      type: "bedrooms",
      features: property.bedroomFeatures || [],
    },
    {
      type: "bathrooms", 
      features: property.bathroomFeatures || [],
    },
    {
      type: "receptions",
      features: property.reception || [],
    },
    {
      type: "kitchen",
      features: property.kitchenFeatures,
    },
    {
      type: "utility",
      features: property.utility,
    },
  ];
};

/**
 * Generate custom room configurations
 * @param rooms - Array of room objects with type and features
 * @param excludedKeys - Optional global excluded keys
 * @returns Array of room configurations
 */
export const generateCustomRoomConfigs = (
  rooms: Array<{ type: string; features: any; excludedKeys?: string[] }>,
  excludedKeys?: string[]
) => {
  return rooms.map((room) => ({
    type: room.type,
    features: room.features,
    excludedKeys: [...(excludedKeys || []), ...(room.excludedKeys || [])],
  }));
};