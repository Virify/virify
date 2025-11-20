import { 
  BoilerType, 
  EPCRating, 
  HeatingType, 
  HotWaterSource, 
  RenewableEnergy, 
  ConnectedUtilities,
  ParkingFeature,
} from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Create initial values for step nine based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step nine
 */
export const createInitialStepNineValues = (listing: EditableListing): StepNine => {
  const energyAndUtilities = listing.property?.energyAndUtilities ? {
    ...listing.property.energyAndUtilities,
    boilerType: listing.property.energyAndUtilities.boilerType ?? null,
    hotWaterSource: listing.property.energyAndUtilities.hotWaterSource ?? null,
  } : {
    description: null,
    epcRating: EPCRating.UNKNOWN,
    epcCertificateUrl: null,
    primaryHeatingType: [] as HeatingType[],
    secondaryHeatingType: [] as HeatingType[],
    boilerType: null,
    hotWaterSource: null,
    renewables: [] as RenewableEnergy[],
    connectedUtilities: [] as ConnectedUtilities[],
    broadbandType: null,
    fullFibreAvailable: false,
    maxDownloadSpeedMbps: null,
  };

  // If parking indicates EV charging, pre-select EV charging in renewables
  if (listing.property?.parking?.features?.includes(ParkingFeature.EV_CHARGING)) {
    if (!energyAndUtilities.renewables.includes(RenewableEnergy.EV_CHARGING)) {
      energyAndUtilities.renewables = [...energyAndUtilities.renewables, RenewableEnergy.EV_CHARGING];
    }
  }

  return {
    property: {
      energyAndUtilities,
      runningCosts: listing.property?.runningCosts ?? {
        description: null,
        councilTaxBand: 'A',
        serviceCharges: null,
        groundRent: null,
      },
    }
  };
};

/**
 * EPC Rating options
 */
export const epcRatingOptions = Object.values(EPCRating).map((rating) => ({
  value: rating,
  key: rating === 'UNKNOWN' ? 'Unknown/NA' : rating,
  info: rating === 'UNKNOWN' ? 'EPC Rating not known or not available' : `Energy Performance Certificate rating ${rating}`
}));

/**
 * Heating Type options
 */
export const heatingTypeOptions = Object.values(HeatingType).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `${convertEnumToCapalizedString(type)} heating system`
}));

/**
 * Boiler Type options
 */
export const boilerTypeOptions = Object.values(BoilerType).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `${convertEnumToCapalizedString(type)} boiler`
}));

/**
 * Hot Water Source options
 */
export const hotWaterSourceOptions = Object.values(HotWaterSource).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `Hot water from ${convertEnumToCapalizedString(type).toLowerCase()}`
}));

/**
 * Renewable Energy options
 */
export const renewableEnergyOptions = Object.values(RenewableEnergy).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: convertEnumToCapalizedString(type)
}));

/**
 * Connected Utilities options
 */
export const connectedUtilitiesOptions = Object.values(ConnectedUtilities).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `Connected to ${convertEnumToCapalizedString(type).toLowerCase()}`
}));

/**
 * Council Tax Band options
 */
export const councilTaxBandOptions = [
  { value: 'A', key: 'Band A', info: 'Council Tax Band A (lowest)' },
  { value: 'B', key: 'Band B', info: 'Council Tax Band B' },
  { value: 'C', key: 'Band C', info: 'Council Tax Band C' },
  { value: 'D', key: 'Band D', info: 'Council Tax Band D' },
  { value: 'E', key: 'Band E', info: 'Council Tax Band E' },
  { value: 'F', key: 'Band F', info: 'Council Tax Band F' },
  { value: 'G', key: 'Band G', info: 'Council Tax Band G' },
  { value: 'H', key: 'Band H', info: 'Council Tax Band H (highest)' },
  { value: 'U', key: 'Unknown', info: 'Council Tax Band Unknown' },
  { value: 'N/A', key: 'Not Applicable', info: 'Council Tax Band Not Applicable' },
];

// Components bind directly to `stepNineData.property.energyAndUtilities.*` and
// `stepNineData.property.runningCosts` via `v-model`. Composables removed to reduce indirection.

/**
 * Step Nine Validation Helpers
 */
export const stepNineValidation = {
  /**
   * Check if energy and utilities data is valid
   * @param energyAndUtilities Energy and utilities data
   * @returns True if epcRating is provided (required field, including UNKNOWN)
   */
  areEnergyAndUtilitiesValid: (energyAndUtilities: any): boolean => {
    return !!energyAndUtilities?.epcRating;
  },

  /**
   * Check if running costs data is valid
   * @param runningCosts Running costs data
   * @returns True if councilTaxBand is provided (required field)
   */
  areRunningCostsValid: (runningCosts: any): boolean => {
    return !!runningCosts?.councilTaxBand;
  },

  /**
   * Check if step nine has valid data
   * @param data Step nine data
   * @param draft Draft listing with full payload
   * @returns True if step nine is valid (both EPC rating and council tax band required)
   */
  isStepNineValid: (data: globalThis.StepNine, draft: DraftListingWithFullPayload): boolean => {
    if (!data.property?.energyAndUtilities || !data.property?.runningCosts) return false;
    return stepNineValidation.areEnergyAndUtilitiesValid(data.property.energyAndUtilities) &&
           stepNineValidation.areRunningCostsValid(data.property.runningCosts);
  },

  /**
   * Check if step nine has been visited (relationships created)
   * @param draft Draft listing
   * @returns True if step nine relationships have been created
   */
  hasExistingStepNineData: (listing: EditableListing): boolean => {
    return !!(
      listing.property?.energyAndUtilities ||
      listing.property?.runningCosts
    );
  },
};
