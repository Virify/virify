
/**
 * Create initial values for step six of the draft process.
 * @param draftListing Draft listing to extract initial values from
 * @returns Initial values for step six
 */
export const createInitialStepSixValues = (draftListing: DraftListingWithFullPayload): StepSix => ({
  property: {
    totalFloors: draftListing.property?.totalFloors || 1,
    bathroomFeatures: draftListing.property?.bathroomFeatures || [],
    numberBathrooms: draftListing.property?.numberBathrooms || null,
  },
});

export const stepSixValidation = {

  areBathroomFeaturesValid: (bathroomFeatures: any): boolean => {
    if(bathroomFeatures.length === 0) return false;

    return bathroomFeatures.every((feature: any) =>
      feature.name &&
      feature.roomNumber &&
      feature.floor
    );
  },
  
  /**
   * Check if step six data is valid
   * @param data Step six form data
   * @returns True if all required fields are present
   */
  isStepSixValid: (data: StepSix): boolean => {
    return stepSixValidation.areBathroomFeaturesValid(data.property.bathroomFeatures)
  },

  /**
   * Check if draft has existing step six data
   * @param draft Draft listing
   * @returns True if draft has complete step six data
   */
  hasExistingStepSixData: (draft: DraftListingWithFullPayload): boolean => {
    return !!(
      draft.property?.bathroomFeatures.length &&
      stepSixValidation.areBathroomFeaturesValid(draft.property.bathroomFeatures)
    );
  }
};

/**
 * Bathroom features options for selection
 */
export const bathroomFeaturesOptions = [
  { value: "toilet", key: "Toilet", info: "Bathroom has a toilet" },
  { value: "enSuite", key: "En Suite", info: "Private bathroom connected to a bedroom" },
  { value: "bathtub", key: "Bath Tub", info: "Bathroom has a bathtub" },
  { value: "walkInShower", key: "Walk-in Shower", info: "Bathroom has a walk-in shower" },
];
