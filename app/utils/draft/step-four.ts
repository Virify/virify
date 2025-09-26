export const createInitialStepFourValues = (draftListing: DraftListingWithFullPayload): StepFour => ({
  property: {
    address: {
      number: draftListing.property?.address?.number || null,
      flat: draftListing.property?.address?.flat || null,
      street: draftListing.property?.address?.street || null,
      city: draftListing.property?.address?.city || null,
      county: draftListing.property?.address?.county || null,
      postcode: draftListing.property?.address?.postcode || null,
      country: draftListing.property?.address?.country || null,
      fullAddress: draftListing.property?.address?.fullAddress || null,
      lat: draftListing.property?.address?.lat || null,
      lon: draftListing.property?.address?.lon || null,
    }
  }
});

/**
 * Step Four Validation Helpers
 * Clean, reusable validation functions for step four
 */
export const stepFourValidation = {
  /**
   * Check if address data is complete
   * @param address Address data
   * @returns True if all required address fields are present
   */
  isAddressValid: (address: any): boolean => {
    return !!(
      address?.number &&
      address?.street &&
      address?.city &&
      address?.postcode &&
      address?.country
    );
  },

  /**
   * Check if step four data is valid
   * @param data Step four form data
   * @returns True if all required fields are present
   */
  isStepFourValid: (data: StepFour): boolean => {
    return stepFourValidation.isAddressValid(data.property.address);
  },

  /**
   * Check if draft has existing step four data
   * @param draft Draft listing
   * @returns True if draft has complete step four data
   */
  hasExistingStepFourData: (draft: DraftListingWithFullPayload): boolean => {
    return stepFourValidation.isAddressValid(draft.property?.address);
  }
};