/**
 * Extract and format features from room data objects
 * @param features - Array of feature objects to process
 * @param excludedKeys - Array of keys to exclude from processing
 * @returns Array of formatted feature strings
 */
export const extractFeatures = (features: any[], excludedKeys: string[] = []) => {
  const defaultExcludedKeys = [
    "id",
    "description", 
    "createdAt",
    "updatedAt",
    "roomNumber",
    "size",
  ];

  const allExcludedKeys = [...defaultExcludedKeys, ...excludedKeys];

  const allFeatures =
    features?.flatMap((feature) => {
      const roomFeatures = Object.entries(feature)
        .filter(
          ([key, value]) =>
            (value === true || (typeof value === "string" && value)) &&
            !allExcludedKeys.includes(key)
        )
        .map(([key, value]) => {
          const formattedKey =
            key.charAt(0).toUpperCase() +
            key
              .slice(1)
              .replace(/([A-Z])/g, " $1")
              .trim();
          const featureText =
            typeof value === "string"
              ? value
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : formattedKey;

          // Add room number prefix only if there are multiple rooms
          return feature.roomNumber && features.length > 1
            ? `Room ${feature.roomNumber}: ${featureText}`
            : featureText;
        });

      // Add size information if available
      if (feature.size) {
        const roundedSize = Math.floor(feature.size);
        const sizeText = `Size: ${roundedSize}m²`;
        const formattedSize =
          feature.roomNumber && features.length > 1
            ? `Room ${feature.roomNumber}: ${sizeText}`
            : sizeText;
        roomFeatures.unshift(formattedSize); // Add size at the beginning
      }

      return roomFeatures;
    }) || [];

  return [...new Set(allFeatures.flat())];
};