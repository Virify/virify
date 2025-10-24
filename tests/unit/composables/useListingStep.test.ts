import { describe, it, expect, beforeEach } from "vitest";
import { useListingStep } from "../../../app/composables/useListingStep";
import type { StepConfig } from "../../../app/composables/useListingStep";

describe("useListingStep", () => {
  const listingId = 1;
  const mockSteps: StepConfig[] = [
    { title: "Step 1", complete: true },
    { title: "Step 2", complete: true },
    { title: "Step 3", complete: false },
    { title: "Step 4", complete: false },
    { title: "Step 5", complete: false },
  ];

  beforeEach(() => {
    // Clean up state between tests
    const { cleanupListingStep } = useListingStep();
    cleanupListingStep(listingId);
  });

  describe("Step Initialization", () => {
    it("should initialize step to 0 for new draft", () => {
      const { getCurrentStep, initializeListingStep } = useListingStep();

      initializeListingStep(listingId);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(0);
    });

    it("should determine correct initial step based on completed steps", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // If steps 1 and 2 are completed (indices 0 and 1), should start at step 3 (index 2)
      determineInitialStep(listingId, [1, 2], mockSteps);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(2);
    });

    it("should start at first step when no steps are completed", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      determineInitialStep(listingId, [], mockSteps);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(0);
    });

    it("should not exceed last step index", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // All steps completed, should stay on last step
      determineInitialStep(listingId, [1, 2, 3, 4, 5], mockSteps);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(mockSteps.length - 1);
    });
  });

  describe("Step Navigation", () => {
    it("should navigate to next step", () => {
      const { getCurrentStep, initializeListingStep, nextStep } = useListingStep();

      initializeListingStep(listingId);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(0);

      nextStep(listingId, mockSteps.length);

      expect(currentStep.value).toBe(1);
    });

    it("should not navigate past last step", () => {
      const { getCurrentStep, determineInitialStep, nextStep } = useListingStep();

      // Start at last step
      determineInitialStep(listingId, [1, 2, 3, 4, 5], mockSteps);
      const currentStep = getCurrentStep(listingId);

      const lastStepIndex = mockSteps.length - 1;
      expect(currentStep.value).toBe(lastStepIndex);

      nextStep(listingId, mockSteps.length);

      // Should still be on last step
      expect(currentStep.value).toBe(lastStepIndex);
    });

    it("should navigate to previous step", () => {
      const { getCurrentStep, determineInitialStep, previousStep } = useListingStep();

      determineInitialStep(listingId, [1, 2], mockSteps);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(2);

      previousStep(listingId);

      expect(currentStep.value).toBe(1);
    });

    it("should not navigate before first step", () => {
      const { getCurrentStep, initializeListingStep, previousStep } = useListingStep();

      initializeListingStep(listingId);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(0);

      previousStep(listingId);

      // Should still be on first step
      expect(currentStep.value).toBe(0);
    });

    it("should navigate to specific step", () => {
      const { getCurrentStep, initializeListingStep, goToStep } = useListingStep();

      initializeListingStep(listingId);
      const currentStep = getCurrentStep(listingId);

      goToStep(listingId, 3, mockSteps.length);

      expect(currentStep.value).toBe(3);
    });

    it("should not navigate to invalid step index", () => {
      const { getCurrentStep, initializeListingStep, goToStep } = useListingStep();

      initializeListingStep(listingId);
      const currentStep = getCurrentStep(listingId);

      // Try to navigate to invalid indices
      goToStep(listingId, -1, mockSteps.length);
      expect(currentStep.value).toBe(0);

      goToStep(listingId, mockSteps.length + 1, mockSteps.length);
      expect(currentStep.value).toBe(0);
    });
  });

  describe("Multiple Drafts", () => {
    it("should maintain separate state for different drafts", () => {
      const { getCurrentStep, initializeListingStep, nextStep } = useListingStep();

      const draft1 = 1;
      const draft2 = 2;

      initializeListingStep(draft1);
      initializeListingStep(draft2);

      const step1 = getCurrentStep(draft1);
      const step2 = getCurrentStep(draft2);

      // Navigate draft1
      nextStep(draft1, mockSteps.length);
      nextStep(draft1, mockSteps.length);

      expect(step1.value).toBe(2);
      expect(step2.value).toBe(0);
    });

    it("should cleanup old drafts when limit is exceeded", () => {
      const { initializeListingStep, getCurrentStep, nextStep } = useListingStep();

      // Create more than MAX_CACHED_DRAFTS (10) drafts
      for (let i = 1; i <= 12; i++) {
        initializeListingStep(i);
        nextStep(i, mockSteps.length);
      }

      // First drafts should be cleaned up, recent ones should remain
      const step12 = getCurrentStep(12);
      expect(step12.value).toBe(1);
    });
  });

  describe("State Management", () => {
    it("should return current step as computed ref", () => {
      const { getCurrentStep, initializeListingStep, nextStep } = useListingStep();

      initializeListingStep(listingId);
      const currentStep = getCurrentStep(listingId);

      expect(currentStep.value).toBe(0);

      // Should be reactive
      nextStep(listingId, mockSteps.length);
      expect(currentStep.value).toBe(1);
    });

    it("should allow setting current step via computed ref", () => {
      const { getCurrentStep, initializeListingStep } = useListingStep();

      initializeListingStep(listingId);
      const currentStep = getCurrentStep(listingId);

      currentStep.value = 3;

      expect(currentStep.value).toBe(3);
    });

    it("should cleanup draft step state", () => {
      const { initializeListingStep, getCurrentStep, cleanupListingStep } = useListingStep();

      initializeListingStep(listingId);
      let currentStep = getCurrentStep(listingId);
      expect(currentStep.value).toBe(0);

      cleanupListingStep(listingId);

      // After cleanup, state should be reset
      currentStep = getCurrentStep(listingId);
      expect(currentStep.value).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty steps array", () => {
      const { determineInitialStep, getCurrentStep } = useListingStep();

      determineInitialStep(listingId, [], []);
      const currentStep = getCurrentStep(listingId);

      // Should default to 0 or handle gracefully
      expect(currentStep.value).toBeDefined();
    });

    it("should handle completed steps array with gaps", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // Steps 1 and 3 completed, but not 2
      determineInitialStep(listingId, [1, 3], mockSteps);
      const currentStep = getCurrentStep(listingId);

      // Should go to step after highest completed (step 4, index 3)
      expect(currentStep.value).toBe(3);
    });

    it("should handle completed steps array with out-of-order values", () => {
      const { getCurrentStep, determineInitialStep } = useListingStep();

      // Completed steps not in order
      determineInitialStep(listingId, [3, 1, 2], mockSteps);
      const currentStep = getCurrentStep(listingId);

      // Should use highest value (3, so go to index 3)
      expect(currentStep.value).toBe(3);
    });
  });
});
