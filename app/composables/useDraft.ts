import { createSharedComposable } from "@vueuse/core";
import CreateListingStepsStep1 from '~/components/create-listing-steps/Step1.vue';
import CreateListingStepsStep2 from '~/components/create-listing-steps/Step2.vue';

export interface DraftStepConfig {
  title: string;
  data?: any;
  complete: boolean;
  update?: Function;
  component?: any;
}

export const useDraft = createSharedComposable(() => {
  const { draftListing, updateDraftStepOne, updateDraftStepTwo } = useDraftListing();

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
        data: {
          saleListing: draft.value?.saleListing || null,
          rentalListing: draft.value?.rentalListing || null
        },
        complete: !!(draft.value?.saleListing || draft.value?.rentalListing),
        update: updateDraftStepOne,
        component: CreateListingStepsStep1
      },
      { 
        title: 'Property',
        data: {
          property: draft.value?.property || null,
        },
        complete: !!(
          draft.value?.property?.type && 
          draft.value?.property?.classification && 
          draft.value?.property?.description && 
          draft.value?.property?.totalFloors
        ),
        update: updateDraftStepTwo,
        component: CreateListingStepsStep2
      },
      { title: 'Address', complete: false },
      { title: 'Price', complete: false },
      { title: 'Description', complete: false },
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
        return true; // Success
      } catch (error) {
        console.error("Error updating step data:", error);
        return false; // Failure
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