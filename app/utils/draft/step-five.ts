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
    bathroomFeatures: draftListing.property?.bathroomFeatures || [],
    numberBathrooms: draftListing.property?.numberBathrooms || 0,
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
 * Bathroom features options for checkbox selection
 */
export const bathroomFeaturesOptions = [
  { value: "toilet", key: "Toilet", info: "Bathroom has a toilet" },
  { value: "enSuite", key: "En Suite", info: "Bathroom is an en suite" },
  { value: "bathtub", key: "Bathtub", info: "Bathroom has a bathtub" },
  { value: "walkInShower", key: "Walk-in Shower", info: "Bathroom has a walk-in shower" },
];

/**
 * Step Five Validation Helpers
 * Clean, reusable validation functions for step five (bedrooms and bathrooms)
 */
export const stepFiveValidation = {
  /**
   * Check if bedroom features are valid
   * @param bedroomFeatures Array of bedroom feature data
   * @returns True if all bedroom features have required fields
   */
  areBedroomFeaturesValid: (bedroomFeatures: any[]): boolean => {
    if (bedroomFeatures.length === 0) return true; // Bedrooms are optional
    
    return bedroomFeatures.every(bedroom =>
      bedroom.name &&
      bedroom.roomNumber &&
      bedroom.floor &&
      bedroom.bed.length
    );
  },

  /**
   * Check if bathroom features are valid
   * @param bathroomFeatures Array of bathroom feature data
   * @returns True if all bathroom features have required fields
   */
  areBathroomFeaturesValid: (bathroomFeatures: any[]): boolean => {
    if (bathroomFeatures.length === 0) return true; // Bathrooms are optional
    
    return bathroomFeatures.every(bathroom =>
      bathroom.name &&
      bathroom.roomNumber &&
      bathroom.floor
    );
  },

  /**
   * Check if step five data is valid
   * @param data Step five form data
   * @returns True if all required fields are present
   */
  isStepFiveValid: (data: StepFive): boolean => {
    return stepFiveValidation.areBedroomFeaturesValid(data.property.bedroomFeatures) &&
           stepFiveValidation.areBathroomFeaturesValid(data.property.bathroomFeatures);
  },

  /**
   * Check if draft has existing step five data
   * @param draft Draft listing
   * @returns True if draft has complete step five data
   */
  hasExistingStepFiveData: (draft: DraftListingWithFullPayload): boolean => {
    const bedrooms = draft.property?.bedroomFeatures || [];
    const bathrooms = draft.property?.bathroomFeatures || [];
    
    // Has data if there are any rooms added
    const hasData = bedrooms.length > 0 || bathrooms.length > 0;
    
    if (!hasData) {
      return false;
    }
    
    return stepFiveValidation.areBedroomFeaturesValid(bedrooms) &&
           stepFiveValidation.areBathroomFeaturesValid(bathrooms);
  }
};