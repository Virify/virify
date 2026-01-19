// ============================================================================
// Step 7: Additional Features - Utilities
// ============================================================================

import {
  ParkingFeature,
  AccessibilityFeature,
  SecurityFeature,
  StorageFeature,
  UtilityFeature,
  BuildingFeature,
} from '~~/layers/database/server/database/prisma/generated/enums'

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
// Parking Options
// ============================================================================

export const parkingFeatureOptions = Object.values(ParkingFeature).map((feature) => ({
  value: feature,
  label: formatEnumLabel(feature),
}))

// ============================================================================
// Accessibility Options
// ============================================================================

export const accessibilityFeatureOptions = Object.values(AccessibilityFeature).map((feature) => ({
  value: feature,
  label: formatEnumLabel(feature),
}))

// ============================================================================
// Security Options
// ============================================================================

export const securityFeatureOptions = Object.values(SecurityFeature).map((feature) => ({
  value: feature,
  label: formatEnumLabel(feature),
}))

// ============================================================================
// Storage Options
// ============================================================================

export const storageFeatureOptions = Object.values(StorageFeature).map((feature) => ({
  value: feature,
  label: formatEnumLabel(feature),
}))

// ============================================================================
// Utility Room Options
// ============================================================================

export const utilityFeatureOptions = Object.values(UtilityFeature).map((feature) => ({
  value: feature,
  label: formatEnumLabel(feature),
}))

// ============================================================================
// Building/Additional Features Options
// ============================================================================

export const buildingFeatureOptions = Object.values(BuildingFeature).map((feature) => ({
  value: feature,
  label: formatEnumLabel(feature),
}))

// ============================================================================
// Pet Friendly Options
// ============================================================================

export const petFriendlyOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]
