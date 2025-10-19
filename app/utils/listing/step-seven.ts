import type { EditableListing } from "~~/shared/types/listing";
import type { DraftListingWithFullPayload, StepSeven } from "../../../shared/types/draft";
import { GardenFacing, GardenPosition } from "~~/layers/database/server/database/prisma/generated/enums";

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
        // Convert null position/facing to '0' for select dropdowns (like yearBuilt in Step 2)
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
        // OutdoorSpace boolean features
        sunTerrace: outdoorSpace?.sunTerrace || false,
        terrace: outdoorSpace?.terrace || false,
        balcony: outdoorSpace?.balcony || false,
        patio: outdoorSpace?.patio || false,
        separateParcel: outdoorSpace?.separateParcel || false,
        shed: outdoorSpace?.shed || false,
        summerHouse: outdoorSpace?.summerHouse || false,
        gardenOffice: outdoorSpace?.gardenOffice || false,
        pool: outdoorSpace?.pool || false,
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
 * Yard features options for checkbox selection (same as garden features)
 */
export const yardFeaturesOptions = [
  { value: "sunTerrace", key: "Sun Terrace", info: "Yard has a sun terrace" },
  { value: "terrace", key: "Terrace", info: "Yard has a terrace" },
  { value: "balcony", key: "Balcony", info: "Yard has balcony access" },
  { value: "patio", key: "Patio", info: "Yard has a patio" },
  { value: "shed", key: "Shed", info: "Yard includes a shed" },
  { value: "summerHouse", key: "Summer House", info: "Yard has a summer house" },
  { value: "gardenOffice", key: "Garden Office", info: "Yard includes an office" },
  { value: "pool", key: "Pool", info: "Yard has a swimming pool" },
  { value: "separateParcel", key: "Separate Parcel", info: "Yard is on a separate parcel" },
];

/**
 * Outdoor space features options for checkbox selection
 * These are general features that apply to the entire outdoor space
 */
export const outdoorSpaceFeaturesOptions = [
  { value: "sunTerrace", key: "Sun Terrace", info: "Outdoor space has a sun terrace" },
  { value: "terrace", key: "Terrace", info: "Outdoor space has a terrace" },
  { value: "balcony", key: "Balcony", info: "Outdoor space has balcony access" },
  { value: "patio", key: "Patio", info: "Outdoor space has a patio" },
  { value: "shed", key: "Shed", info: "Outdoor space includes a shed" },
  { value: "summerHouse", key: "Summer House", info: "Outdoor space has a summer house" },
  { value: "gardenOffice", key: "Garden Office", info: "Outdoor space includes an office" },
  { value: "pool", key: "Pool", info: "Outdoor space has a swimming pool" },
  { value: "separateParcel", key: "Separate Parcel", info: "Outdoor space is on a separate parcel" },
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
