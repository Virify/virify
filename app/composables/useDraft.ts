import { createSharedComposable } from "@vueuse/core";
import { 
  CreateListingStepsStep1, 
  CreateListingStepsStep2, 
  CreateListingStepsStep3, 
  CreateListingStepsStep4, 
  CreateListingStepsStep5, 
  CreateListingStepsStep6,
  CreateListingStepsStep7,
  CreateListingStepsStep8,
  CreateListingStepsStep9,
  CreateListingStepsStep10
} from "#components";

export interface DraftStepConfig {
  title: string;
  data?: any;
  complete: boolean;
  update?: Function;
  component?: any;
}

export const useDraft = createSharedComposable(() => {
  const { 
    draftListing, 
    updateDraftStepOne, 
    updateDraftStepTwo, 
    updateDraftStepThree, 
    updateDraftStepFour, 
    updateDraftStepFive,
    updateDraftStepSix,
    updateDraftStepSeven,
    updateDraftStepEight,
    updateDraftStepNine,
    updateDraftStepTen
  } = useDraftListing();

  /**
   * Get draft by ID
   */
  const getDraft = (draftId: number) => {
    return computed(() => draftListing(draftId));
  };

  /**
   * Get stepper configuration for a draft
   */
  const getStepperMap = (draftId: number) => {
    const draft = getDraft(draftId);
    
    return computed((): DraftStepConfig[] => [
      { 
        title: 'Listing Type',
        data: draft.value ? {
          saleListing: createInitialSaleValues(draft.value),
          rentalListing: createInitialRentalValues(draft.value)
        } as StepOne : null,
        complete: draft.value ? draft.value.completedSteps?.includes(1) || false : false,
        update: updateDraftStepOne,
        component: CreateListingStepsStep1
      },
      { 
        title: 'Property',
        data: draft.value ? createInitialStepTwoValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(2) || false : false,
        update: updateDraftStepTwo,
        component: CreateListingStepsStep2
      },
      { 
        title: 'Price', 
        data: draft.value ? createInitialStepThreeValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(3) || false : false,
        update: updateDraftStepThree,
        component: CreateListingStepsStep3
      },
      { 
        title: 'Address',
        data: draft.value ? createInitialStepFourValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(4) || false : false,
        update: updateDraftStepFour,
        component: CreateListingStepsStep4
      },
      { 
        title: 'Bedrooms & Bathrooms',
        data: draft.value ? createInitialStepFiveValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(5) || false : false,
        update: updateDraftStepFive,
        component: CreateListingStepsStep5
      },
      { 
        title: 'Kitchen & Other Rooms',
        data: draft.value ? createInitialStepSixValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(6) || false : false,
        update: updateDraftStepSix,
        component: CreateListingStepsStep6
      },
      { 
        title: 'Outdoor Spaces',
        data: draft.value ? createInitialStepSevenValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(7) || false : false,
        update: updateDraftStepSeven,
        component: CreateListingStepsStep7
      },
      { 
        title: 'Additional Features', 
        data: draft.value ? createInitialStepEightValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(8) || false : false,
        update: updateDraftStepEight,
        component: CreateListingStepsStep8
      },
      { 
        title: 'Energy & Costs',
        data: draft.value ? createInitialStepNineValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(9) || false : false,
        update: updateDraftStepNine,
        component: CreateListingStepsStep9
      },
      { 
        title: 'Media', 
        data: draft.value ? createInitialStepTenValues(draft.value) : null,
        complete: draft.value ? draft.value.completedSteps?.includes(10) || false : false,
        update: updateDraftStepTen,
        component: CreateListingStepsStep10
      },
    ]);
  };

  /**
   * Get stepper props for UI component
   */
  const getStepperProps = (draftId: number) => {
    const stepperMap = getStepperMap(draftId);
    
    return computed(() => 
      stepperMap.value.map(s => ({ 
        title: s.title, 
        complete: s.complete 
      }))
    );
  };

  /**
   * Get current step data
   */
  const getCurrentStepData = (draftId: number, currentStep: ComputedRef<number>) => {
    const stepperMap = getStepperMap(draftId);
    
    return computed(() => {
      const stepIndex = currentStep.value;
      return stepperMap.value[stepIndex] || {};
    });
  };

  /**
   * Handle step update with proper error handling and detailed error messages
   */
  const handleStepUpdate = async (
    draftId: number, 
    stepperMap: ComputedRef<DraftStepConfig[]>,
    stepData: any, 
    stepNumber: number
  ): Promise<{ success: boolean; errorMessage?: string }> => {
    const draft = getDraft(draftId);
    const stepTitle = stepperMap.value[stepNumber - 1]?.title || `step ${stepNumber}`;
    
    if (!draft.value?.id) {
      return { success: false, errorMessage: `Failed to update ${stepTitle}. Draft not found.` };
    }

    const stepToUpdate = computed(() => stepperMap.value[stepNumber - 1]?.update).value;

    if (stepToUpdate) {
      try {
        await stepToUpdate(draft.value.id, stepData);
        console.log(`Successfully updated ${stepTitle} for draft ID ${draftId}`);
        return { success: true };
      } catch (error: any) {
        console.error("Error updating step data:", error);
        // Backend should handle Prisma errors and return user-friendly messages
        const errorMessage = error?.data?.message || error?.message || `Failed to update ${stepTitle}. Please try again.`;
        return { success: false, errorMessage };
      }
    }
    return { success: false, errorMessage: `Failed to update ${stepTitle}. Step configuration not found.` };
  };

  /**
   * Get step progress for a draft (last completed step index)
   */
  const getStepProgress = (draftId: number) => {
    const stepperMap = getStepperMap(draftId);
    
    return computed(() => {
      let lastCompleted = -1;
      for (let i = 0; i < stepperMap.value.length; i++) {
        const step = stepperMap.value[i];
        if (step && step.complete) {
          lastCompleted = i;
        } else {
          break; // Stop at first incomplete step
        }
      }
      return lastCompleted;
    });
  };

  /**
   * Get step progress text for display
   */
  const getStepProgressText = (draftId: number) => {
    const progress = getStepProgress(draftId);
    const stepperMap = getStepperMap(draftId);
    
    return computed(() => {
      const lastCompletedIndex = progress.value;
      const totalSteps = stepperMap.value.length;
      
      if (lastCompletedIndex === -1) {
        return 'Not started';
      }
      
      const completedSteps = lastCompletedIndex + 1;
      return `Step ${completedSteps}/${totalSteps}`;
    });
  };

  return {
    getDraft,
    getStepperMap,
    getStepperProps,
    getCurrentStepData,
    handleStepUpdate,
    getStepProgress,
    getStepProgressText,
  };
});