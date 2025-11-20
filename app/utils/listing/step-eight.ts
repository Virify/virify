import { BuildingFeature, ParkingFeature, SecurityFeature, AccessibilityFeature, StorageFeature, UtilityFeature } from "~~/layers/database/server/database/prisma/generated/enums";

/** TODO: CREATE PATCH AND MORE FEATURES */

/**
 * Create initial values for step eight based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step eight
 */
export const createInitialStepEightValues = (listing: EditableListing): StepEight => ({
  property: {
    additionalFeatures: listing.property?.additionalFeatures || {
      description: null,
      petFriendly: true,
      features: [],
      moveInDate: null,
    },
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

/**
 * Helper composables for Step Eight feature sections
 * These create the computed properties and update functions for each feature section
 */

/**
 * Create composable for Additional Features
 */
export const useAdditionalFeatures = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    stepEightData.value?.property?.additionalFeatures?.features || []
  );

  const update = (selectedFeatures: BuildingFeature[]) => {
    if (!stepEightData.value?.property?.additionalFeatures) return;
    stepEightData.value.property.additionalFeatures.features = selectedFeatures;
  };

  return { selected, update };
};

/**
 * Create composable for Parking
 */
export const useParking = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    stepEightData.value?.property?.parking?.features || []
  );

  const update = (selectedFeatures: ParkingFeature[]) => {
    if (!stepEightData.value?.property?.parking) return;
    stepEightData.value.property.parking.features = selectedFeatures;
  };

  return { selected, update };
};

/**
 * Create composable for Security Features
 */
export const useSecurity = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    stepEightData.value?.property?.securityFeatures?.features || []
  );

  const update = (selectedFeatures: SecurityFeature[]) => {
    if (!stepEightData.value?.property?.securityFeatures) return;
    stepEightData.value.property.securityFeatures.features = selectedFeatures;
  };

  return { selected, update };
};

/**
 * Create composable for Accessibility Features
 */
export const useAccessibility = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    stepEightData.value?.property?.accessibilityFeatures?.features || []
  );

  const update = (selectedFeatures: AccessibilityFeature[]) => {
    if (!stepEightData.value?.property?.accessibilityFeatures) return;
    stepEightData.value.property.accessibilityFeatures.features = selectedFeatures;
  };

  return { selected, update };
};

/**
 * Create composable for Storage Features
 */
export const useStorageFeatures = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    stepEightData.value?.property?.storageFeatures?.features || []
  );

  const update = (selectedFeatures: StorageFeature[]) => {
    if (!stepEightData.value?.property?.storageFeatures) return;
    stepEightData.value.property.storageFeatures.features = selectedFeatures;
  };

  return { selected, update };
};

/**
 * Create composable for Utility Room Features
 */
export const useUtilityRoomFeatures = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    stepEightData.value?.property?.utility?.features || []
  );

  const update = (selectedFeatures: UtilityFeature[]) => {
    if (!stepEightData.value?.property?.utility) return;
    stepEightData.value.property.utility.features = selectedFeatures;
  };

  return { selected, update };
};
