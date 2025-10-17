import { type MaybeRef } from '@vueuse/core';
import type { DraftListing } from '~~/layers/database/server/database/prisma/generated/client';

/**
 * Configuration interface for step validation and submission
 */
export interface DraftStepFormConfig<T = any> {
  initialData: T;
  isValid: (data: T) => boolean;
  hasExistingData: (draft: DraftListingWithFullPayload) => boolean;
  beforeSubmit?: (data: T) => T;
  stepNumber?: number; // Step number for tracking completion
}

/**
 * Return type for the useDraftStepForm composable
 */
export interface DraftStepFormReturn<T> {
  formData: Ref<T>;
  formKey: Ref<number>;
  isFormValid: ComputedRef<boolean>;
  hasChanges: ComputedRef<boolean>;
  buttonDisabled: ComputedRef<boolean>;
  buttonText: ComputedRef<string>;
  resetForm: () => void;
  submitForm: (updateFn: (data: T) => void | Promise<void>, nextStepFn: () => void) => Promise<void>;
}

/**
 * Reusable composable for draft listing step forms
 * 
 * Handles common step functionality:
 * - Form state management
 * - Change detection
 * - Validation
 * - Form reset
 * - Submission logic with change detection
 * - Button state management
 * 
 * @param config Step configuration
 * @param draft Draft listing data
 * @returns Object with reactive step state and methods
 */
export function useDraftStepForm<T>(
  config: MaybeRef<DraftStepFormConfig<T>>,
  draft: DraftListingWithFullPayload
): DraftStepFormReturn<T> {
  const configRef = toRef(config);
  const draftRef = toRef(draft);
  const { showToast } = useToast();
  const { markStepAsCompleted } = useDraftListing();
  
  // Initialize form data with deep copy to avoid reference issues
  const formData = ref<T>(JSON.parse(JSON.stringify(configRef.value.initialData))) as Ref<T>;
  const initialFormData = ref<T>(JSON.parse(JSON.stringify(configRef.value.initialData)));
  const formKey = ref(0);

  // Computed properties
  const isFormValid = computed(() => configRef.value.isValid(formData.value));
  const hasChanges = computed(() => !objectsEqual(initialFormData.value, formData.value));
  const buttonDisabled = computed(() => !isFormValid.value);

  // Button text logic
  const buttonText = computed(() => {
    if (!isFormValid.value) return 'Save and Continue';
    
    const hasExistingData = configRef.value.hasExistingData(draftRef.value);
    if (hasExistingData && !hasChanges.value) return 'Next Step';
    
    return 'Save and Continue';
  });

  // Reset form to initial state
  const resetForm = () => {
    formData.value = JSON.parse(JSON.stringify(initialFormData.value));
    formKey.value += 1;
  };

  /**
   * Handle form submission with proper error handling
   * @param updateFn Function to call to update draft step data
   * @param nextStepFn Function to call to proceed to the next step
   * @returns Promise that resolves when submission is complete
   */
  const submitForm = async (
    updateFn: (data: T) => void | Promise<void>,
    nextStepFn?: () => void
  ) => {
    if (!isFormValid.value) return;

    // Check if step needs to be marked as completed (first time visiting)
    const needsCompletion = configRef.value.stepNumber !== undefined && 
                           !draftRef.value.completedSteps?.includes(configRef.value.stepNumber);

    // On first visit, we MUST save even if no changes (to persist default values)
    // On subsequent visits, only update if there are actual changes
    if (!hasChanges.value && !needsCompletion) {
      console.log('No changes detected and step already completed, going to next step');
      nextStepFn?.();
      return;
    }

    try {
      // Apply transformation if provided
      const dataToSubmit = configRef.value.beforeSubmit 
        ? configRef.value.beforeSubmit(formData.value)
        : formData.value;

      // Execute update function (always on first visit, or when there are changes)
      await updateFn(dataToSubmit);
      
      // Mark step as completed if this is the first time (after successful update)
      if (needsCompletion) {
        try {
          await useRequestFetch()<DraftListing>(`/api/draft-listings/${draftRef.value.id}/`, {
            method: 'PATCH',
            body: { stepNumber: configRef.value.stepNumber },
          });
          
          // Update local cached draft data to reflect the completed step
          markStepAsCompleted(draftRef.value.id, configRef.value.stepNumber!);
        } catch (error) {
          console.error('Failed to mark step as completed:', error);
          showToast('Failed to save progress. Please try again.', { type: 'error' });
          return; // Block navigation on error
        }
      }
      
      // Only call next step function if update was successful
      nextStepFn?.();
    } catch (error) {
      console.error('Step submission failed:', error);
    }
  };

  return {
    formData,
    formKey,
    isFormValid,
    hasChanges,
    buttonDisabled,
    buttonText,
    resetForm,
    submitForm
  };
}