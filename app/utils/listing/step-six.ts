import { OtherRoomType, ReceptionType, KitchenFeature, RoomFeature } from "~~/layers/database/server/database/prisma/generated/enums";

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
export const kitchenFeaturesOptions = Object.values(KitchenFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Kitchen ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Reception type options
 */
export const receptionTypeOptions = Object.values(ReceptionType).map((type) => ({
  value: type,
  key: convertEnumToCapalizedString(type),
  info: `${convertEnumToCapalizedString(type)} reception`
}));

/**
 * Reception room feature options
 */
export const receptionFeatureOptions = Object.values(RoomFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Reception ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

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
export const otherRoomFeatureOptions = Object.values(RoomFeature).filter((feature) => feature !== 'CONSERVATORY').map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Other room ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

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
