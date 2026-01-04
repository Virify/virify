import { createSharedComposable } from "@vueuse/core";

export interface StepConfig {
  title: string;
  complete?: boolean;
  data?: any;
  update?: Function;
  component?: any;
}

export const useListingStep = createSharedComposable(() => {
  const currentStepStates = ref<Record<number, number>>({});
  
  // Clean up old listing states to prevent memory leaks
  const MAX_CACHED_LISTINGS = 10;
  const cleanupOldListings = () => {
    const listingIds = Object.keys(currentStepStates.value).map(Number);
    if (listingIds.length > MAX_CACHED_LISTINGS) {
      // Keep only the most recently accessed drafts
      const toRemove = listingIds.slice(0, listingIds.length - MAX_CACHED_LISTINGS);
      toRemove.forEach(listingId => {
        delete currentStepStates.value[listingId];
      });
    }
  };

  /**
   * Initialize step state for a listing
   */
  const initializeListingStep = (listingId: number) => {
    if (!currentStepStates.value[listingId]) {
      currentStepStates.value[listingId] = 0;
      cleanupOldListings(); // Clean up memory periodically
    }
    return currentStepStates.value[listingId];
  };

  /**
   * Get current step for a listing
   */
  const getCurrentStep = (listingId: number) => {
    return computed({
      get: () => currentStepStates.value[listingId] ?? 0,
      set: (value: number) => {
        currentStepStates.value[listingId] = value;
      }
    });
  };

  /**
   * Determine the correct initial step based on database completedSteps
   * Uses the last completed step from the database to determine where to start
   */
  const determineInitialStep = (listingId: number, completedSteps: number[], steps: StepConfig[]) => {
    if (!Array.isArray(steps) || steps.length === 0) return;

    // Find the last completed step from the database
    const lastCompletedStep = completedSteps.length > 0 
      ? Math.max(...completedSteps) 
      : 0;

    // If there are completed steps, go to the next step after the last completed one
    // completedSteps contains step numbers 1-10, which corresponds to array indices 0-9
    // So if lastCompletedStep is 3, we want to go to index 3 (the 4th step)
    let targetStep = 0;
    if (lastCompletedStep > 0) {
      targetStep = lastCompletedStep;
      
      // Don't go past the last step
      if (targetStep >= steps.length) {
        targetStep = steps.length - 1;
      }
    }
    
    currentStepStates.value[listingId] = targetStep;
  };

  /**
   * Navigate to next step
   */
  const nextStep = (listingId: number, maxSteps: number) => {
    const currentStep = getCurrentStep(listingId);
    if (currentStep.value < maxSteps - 1) {
      currentStep.value++;
    }
  };

  /**
   * Navigate to previous step
   */
  const previousStep = (listingId: number) => {
    const currentStep = getCurrentStep(listingId);
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  /**
   * Go to a specific step
   */
  const goToStep = (listingId: number, stepIndex: number, maxSteps: number) => {
    if (stepIndex >= 0 && stepIndex < maxSteps) {
      const currentStep = getCurrentStep(listingId);
      currentStep.value = stepIndex;
    }
  };

  /**
   * Clean up state for a listing (memory cleanup only, no sessionStorage)
   */
  const cleanupListingStep = (listingId: number) => {
    delete currentStepStates.value[listingId];
  };

  /**
   * Get current step data/component
   */
  const getCurrentStepData = (listingId: number, steps: StepConfig[]) => {
    return computed(() => {
      const currentStepIndex = currentStepStates.value[listingId] ?? 0;
      return steps[currentStepIndex] || {};
    });
  };

  return {
    // State
    currentStepStates: readonly(currentStepStates),
    
    // Methods
    initializeListingStep,
    getCurrentStep,
    determineInitialStep,
    nextStep,
    previousStep,
    goToStep,
    cleanupListingStep,
    getCurrentStepData,
  };
});
