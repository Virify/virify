import { createSharedComposable } from "@vueuse/core";

export interface StepConfig {
  title: string;
  complete?: boolean;
  data?: any;
  update?: Function;
  component?: any;
}

export const useDraftStep = createSharedComposable(() => {
  const currentStepStates = ref<Record<number, number>>({});
  
  // Clean up old draft states to prevent memory leaks
  const MAX_CACHED_DRAFTS = 10;
  const cleanupOldDrafts = () => {
    const draftIds = Object.keys(currentStepStates.value).map(Number);
    if (draftIds.length > MAX_CACHED_DRAFTS) {
      // Keep only the most recently accessed drafts
      const toRemove = draftIds.slice(0, draftIds.length - MAX_CACHED_DRAFTS);
      toRemove.forEach(draftId => {
        delete currentStepStates.value[draftId];
      });
    }
  };

  /**
   * Initialize step state for a draft
   */
  const initializeDraftStep = (draftId: number) => {
    if (!currentStepStates.value[draftId]) {
      currentStepStates.value[draftId] = 0;
      cleanupOldDrafts(); // Clean up memory periodically
    }
    return currentStepStates.value[draftId];
  };

  /**
   * Get current step for a draft
   */
  const getCurrentStep = (draftId: number) => {
    return computed({
      get: () => currentStepStates.value[draftId] ?? 0,
      set: (value: number) => {
        currentStepStates.value[draftId] = value;
      }
    });
  };

  /**
   * Determine the correct initial step based on database completedSteps
   * Uses the last completed step from the database to determine where to start
   */
  const determineInitialStep = (draftId: number, completedSteps: number[], steps: StepConfig[]) => {
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
    
    currentStepStates.value[draftId] = targetStep;
  };

  /**
   * Navigate to next step
   */
  const nextStep = (draftId: number, maxSteps: number) => {
    const currentStep = getCurrentStep(draftId);
    if (currentStep.value < maxSteps - 1) {
      currentStep.value++;
    }
  };

  /**
   * Navigate to previous step
   */
  const previousStep = (draftId: number) => {
    const currentStep = getCurrentStep(draftId);
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  /**
   * Go to a specific step
   */
  const goToStep = (draftId: number, stepIndex: number, maxSteps: number) => {
    if (stepIndex >= 0 && stepIndex < maxSteps) {
      const currentStep = getCurrentStep(draftId);
      currentStep.value = stepIndex;
    }
  };

  /**
   * Clean up state for a draft (memory cleanup only, no sessionStorage)
   */
  const cleanupDraftStep = (draftId: number) => {
    delete currentStepStates.value[draftId];
  };

  /**
   * Get current step data/component
   */
  const getCurrentStepData = (draftId: number, steps: StepConfig[]) => {
    return computed(() => {
      const currentStepIndex = currentStepStates.value[draftId] ?? 0;
      return steps[currentStepIndex] || {};
    });
  };

  return {
    // State
    currentStepStates: readonly(currentStepStates),
    
    // Methods
    initializeDraftStep,
    getCurrentStep,
    determineInitialStep,
    nextStep,
    previousStep,
    goToStep,
    cleanupDraftStep,
    getCurrentStepData,
  };
});
