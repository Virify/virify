import { createSharedComposable } from "@vueuse/core";
import CreateListingStepsStep1 from '~/components/CreateListingSteps/Step1.vue';
import CreateListingStepsStep2 from '~/components/CreateListingSteps/Step2.vue';
import CreateListingStepsStep3 from '~/components/CreateListingSteps/Step3.vue';
import CreateListingStepsStep4 from '~/components/CreateListingSteps/Step4.vue';
import CreateListingStepsStep5 from '~/components/CreateListingSteps/Step5.vue';

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
    updateDraftStepFive 
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
        title: 'Bedrooms',
        data: draft.value ? createInitialStepFiveValues(draft.value) : null,
        complete: draft.value ? stepFiveValidation.hasExistingStepFiveData(draft.value) : false,
        update: updateDraftStepFive,
        component: CreateListingStepsStep5
      },
      { title: 'Rooms', complete: false },
      { title: 'Additional', complete: false },
      { title: 'Energy', complete: false },
      { title: 'Outdoor', complete: false },
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
   * Handle step data update
   */
  const handleStepUpdate = async (
    draftId: number, 
    stepperMap: ComputedRef<DraftStepConfig[]>,
    stepData: any, 
    stepNumber: number
  ) => {
    const draft = getDraft(draftId);
    if (!draft.value?.id) return;

    const stepToUpdate = computed(() => stepperMap.value[stepNumber - 1]?.update).value;

    if (stepToUpdate) {
      try {
        await stepToUpdate(draft.value.id, stepData);
        return true;
      } catch (error) {
        console.error("Error updating step data:", error);
        return false;
      }
    }
    return false;
  };

  return {
    getDraft,
    getStepperMap,
    getStepperProps,
    getCurrentStepData,
    handleStepUpdate,
  };
});