// ============================================================================
// Step 4: Bedrooms & Bathrooms - Utilities
// ============================================================================

import { BedSizeType, BedroomFeature, BathroomFeature } from '~~/layers/database/server/database/prisma/generated/enums'

// Note: FloorOption, SelectOption, getFloorOptions, sqftToSqm, sqmToSqft, 
// sizeUnitItems, slideoverUiConfig are auto-imported from create-listing.ts

// ============================================================================
// Types
// ============================================================================

export type RoomWithSize = { size?: number | null }

// Note: SizeUnit is auto-imported from create-listing.ts

// ============================================================================
// Bed Size Options
// ============================================================================

/** Get bed size options for dropdown */
export function getBedSizeOptions(): SelectOption[] {
  return Object.values(BedSizeType).map(size => ({
    value: size,
    label: formatEnumLabel(size)
  }))
}

/** Format bed size enum for display */
export function formatBedSize(size: string): string {
  return formatEnumLabel(size)
}

// ============================================================================
// Bedroom Feature Options
// ============================================================================

/** Get bedroom feature options for checkboxes */
export function getBedroomFeatureOptions(): SelectOption[] {
  return Object.values(BedroomFeature).map(feature => ({
    value: feature,
    label: formatEnumLabel(feature)
  }))
}

// ============================================================================
// Bathroom Feature Options
// ============================================================================

/** Get bathroom feature options for checkboxes */
export function getBathroomFeatureOptions(): SelectOption[] {
  return Object.values(BathroomFeature).map(feature => ({
    value: feature,
    label: formatEnumLabel(feature)
  }))
}

// ============================================================================
// Feature Toggle Helper
// ============================================================================

/** Toggle a feature in a room's features array */
export function toggleRoomFeature(
  features: string[] | undefined,
  feature: string,
  checked: boolean
): string[] {
  const currentFeatures = features ?? []
  if (checked) {
    if (!currentFeatures.includes(feature)) {
      return [...currentFeatures, feature]
    }
    return currentFeatures
  } else {
    return currentFeatures.filter(f => f !== feature)
  }
}
