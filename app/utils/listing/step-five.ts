import { BedSizeType, BedroomFeature, BathroomFeature } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Create initial values for step five based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step five
 */
export const createInitialStepFiveValues = (listing: EditableListing): StepFive => ({
  property: {
    totalFloors: listing.property?.totalFloors || 1,
    bedroomFeatures: listing.property?.bedroomFeatures || [],
    numberBedrooms: listing.property?.numberBedrooms || 0,
    bathroomFeatures: listing.property?.bathroomFeatures || [],
    numberBathrooms: listing.property?.numberBathrooms || 0,
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
export const bedroomFeaturesOptions = Object.values(BedroomFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Bedroom ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Bathroom features options for checkbox selection
 */
export const bathroomFeaturesOptions = Object.values(BathroomFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Bathroom ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

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
   * Check if step has existing data to determine button text and skip logic
   * @param draft Draft listing
   * @returns True if step has been visited or has existing data
   */
  hasExistingStepFiveData: (listing: EditableListing): boolean => {
    const bedrooms = listing.property?.bedroomFeatures || [];
    const bathrooms = listing.property?.bathroomFeatures || [];
    
    return bedrooms.length > 0 || bathrooms.length > 0;
  }
};