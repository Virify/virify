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

    // Handle special case for "garden" - now under outdoorSpace
    if (key === "garden") {
      acc["outdoorSpace"] = { garden: true };
    } else {
      acc[group][key] = true;
    }

    return acc;
  }, {} as Record<string, Record<string, boolean>>);
}
