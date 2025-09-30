/**
 * Size Options for property measurement units.
 * Used to convert into the database from feet/meters.
 */
export const sizeOptions = [
  { value: 'meter', label: 'Metres (m²)', isDefault: true, name: 'size-meter' },
  { value: 'feet',  label: 'Feet (ft²)',     isDefault: false, name: 'size-feet' },
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
      options.push({ value: i, key: `Floor ${i}`, info: `Floor ${i} of the property` });
    }
  }
  
  return options;
}
