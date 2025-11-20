import { GardenFacing, GardenPosition, OutdoorSpaceFeature, LandFeature } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Create initial values for step seven based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step seven
 */
export const createInitialStepSevenValues = (listing: EditableListing): StepSeven => {
  const outdoorSpace = listing.property?.outdoorSpace;
  const gardens = outdoorSpace?.garden || [];
  const yards = outdoorSpace?.yard || [];
  const lands = outdoorSpace?.land || [];
  

  return {
    property: {
      outdoorSpace: {
        description: outdoorSpace?.description || null,
        totalArea: outdoorSpace?.totalArea || null,
        hasGarden: gardens.length > 0,
        hasYard: yards.length > 0,
        hasLand: lands.length > 0,
        garden: gardens.map(g => ({
          ...g,
          position: (g.position || '0') as any,
          facing: (g.facing || '0') as any,
        })),
        yard: yards.map(y => ({
          ...y,
          position: (y.position || '0') as any,
          facing: (y.facing || '0') as any,
        })),
        land: lands,
        features: (
          (b => (b.includes(OutdoorSpaceFeature.POOL) || 
          !(gardens.some(g => g.features?.includes(OutdoorSpaceFeature.POOL)) || 
          yards.some(y => y.features?.includes(OutdoorSpaceFeature.POOL)))) ? 
          b : [...b, OutdoorSpaceFeature.POOL])
          (outdoorSpace?.features ?? [])
        ),
      }
    }
  };
};

/**
 * Garden facing options
 */
export const gardenFacingOptions = [
  { value: '0', key: 'Select a facing' },
  ...Object.values(GardenFacing).map((facing) => ({
    value: facing,
    key: convertEnumToCapalizedString(facing),
    info: `Garden faces ${convertEnumToCapalizedString(facing).toLowerCase()}`
  }))
];

/**
 * Garden position options
 */
export const gardenPositionOptions = [
  { value: '0', key: 'Select a position' },
  ...Object.values(GardenPosition).map((position) => ({
    value: position,
    key: convertEnumToCapalizedString(position),
    info: `${convertEnumToCapalizedString(position)} garden`
  }))
];

/**
 * Garden features options for checkbox selection
 */
export const gardenFeaturesOptions = Object.values(OutdoorSpaceFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Garden ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Yard features options for checkbox selection (same as garden features)
 */
export const yardFeaturesOptions = Object.values(OutdoorSpaceFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Yard ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Outdoor space features options for checkbox selection
 * These are general features that apply to the entire outdoor space
 */
export const outdoorSpaceFeaturesOptions = Object.values(OutdoorSpaceFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Outdoor space ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Land features options for checkbox selection
 */
export const landFeaturesOptions = Object.values(LandFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Land ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Step Seven Validation Helpers
 * Clean, reusable validation functions for step seven (outdoor spaces)
 */
export const stepSevenValidation = {
  /**
   * Check if garden data is valid
   * @param gardens Array of garden data
   * @returns True if all gardens have required fields (name only)
   */
  areGardensValid: (gardens: any[]): boolean => {
    if (gardens.length === 0) return true; // Gardens are optional

    return gardens.every((garden) => garden.name);
  },

  /**
   * Check if yard data is valid
   * @param yards Array of yard data
   * @returns True if all yards have required fields (name only)
   */
  areYardsValid: (yards: any[]): boolean => {
    if (yards.length === 0) return true; // Yards are optional

    return yards.every((yard) => yard.name);
  },

  /**
   * Check if land data is valid
   * @param lands Array of land data
   * @returns True if all land parcels have required fields (name)
   */
  areLandsValid: (lands: any[]): boolean => {
    if (lands.length === 0) return true; // Land is optional

    return lands.every((land) =>
      land.name
    );
  },

  /**
   * Check if step seven data is valid overall
   * @param data Step seven form data
   * @returns True if required fields are present
   */
  isStepSevenValid: (data: StepSeven): boolean => {
    const gardens = data.property.outdoorSpace.garden || [];
    const yards = data.property.outdoorSpace.yard || [];
    const lands = data.property.outdoorSpace.land || [];
    const hasGarden = data.property.outdoorSpace.hasGarden;
    const hasYard = data.property.outdoorSpace.hasYard;
    const hasLand = data.property.outdoorSpace.hasLand;

    // If hasGarden is true, there MUST be at least one garden
    if (hasGarden && gardens.length === 0) {
      return false;
    }

    // If hasYard is true, there MUST be at least one yard
    if (hasYard && yards.length === 0) {
      return false;
    }

    // If hasLand is true, there MUST be at least one land
    if (hasLand && lands.length === 0) {
      return false;
    }

    // Validate all outdoor spaces if they exist
    return stepSevenValidation.areGardensValid(gardens) &&
           stepSevenValidation.areYardsValid(yards) &&
           stepSevenValidation.areLandsValid(lands);
  },

  /**
   * Check if step seven has been visited (outdoorSpace relationship exists)
   * @param draft Draft listing
   * @returns True if outdoorSpace has been created
   */
  hasExistingStepSevenData: (listing: EditableListing): boolean => {
    return !!listing.property?.outdoorSpace;
  }
};
