import type { EditableListing } from "~~/shared/types/listing";

/**
 * Utilities for Step Two of the listing creation process.
 */
import { ConstructionType } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Fetch property types with their classification options from the API.
 */
const propertyTypes = await $fetch<PropertyTypeWithOptions[]>("/api/property-type/");

/**
 * Property Type Select Options
 */
export const propertyTypeSelectOptions = propertyTypes.map((type) => {
  return { value: type.id, key: type.name, info: type.name  };
});

/**
 * Get property classifications for a specific property type.
 * @param propertyTypeId ID of the property type
 * @returns Array of property classification options
 */
export function getPropertyClassifications(propertyTypeId: number): { value: number; key: string; info: string }[] {
  const propertyType = propertyTypes.find((type) => type.id === propertyTypeId);
  if (!propertyType) {
    return [];
  }

  return propertyType.options.map((option) => ({
    value: option.key,
    key: option.value,
    info: option.value
  }));
};

/**
 * Property Construction Types
 */
export const constructionOptions = Object.values(ConstructionType).map((option) => {
  return { value: option, key: convertEnumToCapalizedString(option), info: "Property is of Construction: " + convertEnumToCapalizedString(option) };
});

/**
 * Year Built Options
 */
const currentYear = new Date().getFullYear();
export const yearBuiltOptions = [
  { value: '0', key: 'Select Year Built' },
  ...Array.from({ length: currentYear - 1800 + 1 }, (_, i) => currentYear - i).map((year) => ({
    value: year,
    key: year.toString(),
  })),
];

/**
 * Convert feet to meters.
 * @param feet Value in feet to convert to meters
 * @returns Value in meters
 */
export function convertFeetToMeters(feet: number): number {
  return parseFloat((feet * 0.3048).toFixed(2));
}

export const createInitialStepTwoValues = (listing: EditableListing): StepTwo => {
  return {
    property: {
      type: listing.property?.type.id || null,
      classification: listing.property?.classification.id || null,
      constructionType: listing.property?.constructionType || null,
      yearBuilt: listing.property?.yearBuilt || '0',
      size: listing.property?.size || null,
      description: listing.property?.description || null,
      totalFloors: listing.property?.totalFloors || 1,
    }
  }
}

/**
 * Step Two Validation Helpers
 * Clean, reusable validation functions for step two
 */
export const stepTwoValidation = {
  /**
   * Check if step two data is valid
   * @param data Step two form data
   * @returns True if all required fields are present
   */
  isStepTwoValid: (data: StepTwo): boolean => {
    return !!(
      data.property.type &&
      data.property.classification &&
      data.property.description &&
      data.property.totalFloors
    );
  },

  /**
   * Check if step two has existing data
   * @param draft Draft listing
   * @returns True if draft has complete step two data
   */
  hasExistingStepTwoData: (listing: EditableListing): boolean => {
    return !!(
      listing.property?.type && 
      listing.property?.classification && 
      listing.property?.description && 
      listing.property?.totalFloors
    );
  }
};
