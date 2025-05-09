/**
 * Utility function to map selected features into the Prisma query format
 * 
 * @param features - Array of features with group and key
 * @returns Prisma Table Object : { group: { key: true } }
 */
export function mapFeatureToFilters(features: { group: string; key: string }[] | undefined) {
  // Return an empty object if `features` is undefined
  if (!features) return {};

  return features.reduce((acc, { group, key }) => {
    if (!acc[group]) {
      acc[group] = {};
    }

    // Handle special case for "garden"
    if (key === "garden") {
      acc[group]["frontGarden"] = true;
      acc[group]["rearGarden"] = true;
    } else {
      acc[group][key] = true;
    }

    return acc;
  }, {} as Record<string, Record<string, boolean>>);
}
