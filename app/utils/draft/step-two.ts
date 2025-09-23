
/**
 * Utilities for Step Two of the listing creation process.
 */

import { ConstructionType } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Fetch property types with their classification options from the API.
 */
export const propertyTypes = await $fetch<PropertyTypeWithOptions[]>("/api/property-type/");

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

export const constructionOptions = Object.values(ConstructionType).map((option) => {
  return { value: option, key: convertEnumToCapalizedString(option), info: "Property is of Construction: " + convertEnumToCapalizedString(option) };
});

const currentYear = new Date().getFullYear();
export const yearBuiltOptions = [
  { value: '0', key: 'Select Year Built' },
  ...Array.from({ length: currentYear - 1800 + 1 }, (_, i) => currentYear - i).map((year) => ({
    value: year,
    key: year.toString(),
  })),
];
