// ============================================================================
// Step 1: Listing Type - Utilities
// ============================================================================

import type { SelectOption } from './create-listing'

// ============================================================================
// Listing Type Options
// ============================================================================

/** Listing type (sale or rent) options */
export const listingTypeItems: SelectOption[] = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
]

/** Boolean yes/no options for chain status */
export const chainItems: SelectOption[] = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
]

/** Boolean yes/no options for bills included */
export const billsIncludedItems: SelectOption[] = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
]

// ============================================================================
// Sale Listing Options
// ============================================================================

/** Property tenure type options */
export const tenureItems: SelectOption[] = [
  { value: 'FREEHOLD', label: 'Freehold' },
  { value: 'LEASEHOLD', label: 'Leasehold' },
  { value: 'COMMONHOLD', label: 'Commonhold' },
]

/** Sale availability status options */
export const saleAvailabilityItems: SelectOption[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'UNDER_OFFER', label: 'Under Offer' },
  { value: 'SOLD', label: 'Sold' },
]

// ============================================================================
// Rental Listing Options
// ============================================================================

/** Furnished status options */
export const furnishedItems: SelectOption[] = [
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'PART_FURNISHED', label: 'Part Furnished' },
  { value: 'FURNISHED', label: 'Furnished' },
]

/** Rental length options */
export const rentalLengthItems: SelectOption[] = [
  { value: 'LONG_TERM', label: 'Long-term' },
  { value: 'SHORT_TERM', label: 'Short-term' },
]

/** Rental availability status options */
export const rentalAvailabilityItems: SelectOption[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'LET_AGREED', label: 'Let Agreed' },
  { value: 'LET', label: 'Let' },
]

// ============================================================================
// Default Values
// ============================================================================

/** Default sale listing values */
export function createDefaultSaleListing() {
  return {
    tenureType: 'FREEHOLD' as const,
    chain: false,
    sharedOwnership: false,
    availabilityStatus: 'AVAILABLE' as const,
  }
}

/** Default rental listing values */
export function createDefaultRentalListing() {
  return {
    furnishedStatus: 'UNFURNISHED' as const,
    isBillsIncluded: false,
    rentalLength: 'LONG_TERM' as const,
    availabilityStatus: 'AVAILABLE' as const,
  }
}

/** Create initial Step 1 state */
export function createInitialStep1Values(): Step1FormData {
  return {
    selectedType: 'sale',
    saleListing: createDefaultSaleListing(),
    rentalListing: null,
  }
}

// ============================================================================
// Validation
// ============================================================================

/** Validate Step 1 form */
export function isStep1Valid(state: Step1FormData): boolean {
  if (state.selectedType === 'sale') {
    return !!state.saleListing?.tenureType
  }
  if (state.selectedType === 'rent') {
    return !!state.rentalListing?.furnishedStatus && 
           state.rentalListing?.isBillsIncluded != null &&
           !!state.rentalListing?.rentalLength
  }
  return false
}
