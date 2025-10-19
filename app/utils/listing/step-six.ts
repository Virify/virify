import { FireplaceType, OtherRoomType, ReceptionType } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Create initial values for step six based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step six
 */
export const createInitialStepSixValues = (listing: EditableListing): StepSix => ({
  property: {
    totalFloors: listing.property?.totalFloors || 1,
    kitchenFeatures: listing.property?.kitchenFeatures || [],
    numberKitchens: listing.property?.numberKitchens ?? listing.property?.kitchenFeatures?.length ?? 0,
    reception: listing.property?.reception || [],
    numberReceptions: listing.property?.numberReceptions ?? listing.property?.reception?.length ?? 0,
    otherRoom: listing.property?.otherRoom || [],
    numberOtherRooms: listing.property?.numberOtherRooms ?? listing.property?.otherRoom?.length ?? 0,
  }
});

/**
 * Kitchen features options for checkbox selection
 */
export const kitchenFeaturesOptions = [
  { value: "modern", key: "Modern Finish", info: "Kitchen has contemporary fittings and finishes" },
  { value: "openPlan", key: "Open Plan", info: "Kitchen opens into the living space" },
  { value: "whiteGoods", key: "Includes White Goods", info: "Essential appliances are provided" },
  { value: "breakfastBar", key: "Breakfast Bar", info: "Kitchen includes a breakfast bar" },
  { value: "island", key: "Kitchen Island", info: "Kitchen includes an island workspace" },
  { value: "utilityAccess", key: "Utility Room Access", info: "Kitchen has access to a utility room" },
  { value: "pantry", key: "Pantry", info: "Kitchen includes a dedicated pantry" },
];

/**
 * Reception type options
 */
export const receptionTypeOptions = Object.values(ReceptionType).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `${convertEnumToCapalizedString(type)} reception`
}));

/**
 * Fireplace options shared between reception and other room forms
 */
export const fireplaceTypeOptions = Object.values(FireplaceType).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `${convertEnumToCapalizedString(type)} fireplace`
}));

export const fireplaceSelectNoneValue = "NONE";

export const fireplaceSelectOptions = [
  { value: fireplaceSelectNoneValue, key: "No Fireplace", info: "Room does not include a fireplace" },
  ...fireplaceTypeOptions,
];

/**
 * Reception room feature options
 */
export const receptionFeatureOptions = [
  { value: "conservatory", key: "Conservatory", info: "Room opens into a conservatory" },
  { value: "openPlan", key: "Open Plan", info: "Room connects to other spaces" },
  { value: "openConcept", key: "Open Concept", info: "Flexible open-concept layout" },
  { value: "balcony", key: "Balcony", info: "Room has balcony access" },
  { value: "bayWindow", key: "Bay Window", info: "Room includes a bay window" },
  { value: "builtInShelving", key: "Built-in Shelving", info: "Room has fitted shelving" },
  { value: "hasView", key: "View", info: "Room offers a notable outlook" },
  { value: "patioDoors", key: "Patio Doors", info: "Room opens onto a patio" },
  { value: "builtInStorage", key: "Built-in Storage", info: "Room features built-in storage" },
  { value: "servingHatch", key: "Serving Hatch", info: "Includes a serving hatch" },
  { value: "barArea", key: "Bar Area", info: "Room has a built-in bar" },
  { value: "soundProofing", key: "Sound Proofing", info: "Room has sound proofing" },
  { value: "accousticPanels", key: "Acoustic Panels", info: "Room fitted with acoustic panels" },
  { value: "stoneFlooring", key: "Stone Flooring", info: "Room has stone flooring" },
  { value: "hardwoodFlooring", key: "Hardwood Flooring", info: "Room has hardwood flooring" },
  { value: "builtInDesk", key: "Built-in Desk", info: "Room includes a built-in desk" },
];

/**
 * Other room type options
 */
export const otherRoomTypeOptions = Object.values(OtherRoomType).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `${convertEnumToCapalizedString(type)} room`
}));

/**
 * Other room features share most options with reception rooms
 */
export const otherRoomFeatureOptions = receptionFeatureOptions.filter((feature) => feature.value !== "conservatory");

/**
 * Step Six Validation Helpers
 * Clean, reusable validation functions for step six (kitchens, receptions, and other rooms)
 */
export const stepSixValidation = {
  /**
   * Check if kitchen data is valid
   * @param kitchenFeatures Array of kitchen feature data
   * @returns True if all kitchens have required fields
   */
  areKitchenFeaturesValid: (kitchenFeatures: any[]): boolean => {
    // Kitchens are optional
    return true;
  },

  /**
   * Check if reception rooms are valid (optional list)
   * @param receptionRooms Array of reception data
   * @returns True if all receptions have required fields
   */
  areReceptionRoomsValid: (receptionRooms: any[]): boolean => {
    // Receptions are optional
    return true;
  },

  /**
   * Check if other rooms are valid (optional list)
   * @param otherRooms Array of other room data
   * @returns True if all other rooms have required fields
   */
  areOtherRoomsValid: (otherRooms: any[]): boolean => {
    // Other rooms are optional
    return true;
  },

  /**
   * Check if step six data is valid overall
   * @param data Step six form data
   * @returns True if all required fields are present
   */
  isStepSixValid: (data: StepSix): boolean => {
    return stepSixValidation.areKitchenFeaturesValid(data.property.kitchenFeatures) &&
      stepSixValidation.areReceptionRoomsValid(data.property.reception) &&
      stepSixValidation.areOtherRoomsValid(data.property.otherRoom);
  },

  /**
   * Check if step six has been visited (any kitchen/reception/other rooms added)
   * @param draft Draft listing
   * @returns True if step has been visited or has existing data
   */
  hasExistingStepSixData: (listing: EditableListing): boolean => {
    const kitchens = listing.property?.kitchenFeatures || [];
    const receptions = listing.property?.reception || [];
    const otherRooms = listing.property?.otherRoom || [];

    return kitchens.length > 0 || receptions.length > 0 || otherRooms.length > 0;
  }
};
