// ============================================================================
// Step 8: Energy & Costs - Utilities
// ============================================================================

import {
  EPCRating,
  HeatingType,
  BoilerType,
  HotWaterSource,
  RenewableEnergy,
  ConnectedUtilities,
  CouncilTaxBand,
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
// EPC Rating Options
// ============================================================================

export const epcRatingOptions = Object.values(EPCRating).map((rating) => ({
  value: rating,
  label: `Rating ${rating}`,
}))

// ============================================================================
// Heating Type Options
// ============================================================================

export const heatingTypeOptions = Object.values(HeatingType).map((type) => ({
  value: type,
  key: formatEnumLabel(type),
  info: `${formatEnumLabel(type)} heating system`,
  label: formatEnumLabel(type),
}))

// ============================================================================
// Boiler Type Options
// ============================================================================

export const boilerTypeOptions = [
  { value: null, label: 'Not applicable' },
  ...Object.values(BoilerType).map((type) => ({
    value: type,
    label: formatEnumLabel(type),
  })),
]

// ============================================================================
// Hot Water Source Options
// ============================================================================

export const hotWaterSourceOptions = [
  { value: null, label: 'Not applicable' },
  ...Object.values(HotWaterSource).map((source) => ({
    value: source,
    label: formatEnumLabel(source),
  })),
]

// ============================================================================
// Renewable Energy Options
// ============================================================================

export const renewableEnergyOptions = Object.values(RenewableEnergy).map((type) => ({
  value: type,
  key: formatEnumLabel(type),
  info: formatEnumLabel(type),
  label: formatEnumLabel(type),
}))

// ============================================================================
// Connected Utilities Options
// ============================================================================

export const connectedUtilitiesOptions = Object.values(ConnectedUtilities).map((type) => ({
  value: type,
  key: formatEnumLabel(type),
  info: `Connected to ${formatEnumLabel(type).toLowerCase()}`,
  label: formatEnumLabel(type),
}))

// ============================================================================
// Council Tax Band Options
// ============================================================================

export const councilTaxBandOptions = Object.values(CouncilTaxBand).map((band) => ({
  value: band,
  label: `Band ${band}`,
}))
