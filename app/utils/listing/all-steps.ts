/**
 * Size Options for property measurement units.
 * Used to convert into the database from feet/meters.
 */
export const sizeOptions = [
  { value: 'meter', key: 'm²', info: 'Square meters', isDefault: true },
  { value: 'feet', key: 'ft²', info: 'Square feet', isDefault: false },
]


/**
 * Get floor options based on total floors in the property
 * @param totalFloors - Total number of floors in the property
 * @returns Array of floor options for dropdowns
 */
export function getFloorOptions(totalFloors: number) {
  const options = [];
  
  for (let i = 1; i <= totalFloors; i++) {
    if (i === 1) {
      options.push({ value: i, key: "Ground Floor", info: "Ground floor of the property" });
    } else {
      options.push({ value: i, key: `Floor ${i - 1}`, info: `Floor ${i - 1} of the property` });
    }
  }
  
  return options;
}

/**
 * Helper to get selected features as an array from boolean properties
 * Generic helper for checkbox groups that need to convert boolean properties to arrays
 * @param features The features object with boolean properties
 * @param options The options array to check against
 * @returns Array of selected feature keys
 */
export const getSelectedFeatures = (features: any, options: Array<{ value: string }>): string[] => {
  if (!features) return [];
  
  const selected: string[] = [];
  options.forEach(option => {
    if (features[option.value]) {
      selected.push(option.value);
    }
  });
  
  return selected;
};

/**
 * Helper to update features object from array of selected values
 * Generic helper for checkbox groups that need to convert arrays back to boolean properties
 * @param features The features object to update
 * @param selectedFeatures Array of selected feature keys
 * @param options The options array defining all possible features
 */
export const updateFeatures = (features: any, selectedFeatures: string[], options: Array<{ value: string }>): void => {
  if (!features) return;
  
  // Reset all features to false
  options.forEach(option => {
    features[option.value] = false;
  });
  
  // Set selected features to true
  selectedFeatures.forEach(feature => {
    features[feature] = true;
  });
};
