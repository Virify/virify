import { createSharedComposable } from "@vueuse/core";
import { 
  EditListingStepsStep1, 
  EditListingStepsStep2, 
  EditListingStepsStep3, 
  EditListingStepsStep4, 
  EditListingStepsStep5, 
  EditListingStepsStep6,
  EditListingStepsStep7,
  EditListingStepsStep8,
  EditListingStepsStep9,
  EditListingStepsStep10
} from "#components";

export interface DraftStepConfig {
  title: string;
  data?: any;
  complete: boolean;
  update?: Function;
  component?: any;
}

export const useListingEditor = createSharedComposable(() => {
  const { 
    draftListing,
    updateStepOne, 
    updateStepTwo, 
    updateStepThree, 
    updateStepFour, 
    updateStepFive,
    updateStepSix,
    updateStepSeven,
    updateStepEight,
    updateStepNine,
    updateStepTen
  } = useListingEdit();

  /**
   * Get draft by ID
   */
  const getDraft = (draftId: number) => {
    return computed(() => draftListing(draftId));
  };

  /**
   * Get stepper configuration for a listing (draft or live)
   * @param listingId - The ID of the listing
   * @param listingRef - Optional ref containing the listing data (for live listings)
   */
  const getStepperMap = (listingId: number, listingRef?: Ref<EditableListing | null>) => {
    // Use provided listing ref or fall back to draft lookup
    const listing = listingRef || getDraft(listingId);
    
    return computed((): DraftStepConfig[] => [
      { 
        title: 'Listing Type',
        data: listing.value ? {
          saleListing: createInitialSaleValues(listing.value),
          rentalListing: createInitialRentalValues(listing.value)
        } as StepOne : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(1) || false : true) : false,
        update: updateStepOne,
        component: EditListingStepsStep1
      },
      { 
        title: 'Property',
        data: listing.value ? createInitialStepTwoValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(2) || false : true) : false,
        update: updateStepTwo,
        component: EditListingStepsStep2
      },
      { 
        title: 'Price', 
        data: listing.value ? createInitialStepThreeValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(3) || false : true) : false,
        update: updateStepThree,
        component: EditListingStepsStep3
      },
      { 
        title: 'Address',
        data: listing.value ? createInitialStepFourValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(4) || false : true) : false,
        update: updateStepFour,
        component: EditListingStepsStep4
      },
      { 
        title: 'Bedrooms & Bathrooms',
        data: listing.value ? createInitialStepFiveValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(5) || false : true) : false,
        update: updateStepFive,
        component: EditListingStepsStep5
      },
      { 
        title: 'Kitchen & Other Rooms',
        data: listing.value ? createInitialStepSixValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(6) || false : true) : false,
        update: updateStepSix,
        component: EditListingStepsStep6
      },
      { 
        title: 'Outdoor Spaces',
        data: listing.value ? createInitialStepSevenValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(7) || false : true) : false,
        update: updateStepSeven,
        component: EditListingStepsStep7
      },
      { 
        title: 'Additional Features', 
        data: listing.value ? createInitialStepEightValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(8) || false : true) : false,
        update: updateStepEight,
        component: EditListingStepsStep8
      },
      { 
        title: 'Energy & Costs',
        data: listing.value ? createInitialStepNineValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(9) || false : true) : false,
        update: updateStepNine,
        component: EditListingStepsStep9
      },
      { 
        title: 'Media', 
        data: listing.value ? createInitialStepTenValues(listing.value) : null,
        complete: listing.value ? (isDraftListing(listing.value) ? listing.value.completedSteps?.includes(10) || false : true) : false,
        update: updateStepTen,
        component: EditListingStepsStep10
      },
    ]);
  };

  /**
   * Get stepper props for UI component
   */
  const getStepperProps = (listingId: number, listingRef?: Ref<EditableListing | null>) => {
    const stepperMap = getStepperMap(listingId, listingRef);
    
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
  const getCurrentStepData = (listingId: number, currentStep: ComputedRef<number>, listingRef?: Ref<EditableListing | null>) => {
    const stepperMap = getStepperMap(listingId, listingRef);
    
    return computed(() => {
      const stepIndex = currentStep.value;
      return stepperMap.value[stepIndex] || {};
    });
  };

  /**
   * Handle step update with proper error handling and detailed error messages
   * @param listingId - ID of the listing being edited
   * @param stepperMap - The stepper configuration
   * @param stepData - Data for the step
   * @param stepNumber - Step number (1-10)
   * @param listingRef - Optional ref to listing data (for live listings)
   */
  const handleStepUpdate = async (
    listingId: number, 
    stepperMap: ComputedRef<DraftStepConfig[]>,
    stepData: any, 
    stepNumber: number,
    listingRef?: Ref<EditableListing | null>
  ): Promise<{ success: boolean; errorMessage?: string }> => {
    // Use provided listing ref or fall back to draft lookup
    const listing = listingRef || getDraft(listingId);
    const stepTitle = stepperMap.value[stepNumber - 1]?.title || `step ${stepNumber}`;
    
    if (!listing.value) {
      return { success: false, errorMessage: `Failed to update ${stepTitle}. Listing not found.` };
    }

    const stepToUpdate = computed(() => stepperMap.value[stepNumber - 1]?.update).value;

    if (stepToUpdate) {
      try {
        // Pass the listing object instead of just the ID
        await stepToUpdate(listing.value, stepData);
        console.log(`Successfully updated ${stepTitle} for listing ID ${listingId}`);
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