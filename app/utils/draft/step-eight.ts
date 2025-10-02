/** TODO: CREATE PATCH AND MORE FEATURES */

/**
 * Create initial values for step eight based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step eight
 */
export const createInitialStepEightValues = (draftListing: DraftListingWithFullPayload): StepEight => ({
  property: {
    additionalFeatures: draftListing.property?.additionalFeatures || {
      description: null,
      petFriendly: true,
      pool: false,
      internet: false,
      concierge: false,
      shop: false,
      gym: false,
      moveInDate: null,
    },
    accessibilityFeatures: draftListing.property?.accessibilityFeatures || {
      description: null,
      wheelchairFriendly: false,
      stepFreeAccess: false,
      wideDoorways: false,
      wetRoom: false,
      handrails: false,
      elevator: false,
      stairs: false,
      accessibleParking: false,
    },
    parking: draftListing.property?.parking || {
      description: null,
      garage: false,
      driveway: false,
      permitParking: false,
      onStreet: false,
      noParking: false,
      carport: false,
      allocatedParking: false,
      evCharging: false,
    },
    securityFeatures: draftListing.property?.securityFeatures || {
      description: null,
      gatedCommunity: false,
      cctv: false,
      alarmSystem: false,
      neighborhoodWatch: false,
      intercomSystem: false,
      security: false,
      reception: false,
    },
    storageFeatures: draftListing.property?.storageFeatures || {
      description: null,
      attic: false,
      basement: false,
      separateDressing: false,
      underStairsStorage: false,
    },
  }
});

/**
 * Additional Features options for checkbox selection
 */
export const additionalFeaturesOptions = [
  { value: 'petFriendly', key: 'Pet Friendly', info: 'Pets are allowed' },
  { value: 'pool', key: 'Pool', info: 'Property has a pool' },
  { value: 'internet', key: 'Internet', info: 'Internet included' },
  { value: 'concierge', key: 'Concierge', info: 'Concierge service available' },
  { value: 'shop', key: 'Shop', info: 'On-site shop available' },
  { value: 'gym', key: 'Gym', info: 'Gym facilities available' },
];

/**
 * Parking options for checkbox selection
 */
export const parkingOptions = [
  { value: 'garage', key: 'Garage', info: 'Has garage' },
  { value: 'driveway', key: 'Driveway', info: 'Has driveway' },
  { value: 'permitParking', key: 'Permit Parking', info: 'Permit parking required' },
  { value: 'onStreet', key: 'On Street', info: 'On-street parking available' },
  { value: 'noParking', key: 'No Parking', info: 'No parking available' },
  { value: 'carport', key: 'Carport', info: 'Has carport' },
  { value: 'allocatedParking', key: 'Allocated Parking', info: 'Has allocated parking space' },
  { value: 'evCharging', key: 'EV Charging', info: 'EV charging point available' },
];

/**
 * Security Features options for checkbox selection
 */
export const securityOptions = [
  { value: 'gatedCommunity', key: 'Gated Community', info: 'Property is in a gated community' },
  { value: 'cctv', key: 'CCTV', info: 'CCTV security cameras' },
  { value: 'alarmSystem', key: 'Alarm System', info: 'Alarm system installed' },
  { value: 'neighborhoodWatch', key: 'Neighbourhood Watch', info: 'Part of neighbourhood watch scheme' },
  { value: 'intercomSystem', key: 'Intercom System', info: 'Intercom system installed' },
  { value: 'security', key: 'Security Personnel', info: 'On-site security personnel' },
  { value: 'reception', key: 'Reception', info: '24-hour reception' },
];

/**
 * Accessibility Features options for checkbox selection
 */
