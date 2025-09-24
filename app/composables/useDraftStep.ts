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
   * Get session storage key for a specific draft
   */
  const getSessionKey = (draftId: number) => `draft-${draftId}-current-step`;

  /**
   * Safely get item from session storage with fallback
   */
  const getFromStorage = (key: string): string | null => {
    if (!import.meta.client) return null;
    
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      // Storage might be disabled in incognito mode or full
      console.warn('Failed to access sessionStorage:', error);
      return null;
    }
  };

  /**
   * Safely set item in session storage with fallback
   */
  const setToStorage = (key: string, value: string): void => {
    if (!import.meta.client) return;
    
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      // Storage might be disabled in incognito mode or full
      console.warn('Failed to write to sessionStorage:', error);
    }
  };

  /**
   * Safely remove item from session storage
   */
  const removeFromStorage = (key: string): void => {
    if (!import.meta.client) return;
    
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
    }
  };

  /**
   * Get initial step for a draft
   */
  const getInitialStep = (draftId: number): number => {
    const savedStep = getFromStorage(getSessionKey(draftId));
    if (savedStep !== null) {
      return Math.max(0, Number(savedStep));
    }
    return 0;
  };

  /**
   * Initialize step state for a draft
   */
  const initializeDraftStep = (draftId: number) => {
    if (!currentStepStates.value[draftId]) {
      currentStepStates.value[draftId] = getInitialStep(draftId);
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
        setToStorage(getSessionKey(draftId), String(value));
      }
    });
  };

  /**
   * Determine the correct initial step based on completion status
   */
  const determineInitialStep = (draftId: number, steps: StepConfig[]) => {
    if (!Array.isArray(steps) || steps.length === 0) return;

    const sessionKey = getSessionKey(draftId);
    
    // Check if we have a saved step from session storage (refresh scenario)
    const savedStep = getFromStorage(sessionKey);
    if (savedStep !== null) {
      const stepNumber = Number(savedStep);
      // Validate the saved step is within bounds
      if (stepNumber >= 0 && stepNumber < steps.length) {
        currentStepStates.value[draftId] = stepNumber;
        return;
      }
      // Clear invalid saved step
      removeFromStorage(sessionKey);
    }

    // No valid saved step - we're entering edit mode, go to first incomplete step
    const firstIncompleteIndex = steps.findIndex(s => !s.complete);
    const targetStep = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
    
    currentStepStates.value[draftId] = targetStep;
    
    // Save this initial step to session storage
    setToStorage(sessionKey, String(targetStep));
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
   * Clean up session storage for a draft
   */
  const cleanupDraftStep = (draftId: number) => {
    removeFromStorage(getSessionKey(draftId));
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