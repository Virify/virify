export const createInitialStepFourValues = (listing: EditableListing): StepFour => ({
  property: {
    address: {
      number: listing.property?.address?.number || null,
      flat: listing.property?.address?.flat || null,
      name: listing.property?.address?.name || null,
      locality: listing.property?.address?.locality || null,
      district: listing.property?.address?.district || null,
      street: listing.property?.address?.street || null,
      city: listing.property?.address?.city || null,
      county: listing.property?.address?.county || null,
      postcode: listing.property?.address?.postcode || null,
      country: listing.property?.address?.country || null,
      fullAddress: listing.property?.address?.fullAddress || null,
      lat: listing.property?.address?.lat || null,
      lon: listing.property?.address?.lon || null,
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
      address?.postcode
      // Removed country requirement as it may not be set for older listings
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
  hasExistingStepFourData: (listing: EditableListing): boolean => {
    return stepFourValidation.isAddressValid(listing.property?.address);
  }
};