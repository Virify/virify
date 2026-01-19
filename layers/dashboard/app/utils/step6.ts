// ============================================================================
// Step 6: Outdoor Spaces - Utilities
// ============================================================================

import { GardenFacing, GardenPosition, OutdoorSpaceFeature, LandFeature } from '~~/layers/database/server/database/prisma/generated/enums'

// Note: SelectOption is auto-imported from create-listing.ts

// ============================================================================
// Helper function
// ============================================================================

function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

// ============================================================================
// Garden Options
// ============================================================================

/** Get garden facing options for dropdown */
export const gardenFacingOptions = Object.values(GardenFacing).map(facing => ({
  value: facing,
  key: formatEnumLabel(facing),
  label: formatEnumLabel(facing),
}))

/** Get garden position options for dropdown */
export const gardenPositionOptions = Object.values(GardenPosition).map(position => ({
  value: position,
  key: formatEnumLabel(position),
  label: formatEnumLabel(position),
}))

/** Get outdoor space feature options for checkboxes (gardens/yards) */
export const outdoorSpaceFeatureOptions = Object.values(OutdoorSpaceFeature).map(feature => ({
  value: feature,
  key: formatEnumLabel(feature),
  label: formatEnumLabel(feature),
}))

// Alias for compatibility with existing components
export const outdoorSpaceFeaturesOptions = outdoorSpaceFeatureOptions

// ============================================================================
// Land Options
// ============================================================================

/** Get land feature options for checkboxes */
export const landFeatureOptions = Object.values(LandFeature).map(feature => ({
  value: feature,
  key: formatEnumLabel(feature),
  label: formatEnumLabel(feature),
}))