export const accessibilityOptions = [
  { value: 'wheelchairFriendly', key: 'Wheelchair Friendly', info: 'Wheelchair accessible' },
  { value: 'stepFreeAccess', key: 'Step Free Access', info: 'Step-free access available' },
  { value: 'wideDoorways', key: 'Wide Doorways', info: 'Wide doorways throughout' },
  { value: 'wetRoom', key: 'Wet Room', info: 'Wet room available' },
  { value: 'handrails', key: 'Handrails', info: 'Handrails installed' },
  { value: 'elevator', key: 'Elevator', info: 'Elevator/lift available' },
  { value: 'stairs', key: 'Stairs', info: 'Property has stairs' },
  { value: 'accessibleParking', key: 'Accessible Parking', info: 'Accessible parking available' },
];

/**
 * Storage Features options for checkbox selection
 */
export const storageOptions = [
  { value: 'attic', key: 'Attic', info: 'Attic storage available' },
  { value: 'basement', key: 'Basement', info: 'Basement available' },
  { value: 'separateDressing', key: 'Separate Dressing Room', info: 'Separate dressing room' },
  { value: 'underStairsStorage', key: 'Under Stairs Storage', info: 'Under stairs storage' },
];

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
  areAdditionalFeaturesValid: (additionalFeatures: any): boolean => {
    return !!additionalFeatures?.description;
  },

  /**
   * Check if step eight has valid data
   * @param draft Draft listing with full payload
   * @returns True if step eight is valid
   */
  isStepEightValid: (data: globalThis.StepEight, draft: DraftListingWithFullPayload): boolean => {
    if (!draft.property?.additionalFeatures) return false;
    return stepEightValidation.areAdditionalFeaturesValid(draft.property.additionalFeatures);
  },

  /**
   * Check if step eight has any existing data
   * @param draft Draft listing with full payload
   * @returns True if step eight has existing data
   */
  hasExistingStepEightData: (draft: DraftListingWithFullPayload): boolean => {
    return !!(
      draft.property?.additionalFeatures ||
      draft.property?.accessibilityFeatures ||
      draft.property?.parking ||
      draft.property?.securityFeatures ||
      draft.property?.storageFeatures
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
    getSelectedFeatures(stepEightData.value?.property?.additionalFeatures, additionalFeaturesOptions)
  );

  const update = (selectedFeatures: string[]) => {
    if (!stepEightData.value?.property?.additionalFeatures) return;
    updateFeatures(stepEightData.value.property.additionalFeatures, selectedFeatures, additionalFeaturesOptions);
  };

  return { selected, update };
};

/**
 * Create composable for Parking
 */
export const useParking = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    getSelectedFeatures(stepEightData.value?.property?.parking, parkingOptions)
  );

  const update = (selectedFeatures: string[]) => {
    if (!stepEightData.value?.property?.parking) return;
    updateFeatures(stepEightData.value.property.parking, selectedFeatures, parkingOptions);
  };

  return { selected, update };
};

/**
 * Create composable for Security Features
 */
export const useSecurity = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    getSelectedFeatures(stepEightData.value?.property?.securityFeatures, securityOptions)
  );

  const update = (selectedFeatures: string[]) => {
    if (!stepEightData.value?.property?.securityFeatures) return;
    updateFeatures(stepEightData.value.property.securityFeatures, selectedFeatures, securityOptions);
  };

  return { selected, update };
};

/**
 * Create composable for Accessibility Features
 */
export const useAccessibility = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    getSelectedFeatures(stepEightData.value?.property?.accessibilityFeatures, accessibilityOptions)
  );

  const update = (selectedFeatures: string[]) => {
    if (!stepEightData.value?.property?.accessibilityFeatures) return;
    updateFeatures(stepEightData.value.property.accessibilityFeatures, selectedFeatures, accessibilityOptions);
  };

  return { selected, update };
};

/**
 * Create composable for Storage Features
 */
export const useStorageFeatures = (stepEightData: Ref<StepEight>) => {
  const selected = computed(() => 
    getSelectedFeatures(stepEightData.value?.property?.storageFeatures, storageOptions)
  );

  const update = (selectedFeatures: string[]) => {
    if (!stepEightData.value?.property?.storageFeatures) return;
    updateFeatures(stepEightData.value.property.storageFeatures, selectedFeatures, storageOptions);
  };

  return { selected, update };
};
