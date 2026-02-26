// ============================================================================
// Step 5: Kitchens, Receptions & Other Rooms - Utilities
// ============================================================================

import { OtherRoomType, ReceptionType, KitchenFeature, RoomFeature } from '~~/layers/database/server/database/prisma/generated/enums'

// Note: SelectOption is auto-imported from create-listing.ts

// ============================================================================
// Kitchen Feature Options
// ============================================================================

/** Get kitchen feature options for checkboxes */
export function getKitchenFeatureOptions(): SelectOption[] {
  return Object.values(KitchenFeature).map(feature => ({
    value: feature,
    label: formatEnumLabel(feature)
  }))
}

// ============================================================================
// Reception Room Options
// ============================================================================

/** Get reception type options for dropdown */
export function getReceptionTypeOptions(): SelectOption[] {
  return Object.values(ReceptionType).map(type => ({
    value: type,
    label: formatEnumLabel(type)
  }))
}

/** Get reception feature options for checkboxes */
export function getReceptionFeatureOptions(): SelectOption[] {
  return Object.values(RoomFeature).map(feature => ({
    value: feature,
    label: formatEnumLabel(feature)
  }))
}

// ============================================================================
// Other Room Options
// ============================================================================

/** Get other room type options for dropdown */
export function getOtherRoomTypeOptions(): SelectOption[] {
  return Object.values(OtherRoomType).map(type => ({
    value: type,
    label: formatEnumLabel(type)
  }))
}

/** Get other room feature options for checkboxes (excludes CONSERVATORY) */
export function getOtherRoomFeatureOptions(): SelectOption[] {
  return Object.values(RoomFeature)
    .filter(feature => feature !== 'CONSERVATORY')
    .map(feature => ({
      value: feature,
      label: formatEnumLabel(feature)
    }))
}

// ============================================================================
// Default Values
// ============================================================================

/** Create initial Step 5 state */
export function createInitialStep5Values(): Step5FormData {
  return {
    property: {
      totalFloors: 1,
      kitchenFeatures: [],
      numberKitchens: 0,
      reception: [],
      numberReceptions: 0,
      otherRoom: [],
      numberOtherRooms: 0,
    },
  }
}

// ============================================================================
// Validation
// ============================================================================

/** Validate Step 5 form */
export function isStep5Valid(state: Step5FormData): boolean {
  // Step 5 is optional - all rooms are optional
  return true
}

/** Check if Step 5 has any data */
export function hasStep5Data(state: Step5FormData): boolean {
  return (
    state.property.kitchenFeatures.length > 0 ||
    state.property.reception.length > 0 ||
    state.property.otherRoom.length > 0
  )
}
