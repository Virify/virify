import { describe, it, expect, beforeEach } from "vitest";
import { useListingStep } from "../../app/composables/useListingStep";
import type { StepConfig } from "../../app/composables/useListingStep";

/**
 * Integration Tests for Step Navigation Flow
 *
 * These tests verify the complete navigation flow through the listing creation steps
 * by testing the actual useListingStep composable:
 * - Step initialization based on completed steps
 * - Navigation between steps (next, previous, goToStep)
 * - Current step state management
 * - Memory cleanup
 */

describe("Step Navigation Integration - useListingStep Composable", () => {
  const mockSteps: StepConfig[] = [
    { title: "Listing Type" },
    { title: "Property Basics" },
    { title: "Price" },
    { title: "Address" },
    { title: "Bedrooms & Bathrooms" },
    { title: "Reception Rooms" },
    { title: "Garden & Parking" },
    { title: "Additional Features" },
    { title: "Property Details" },
    { title: "Images" },
  ];

  const draftId = 1;

  beforeEach(() => {
    const { cleanupListingStep } = useListingStep();
    cleanupListingStep(draftId);
  });

  describe("Step Initialization", () => {
    it("should initialize at step 0 for new draft", () => {
      const { initializeListingStep, getCurrentStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      expect(currentStep.value).toBe(0);
    });

    it("should start at first step when no steps completed", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      determineInitialStep(draftId, [], mockSteps);
      const currentStep = getCurrentStep(draftId);

      expect(currentStep.value).toBe(0);
    });

    it("should start at next step after last completed step", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // Steps 1, 2, 3 completed (database step numbers)
      determineInitialStep(draftId, [1, 2, 3], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Should be at step 4 (index 3)
      expect(currentStep.value).toBe(3);
    });

    it("should not exceed last step when all completed", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // All 10 steps completed
      determineInitialStep(draftId, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Should be at last step (index 9)
      expect(currentStep.value).toBe(mockSteps.length - 1);
    });

    it("should handle non-sequential completed steps", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // Steps 1, 3, 5 completed (non-sequential)
      determineInitialStep(draftId, [1, 3, 5], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Should be at step after highest completed (step 6, index 5)
      expect(currentStep.value).toBe(5);
    });
  });

  describe("Forward Navigation", () => {
    it("should navigate to next step", () => {
      const { initializeListingStep, getCurrentStep, nextStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      expect(currentStep.value).toBe(0);

      nextStep(draftId, mockSteps.length);
      expect(currentStep.value).toBe(1);

      nextStep(draftId, mockSteps.length);
      expect(currentStep.value).toBe(2);
    });

    it("should not navigate past last step", () => {
      const { getCurrentStep, determineInitialStep, nextStep } = useListingStep();

      // Start at last step
      determineInitialStep(draftId, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mockSteps);
      const currentStep = getCurrentStep(draftId);

      const lastStepIndex = mockSteps.length - 1;
      expect(currentStep.value).toBe(lastStepIndex);

      // Try to go beyond
      nextStep(draftId, mockSteps.length);

      // Should stay at last step
      expect(currentStep.value).toBe(lastStepIndex);
    });

    it("should navigate through multiple steps", () => {
      const { initializeListingStep, getCurrentStep, nextStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      // Navigate forward 5 steps
      for (let i = 0; i < 5; i++) {
        nextStep(draftId, mockSteps.length);
      }

      expect(currentStep.value).toBe(5);
    });
  });

  describe("Backward Navigation", () => {
    it("should navigate to previous step", () => {
      const { getCurrentStep, determineInitialStep, previousStep } = useListingStep();

      // Start at step 3
      determineInitialStep(draftId, [1, 2, 3], mockSteps);
      const currentStep = getCurrentStep(draftId);

      expect(currentStep.value).toBe(3);

      previousStep(draftId);
      expect(currentStep.value).toBe(2);

      previousStep(draftId);
      expect(currentStep.value).toBe(1);
    });

    it("should not navigate before first step", () => {
      const { initializeListingStep, getCurrentStep, previousStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      expect(currentStep.value).toBe(0);

      previousStep(draftId);

      // Should stay at first step
      expect(currentStep.value).toBe(0);
    });

    it("should navigate back through multiple steps", () => {
      const { getCurrentStep, determineInitialStep, previousStep } = useListingStep();

      // Start at step 5
      determineInitialStep(draftId, [1, 2, 3, 4, 5], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Navigate back 3 steps
      for (let i = 0; i < 3; i++) {
        previousStep(draftId);
      }

      expect(currentStep.value).toBe(2);
    });
  });

  describe("Direct Navigation (goToStep)", () => {
    it("should jump to specific step", () => {
      const { initializeListingStep, getCurrentStep, goToStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      goToStep(draftId, 4, mockSteps.length);
      expect(currentStep.value).toBe(4);

      goToStep(draftId, 7, mockSteps.length);
      expect(currentStep.value).toBe(7);
    });

    it("should not jump to invalid step index (negative)", () => {
      const { initializeListingStep, getCurrentStep, goToStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      const initialStep = currentStep.value;

      goToStep(draftId, -1, mockSteps.length);

      // Should stay at current step
      expect(currentStep.value).toBe(initialStep);
    });

    it("should not jump to invalid step index (beyond max)", () => {
      const { initializeListingStep, getCurrentStep, goToStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      goToStep(draftId, mockSteps.length + 5, mockSteps.length);

      // Should stay at step 0
      expect(currentStep.value).toBe(0);
    });

    it("should allow jumping to any step within bounds", () => {
      const { initializeListingStep, getCurrentStep, goToStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      goToStep(draftId, 9, mockSteps.length);
      expect(currentStep.value).toBe(9);

      goToStep(draftId, 0, mockSteps.length);
      expect(currentStep.value).toBe(0);

      goToStep(draftId, 5, mockSteps.length);
      expect(currentStep.value).toBe(5);
    });
  });

  describe("Multi-Draft State Management", () => {
    it("should maintain separate state for different drafts", () => {
      const { initializeListingStep, getCurrentStep, nextStep } = useListingStep();

      const draft1 = 1;
      const draft2 = 2;

      initializeListingStep(draft1);
      initializeListingStep(draft2);

      const step1 = getCurrentStep(draft1);
      const step2 = getCurrentStep(draft2);

      // Navigate draft1 forward
      nextStep(draft1, mockSteps.length);
      nextStep(draft1, mockSteps.length);

      // draft1 should be at step 2
      expect(step1.value).toBe(2);

      // draft2 should still be at step 0
      expect(step2.value).toBe(0);
    });

    it("should cleanup draft state", () => {
      const { initializeListingStep, getCurrentStep, cleanupListingStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      expect(currentStep.value).toBe(0);

      cleanupListingStep(draftId);

      // After cleanup, should reinitialize to 0
      const newStep = getCurrentStep(draftId);
      expect(newStep.value).toBe(0);
    });
  });

  describe("getCurrentStepData", () => {
    it("should return current step configuration", () => {
      const { initializeListingStep, getCurrentStep, getCurrentStepData } = useListingStep();

      initializeListingStep(draftId);
      const currentStepData = getCurrentStepData(draftId, mockSteps);

      expect(currentStepData.value.title).toBe("Listing Type");
    });

    it("should return correct step data after navigation", () => {
      const { initializeListingStep, getCurrentStepData, nextStep } = useListingStep();

      initializeListingStep(draftId);

      nextStep(draftId, mockSteps.length);
      nextStep(draftId, mockSteps.length);

      const currentStepData = getCurrentStepData(draftId, mockSteps);

      expect(currentStepData.value.title).toBe("Price");
    });

    it("should handle empty step array", () => {
      const { initializeListingStep, getCurrentStepData } = useListingStep();

      initializeListingStep(draftId);
      const currentStepData = getCurrentStepData(draftId, []);

      expect(currentStepData.value).toEqual({});
    });
  });

  describe("Completed Steps Integration", () => {
    it("should initialize to correct step based on completed steps", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // User has completed steps 1, 2, 3
      determineInitialStep(draftId, [1, 2, 3], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Should start at step 4 (index 3)
      expect(currentStep.value).toBe(3);
    });

    it("should allow navigation within completed steps range", () => {
      const { getCurrentStep, determineInitialStep, goToStep } = useListingStep();

      // User has completed steps 1, 2, 3
      determineInitialStep(draftId, [1, 2, 3], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Should be at step 4 initially
      expect(currentStep.value).toBe(3);

      // Should allow going back to completed steps
      goToStep(draftId, 0, mockSteps.length);
      expect(currentStep.value).toBe(0);

      goToStep(draftId, 2, mockSteps.length);
      expect(currentStep.value).toBe(2);

      // Should allow going to current incomplete step
      goToStep(draftId, 3, mockSteps.length);
      expect(currentStep.value).toBe(3);
    });

    it("should allow forward navigation using nextStep (composable doesn't enforce restrictions)", () => {
      const { getCurrentStep, initializeListingStep, nextStep } = useListingStep();

      // Start at step 1 with no completed steps
      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      expect(currentStep.value).toBe(0);

      // Note: The composable itself doesn't enforce step completion restrictions
      // That logic is in the UI component (OrganismsAccountListingStepper)
      // The composable is a low-level state manager that allows any valid navigation
      nextStep(draftId, mockSteps.length);
      expect(currentStep.value).toBe(1);

      nextStep(draftId, mockSteps.length);
      expect(currentStep.value).toBe(2);
    });

    it("should allow jumping to any step via goToStep (composable is unrestricted)", () => {
      const { getCurrentStep, initializeListingStep, goToStep } = useListingStep();

      initializeListingStep(draftId);
      const currentStep = getCurrentStep(draftId);

      // Note: goToStep in the composable doesn't check if steps are complete
      // It's a low-level navigation function. Restrictions are enforced in the UI layer.
      goToStep(draftId, 5, mockSteps.length);
      expect(currentStep.value).toBe(5);

      goToStep(draftId, 9, mockSteps.length);
      expect(currentStep.value).toBe(9);
    });

    it("should handle edge case of all steps completed", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // All 10 steps completed
      determineInitialStep(draftId, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Should be at last step
      expect(currentStep.value).toBe(mockSteps.length - 1);
    });

    it("should handle partial completion and allow resuming", () => {
      const { getCurrentStep, determineInitialStep, nextStep } = useListingStep();

      // User completed first 5 steps
      determineInitialStep(draftId, [1, 2, 3, 4, 5], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // Should start at step 6 (index 5)
      expect(currentStep.value).toBe(5);

      // User can continue from there
      nextStep(draftId, mockSteps.length);
      expect(currentStep.value).toBe(6);
    });

    it("should respect bounds even with completed steps", () => {
      const { getCurrentStep, determineInitialStep, nextStep } = useListingStep();

      // All steps completed
      determineInitialStep(draftId, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mockSteps);
      const currentStep = getCurrentStep(draftId);

      // At last step
      expect(currentStep.value).toBe(mockSteps.length - 1);

      // Cannot go beyond
      nextStep(draftId, mockSteps.length);
      expect(currentStep.value).toBe(mockSteps.length - 1);
    });
  });
});
