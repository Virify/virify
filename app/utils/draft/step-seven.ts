import type { DraftListingWithFullPayload, StepSeven } from "../../../shared/types/draft";
import { GardenFacing, GardenPosition } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Create initial values for step seven based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step seven
 */
export const createInitialStepSevenValues = (draftListing: DraftListingWithFullPayload): StepSeven => ({
  property: {
    outdoorSpace: {
      description: draftListing.property?.outdoorSpace?.description || null,
      totalGardenSize: draftListing.property?.outdoorSpace?.totalGardenSize || null,
      totalLandSize: draftListing.property?.outdoorSpace?.totalLandSize || null,
      garden: draftListing.property?.outdoorSpace?.garden || [],
      land: draftListing.property?.outdoorSpace?.land || []
    }
  }
});

/**
 * Garden facing options
 */
export const gardenFacingOptions = Object.values(GardenFacing).map((facing) => ({
  value: facing,
  key: convertEnumToCapalizedString(facing),
  info: `Garden faces ${convertEnumToCapalizedString(facing).toLowerCase()}`
}));

/**
 * Garden position options
 */
export const gardenPositionOptions = Object.values(GardenPosition).map((position) => ({
  value: position,
  key: convertEnumToCapalizedString(position),
  info: `${convertEnumToCapalizedString(position)} garden`
}));

/**
 * Garden features options for checkbox selection
 */
export const gardenFeaturesOptions = [
  { value: "sunTerrace", key: "Sun Terrace", info: "Garden has a sun terrace" },
  { value: "terrace", key: "Terrace", info: "Garden has a terrace" },
  { value: "balcony", key: "Balcony", info: "Garden has balcony access" },
  { value: "patio", key: "Patio", info: "Garden has a patio" },
  { value: "shed", key: "Shed", info: "Garden includes a shed" },
  { value: "summerHouse", key: "Summer House", info: "Garden has a summer house" },
  { value: "gardenOffice", key: "Garden Office", info: "Garden includes an office" },
  { value: "pool", key: "Pool", info: "Garden has a swimming pool" },
  { value: "separateParcel", key: "Separate Parcel", info: "Garden is on a separate parcel" },
];

/**
 * Land features options for checkbox selection
 */
export const landFeaturesOptions = [
  { value: "woodland", key: "Woodland", info: "Land includes woodland area" },
  { value: "paddock", key: "Paddock", info: "Land has a paddock" },
  { value: "stables", key: "Stables", info: "Land includes stables" },
  { value: "tennisCourt", key: "Tennis Court", info: "Land has a tennis court" },
  { value: "orchard", key: "Orchard", info: "Land includes an orchard" },
  { value: "pond", key: "Pond", info: "Land has a pond" },
  { value: "outbuilding", key: "Outbuilding", info: "Land includes outbuildings" },
  { value: "separateParcel", key: "Separate Parcel", info: "Land is on a separate parcel" },
];

/**
 * Step Seven Validation Helpers
 * Clean, reusable validation functions for step seven (outdoor spaces)
 */
export const stepSevenValidation = {
  /**
   * Check if garden data is valid
   * @param gardens Array of garden data
   * @returns True if all gardens have required fields (name, position, facing)
   */
  areGardensValid: (gardens: any[]): boolean => {
    if (gardens.length === 0) return true; // Gardens are optional

    return gardens.every((garden) =>
      garden.name &&
      garden.position !== null &&
      garden.position !== undefined &&
      garden.facing !== null &&
      garden.facing !== undefined
    );
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
    const lands = data.property.outdoorSpace.land || [];

    // At least one garden or land parcel should exist, or explicit confirmation that there are none
    const hasOutdoorSpace = gardens.length > 0 || lands.length > 0;
    
    // If there's outdoor space, validate it
    if (hasOutdoorSpace) {
      return stepSevenValidation.areGardensValid(gardens) &&
             stepSevenValidation.areLandsValid(lands);
    }

    // If no outdoor space, that's valid too (outdoor space is optional)
    return true;
  },

  /**
   * Check if step seven has been visited (outdoorSpace relationship exists)
   * @param draft Draft listing
   * @returns True if outdoorSpace has been created
   */
  hasExistingStepSevenData: (draft: DraftListingWithFullPayload): boolean => {
    return !!draft.property?.outdoorSpace;
  }
};
