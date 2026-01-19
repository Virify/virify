// ============================================================================
// Step 3: Price - Utilities
// ============================================================================

import type { SelectOption } from './create-listing'
import { formatPrice } from './create-listing'

// ============================================================================
// Sale Price Options
// ============================================================================

/** Price type options for sale listings */
export const priceTypeItems: SelectOption[] = [
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'OFFERS_OVER', label: 'Offers Over' },
  { value: 'GUIDE_PRICE', label: 'Guide Price' },
]

// ============================================================================
// Rental Price Options
// ============================================================================

/** Rent frequency options */
export const rentFrequencyItems: SelectOption[] = [
  { value: 'MONTHLY', label: 'Per Month' },
  { value: 'WEEKLY', label: 'Per Week' },
]

// ============================================================================
// Price Formatting
// ============================================================================

/** Format sale price with price type prefix */
export function formatSalePrice(price: number | null | undefined, priceType: string | undefined): string {
  const formattedPrice = formatPrice(price)
  
  switch (priceType) {
    case 'OFFERS_OVER':
      return `Offers Over ${formattedPrice}`
    case 'GUIDE_PRICE':
      return `Guide Price ${formattedPrice}`
    default:
      return formattedPrice
  }
}

/** Format rental price with frequency suffix */
export function formatRentalPrice(price: number | null | undefined, frequency: string | undefined): string {
  const formattedPrice = formatPrice(price)
  const suffix = frequency === 'WEEKLY' ? 'pw' : 'pcm'
  return `${formattedPrice} ${suffix}`
}

// ============================================================================
// Default Values
// ============================================================================

/** Default sale listing pricing values */
export function createDefaultSalePricing() {
  return {
    priceType: 'FIXED' as const,
  }
}

/** Default rental listing pricing values */
export function createDefaultRentalPricing() {
  return {
    rentFrequency: 'MONTHLY' as const,
    deposit: null as number | null,
    holdingDeposit: null as number | null,
  }
}

/** Create initial Step 3 state for sale */
export function createInitialStep3SaleValues() {
  return {
    price: null as number | null,
    saleListing: createDefaultSalePricing(),
    rentalListing: null,
  }
}

/** Create initial Step 3 state for rent */
export function createInitialStep3RentalValues() {
  return {
    price: null as number | null,
    saleListing: null,
    rentalListing: createDefaultRentalPricing(),
  }
}

// ============================================================================
// Validation
// ============================================================================

/** Validate Step 3 form */
export function isStep3Valid(
  state: { price: number | null; saleListing?: { priceType?: string } | null; rentalListing?: { rentFrequency?: string } | null },
  listingType: 'sale' | 'rent'
): boolean {
  if (!state.price || state.price <= 0) return false
  
  if (listingType === 'sale') {
    return !!state.saleListing?.priceType
  }
  if (listingType === 'rent') {
    return !!state.rentalListing?.rentFrequency
  }
  return false
}

// ============================================================================
// Alert Descriptions
// ============================================================================

/** Get alert description based on listing type */
export function getStep3AlertDescription(listingType: 'sale' | 'rent'): string {
  return listingType === 'sale'
    ? 'Set your asking price and how you\'d like it displayed to potential buyers.'
    : 'Set your rental price, frequency, and any deposit requirements.'
}
