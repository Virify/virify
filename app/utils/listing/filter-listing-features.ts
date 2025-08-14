/**
 * Returns the features object if it has any displayable content (true booleans, size, or description), otherwise null.
 */
export function filterListingFeatures(features: Record<string, any> | null | undefined): Record<string, any> | null {
  if (!features || typeof features !== 'object') return null;

  // Check for any true boolean features
  const hasTrueFeature = Object.entries(features).some(
    ([key, value]) =>
      typeof value === 'boolean' && value === true && key !== 'description' && key !== 'size'
  );

  if (hasTrueFeature || features.size || features.description) {
    return features;
  }
  return null;
}

/**
 * Check if boolean-only features have any true values
 */
export function hasBooleanFeatures(features: Record<string, any> | null | undefined): boolean {
  if (!features || typeof features !== 'object') return false;
  
  return Object.entries(features).some(([key, value]) => 
    typeof value === 'boolean' && 
    value === true && 
    !['description', 'size', 'id', 'propertyId', 'createdAt', 'updatedAt'].includes(key)
  );
}
