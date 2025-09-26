import { BedSizeType } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Create initial values for step five based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step five
 */
export const createInitialStepFiveValues = (draftListing: DraftListingWithFullPayload): StepFive => ({
  property: {
    totalFloors: draftListing.property?.totalFloors || 1,
    bedroomFeatures: draftListing.property?.bedroomFeatures || [],
    numberBedrooms: draftListing.property?.numberBedrooms || 0,
  }
});

/**
 * Bed size type options for forms
 */
export const bedSizeOptions = Object.values(BedSizeType).map((size) => ({
  value: size,
  key: convertEnumToCapalizedString(size),
  info: `${convertEnumToCapalizedString(size)} bed size`
}));

/**
 * Bedroom features options for checkbox selection
 */
export const bedroomFeaturesOptions = [
  { value: "enSuite", key: "En Suite", info: "Bedroom has an en suite bathroom" },
  { value: "builtInStorage", key: "Built-in Storage", info: "Bedroom has built-in storage" },
  { value: "walkInWardrobe", key: "Walk-in Wardrobe", info: "Bedroom has a walk-in wardrobe" },
  { value: "bayWindow", key: "Bay Window", info: "Bedroom has a bay window" },
  { value: "balcony", key: "Balcony", info: "Bedroom has access to a balcony" },
  { value: "hasView", key: "Has View", info: "Bedroom has a notable view" },
  { value: "patioDoors", key: "Patio Doors", info: "Bedroom has patio doors" },
  { value: "builtInDesk", key: "Built-in Desk", info: "Bedroom has a built-in desk" },
];

/**
 * Size options for room measurements
 */
export const sizeOptions = [
  { value: "meter", key: "Sq Meters", info: "Square meters", name: "sqm", isDefault: true },
  { value: "feet", key: "Sq Feet", info: "Square feet", name: "sqft" },
];

/**
 * Get floor options based on total floors in the property
 * @param totalFloors - Total number of floors in the property
 * @returns Array of floor options for dropdowns
 */
export function getFloorOptions(totalFloors: number) {
  const options = [];
  
  for (let i = 1; i <= totalFloors -1; i++) {
    if (i === 1) {
      options.push({ value: i, key: "Ground Floor", info: "Ground floor of the property" });
    } else {
      options.push({ value: i, key: `Floor ${i}`, info: `Floor ${i} of the property` });
    }
  }
  
  return options;
}