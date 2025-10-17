import { describe, it, expect } from "vitest";
import { stepEightValidation } from "../../../../app/utils/draft/step-eight";
import type { DraftListingWithFullPayload } from "../../../../shared/types/draft";

describe("Step8 - Additional Features Validation", () => {
  describe("areAdditionalFeaturesValid", () => {
    it("should always return true (features are optional)", () => {
      const result = stepEightValidation.areAdditionalFeaturesValid();
      expect(result).toBe(true);
    });
  });

  describe("isStepEightValid", () => {
    it("should validate step (all features are optional)", () => {
      const data = {
        property: {
          additionalFeatures: null,
          accessibilityFeatures: null,
          parking: null,
          securityFeatures: null,
          storageFeatures: null,
          utility: null,
        },
      };

      const draft = {} as DraftListingWithFullPayload;

      const result = stepEightValidation.isStepEightValid(data, draft);
      expect(result).toBe(true);
    });
  });

  describe("hasExistingStepEightData", () => {
    it("should return true when draft has any feature relationship", () => {
      const mockDraft = {
        property: {
          additionalFeatures: {},
        },
      } as DraftListingWithFullPayload;

      const result = stepEightValidation.hasExistingStepEightData(mockDraft);
      expect(result).toBe(true);
    });

    it("should return false when no feature relationships exist", () => {
      const mockDraft = {
        property: {
          additionalFeatures: null,
          accessibilityFeatures: null,
          parking: null,
          securityFeatures: null,
          storageFeatures: null,
          utility: null,
        },
      } as DraftListingWithFullPayload;

      const result = stepEightValidation.hasExistingStepEightData(mockDraft);
      expect(result).toBe(false);
    });
  });
});
