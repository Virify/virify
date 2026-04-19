// ============================================================================
// Shared Create Listing Utilities
// Used across all steps in the create listing flow
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type SizeUnit = 'sqm' | 'sqft'

export interface SelectOption {
  value: string | number | boolean | null
  label: string
}

export interface FloorOption {
  value: number
  label: string
}

// ============================================================================
// Size Conversion Utilities
// ============================================================================

/** Convert square feet to square meters */
export function sqftToSqm(sqft: number): number {
  return Math.round(sqft * 0.092903 * 100) / 100
}

/** Convert square meters to square feet */
export function sqmToSqft(sqm: number): number {
  return Math.round(sqm / 0.092903 * 100) / 100
}

/** Size unit options for dropdown */
export const sizeUnitItems: SelectOption[] = [
  { value: 'sqm', label: 'm²' },
  { value: 'sqft', label: 'ft²' },
]

// ============================================================================
// Floor Options
// ============================================================================

/** Generate floor options based on total floors */
export function getFloorOptions(totalFloors: number): FloorOption[] {
  const options: FloorOption[] = []
  for (let i = 0; i < totalFloors; i++) {
    if (i === 0) {
      options.push({ value: i, label: 'Ground Floor' })
    } else {
      options.push({ value: i, label: `Floor ${i}` })
    }
  }
  return options
}

// ============================================================================
// Helpers
// ============================================================================

/** Format enum value to human-readable label (SNAKE_CASE -> Title Case) */
export function formatEnumLabel(value: string): string {
  return value.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())
}

/** Format price in GBP currency */
export function formatPrice(price: number | null | undefined): string {
  if (!price) return '£0'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// ============================================================================
// Slideover UI Config
// ============================================================================

/** Shared slideover UI configuration for consistent styling */
export const slideoverUiConfig = {
  content: 'w-full! lg:max-w-lg!',
  header: 'bg-(--background-100)',
  body: 'bg-(--background-100) p-4 sm:p-6',
  footer: 'w-full! bg-(--background-100) py-2 px-4'
}

// ============================================================================
// Boolean Options (Yes/No)
// ============================================================================

export const booleanItems: SelectOption[] = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
]
