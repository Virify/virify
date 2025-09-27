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
 * Step Five Validation Helpers
 * Clean, reusable validation functions for step five
 */
export const stepFiveValidation = {
  /**
   * Check if bedroom features are valid
   * @param bedroomFeatures Array of bedroom feature data
   * @returns True if all bedroom features have required fields
   */
  areBedroomFeaturesValid: (bedroomFeatures: any[]): boolean => {
    if (bedroomFeatures.length === 0) return false;
    
    return bedroomFeatures.every(bedroom =>
      bedroom.name &&
      bedroom.roomNumber &&
      bedroom.floor &&
      bedroom.bed.length
    );
  },

  /**
   * Check if step five data is valid
   * @param data Step five form data
   * @returns True if all required fields are present
   */
  isStepFiveValid: (data: StepFive): boolean => {
    return stepFiveValidation.areBedroomFeaturesValid(data.property.bedroomFeatures);
  },

  /**
   * Check if draft has existing step five data
   * @param draft Draft listing
   * @returns True if draft has complete step five data
   */
  hasExistingStepFiveData: (draft: DraftListingWithFullPayload): boolean => {
    return !!(
      draft.property?.bedroomFeatures?.length &&
      stepFiveValidation.areBedroomFeaturesValid(draft.property.bedroomFeatures)
    );
  }
};