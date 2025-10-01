import { createSharedComposable } from "@vueuse/core";
import { 
  CreateListingStepsStep1, 
  CreateListingStepsStep2, 
  CreateListingStepsStep3, 
  CreateListingStepsStep4, 
  CreateListingStepsStep5, 
  CreateListingStepsStep6,
  CreateListingStepsStep7
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
    updateDraftStepSeven
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
        complete: draft.value ? stepOneValidation.hasExistingStepOneData(draft.value) : false,
        update: updateDraftStepOne,
        component: CreateListingStepsStep1
      },
      { 
        title: 'Property',
        data: draft.value ? createInitialStepTwoValues(draft.value) : null,
        complete: draft.value ? stepTwoValidation.hasExistingStepTwoData(draft.value) : false,
        update: updateDraftStepTwo,
        component: CreateListingStepsStep2
      },
      { 
        title: 'Price', 
        data: draft.value ? createInitialStepThreeValues(draft.value) : null,
        complete: draft.value ? stepThreeValidation.hasExistingStepThreeData(draft.value) : false,
        update: updateDraftStepThree,
        component: CreateListingStepsStep3
      },
      { 
        title: 'Address',
        data: draft.value ? createInitialStepFourValues(draft.value) : null,
        complete: draft.value ? stepFourValidation.hasExistingStepFourData(draft.value) : false,
        update: updateDraftStepFour,
        component: CreateListingStepsStep4
      },
      { 
        title: 'Bedrooms & Bathrooms',
        data: draft.value ? createInitialStepFiveValues(draft.value) : null,
        complete: draft.value ? stepFiveValidation.hasExistingStepFiveData(draft.value) : false,
        update: updateDraftStepFive,
        component: CreateListingStepsStep5
      },
      { 
        title: 'Kitchen & Other Rooms',
        data: draft.value ? createInitialStepSixValues(draft.value) : null,
        complete: draft.value ? stepSixValidation.hasExistingStepSixData(draft.value) : false,
        update: updateDraftStepSix,
        component: CreateListingStepsStep6
      },
      { 
        title: 'Outdoor Spaces',
        data: draft.value ? createInitialStepSevenValues(draft.value) : null,
        complete: draft.value ? stepSevenValidation.hasExistingStepSevenData(draft.value) : false,
        update: updateDraftStepSeven,
        component: CreateListingStepsStep7
      },
      { 
        title: 'Additional Features', 
        complete: false 
      },
      { title: 'Energy', complete: false },
      { title: 'Media', complete: false }
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

  return {
    getDraft,
    getStepperMap,
    getStepperProps,
    getCurrentStepData,
    handleStepUpdate,
  };
});