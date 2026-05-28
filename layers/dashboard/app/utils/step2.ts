// ============================================================================
// Step 2: Property Basics - Utilities
// ============================================================================

import type { SelectOption } from "./create-listing";

// ============================================================================
// Construction Type Options
// ============================================================================

/** Construction type options */
export const constructionTypeItems: SelectOption[] = [
  { value: null, label: "Not specified" },
  { value: "STANDARD", label: "Standard" },
  { value: "NON_STANDARD", label: "Non-standard" },
];

// ============================================================================
// Default Values
// ============================================================================

/** Default empty address state */
export function createEmptyAddress(): AddressParsed {
  return {
    number: null,
    flat: null,
    name: null,
    street: null,
    city: null,
    postcode: null,
    country: null,
    locality: null,
    county: null,
    district: null,
    fullAddress: null,
    lat: null,
    lon: null,
  };
}

/** Create initial Step 2 state */
export function createInitialStep2Values(): Step2FormData {
  return {
    property: {
      address: createEmptyAddress(),
      type: null as unknown as number,
      classification: null as unknown as number,
      totalFloors: 1,
      constructionType: null,
      size: null,
      yearBuilt: null,
    },
  };
}

// ============================================================================
// Validation
// ============================================================================

/** Check if address is valid (has required fields) */
export function isAddressValid(
  address: AddressParsed | null | undefined,
): boolean {
  if (!address) return false;
  return !!(address.street && address.city && address.postcode);
}

/** Validate Step 2 form */
export function isStep2Valid(state: Step2FormData): boolean {
  return !!(
    isAddressValid(state.property.address) &&
    state.property.type &&
    state.property.classification &&
    state.property.totalFloors >= 1
  );
}

// ============================================================================
// Year Built
// ============================================================================

/** Get current year for year built bounds */
export const currentYear = new Date().getFullYear();

/** Minimum year for year built */
export const minYearBuilt = 1500;
