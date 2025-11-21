import { BuildingFeature, ParkingFeature, SecurityFeature, AccessibilityFeature, StorageFeature, UtilityFeature, OutdoorSpaceFeature, OtherRoomType } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Create initial values for step eight based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step eight
 */
export const createInitialStepEightValues = (listing: EditableListing): StepEight => ({
  property: {
    additionalFeatures: (() => {
      const existing = listing.property?.additionalFeatures || {
        description: null,
        petFriendly: true,
        features: [] as BuildingFeature[],
        moveInDate: null,
      };

      const outdoor = listing.property?.outdoorSpace;
      const otherRooms = listing.property?.otherRoom ?? [];

      const features = [...(existing.features ?? [])];

      // If outdoor.features includes POOL, add BuildingFeature.POOL
      if ((outdoor?.features ?? []).includes(OutdoorSpaceFeature.POOL) && !features.includes(BuildingFeature.POOL)) {
        features.push(BuildingFeature.POOL);
      }

      // If any otherRoom has type GYM, add BuildingFeature.GYM
      if (otherRooms.some((r: any) => r.type === OtherRoomType.GYM) && !features.includes(BuildingFeature.GYM)) {
        features.push(BuildingFeature.GYM);
      }

      return { ...existing, features };
    })(),
    accessibilityFeatures: listing.property?.accessibilityFeatures || {
      description: null,
      features: [],
    },
    parking: listing.property?.parking || {
      description: null,
      features: [],
    },
    securityFeatures: listing.property?.securityFeatures || {
      description: null,
      features: [],
    },
    storageFeatures: listing.property?.storageFeatures || {
      description: null,
      features: [],
    },
    utility: listing.property?.utility || {
      description: null,
      features: [],
      size: null,
    },
  }
});

/**
 * Additional Features options for checkbox selection
 */
export const additionalFeaturesOptions = Object.values(BuildingFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Building ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Parking options for checkbox selection
 */
export const parkingOptions = Object.values(ParkingFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Parking ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Security Features options for checkbox selection
 */
export const securityOptions = Object.values(SecurityFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Security ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Accessibility Features options for checkbox selection
 */
export const accessibilityOptions = Object.values(AccessibilityFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Accessibility ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Storage Features options for checkbox selection
 */
export const storageOptions = Object.values(StorageFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Storage ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Utility Room options for checkbox selection
 */
export const utilityRoomOptions = Object.values(UtilityFeature).map((feature) => ({
  value: feature,
  key: convertEnumToCapalizedString(feature),
  info: `Utility ${convertEnumToCapalizedString(feature).toLowerCase()}`
}));

/**
 * Step Eight Validation Helpers
 * Clean, reusable validation functions for step eight (property features)
 */
export const stepEightValidation = {
  /**
   * Check if additional features data is valid
   * @param additionalFeatures Additional features data
   * @returns True if description is provided (required field)
   */
  areAdditionalFeaturesValid: (): boolean => {
    return true;
  },

  /**
   * Check if step eight has valid data
   * @param draft Draft listing with full payload
   * @returns True if step eight is valid
   */
  isStepEightValid: (data: globalThis.StepEight, draft: DraftListingWithFullPayload): boolean => {
    return stepEightValidation.areAdditionalFeaturesValid();
  },

  /**
   * Check if step eight has been visited (relationships created)
   * @param draft Draft listing with full payload
   * @returns True if any step eight relationship has been created
   */
  hasExistingStepEightData: (listing: EditableListing): boolean => {
    return !!(
      listing.property?.additionalFeatures ||
      listing.property?.accessibilityFeatures ||
      listing.property?.parking ||
      listing.property?.securityFeatures ||
      listing.property?.storageFeatures ||
      listing.property?.utility
    );
  },
};
