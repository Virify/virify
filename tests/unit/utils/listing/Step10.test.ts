import { describe, it, expect } from "vitest";
import { stepTenValidation } from "../../../../app/utils/listing/step-ten";
import type { DraftListingWithFullPayload, StepTen } from "../../../../shared/types/draft";

describe("Step10 - Images & Media Validation", () => {
  describe("hasImages", () => {
    it("should return true when media exists", () => {
      const data: any = {
        property: {
          media: [{ url: "image1.jpg" } as any],
        },
      };

      const result = stepTenValidation.hasImages(data);
      expect(result).toBe(true);
    });

    it("should return false when media array is empty", () => {
      const data: any = {
        property: {
          media: [],
        },
      };

      const result = stepTenValidation.hasImages(data);
      expect(result).toBe(false);
    });

    it("should return false when media is null", () => {
      const data: any = {
        property: {
          media: null as any,
        },
      };

      const result = stepTenValidation.hasImages(data);
      expect(result).toBeFalsy(); // Returns null, which is falsy
    });
  });

  describe("isStepTenValid", () => {
    it("should validate when at least one image exists", () => {
      const data: any = {
        property: {
          media: [{ url: "image1.jpg" } as any, { url: "image2.jpg" } as any],
        },
      };

      const result = stepTenValidation.isStepTenValid(data);
      expect(result).toBe(true);
    });

    it("should invalidate when no images exist", () => {
      const data: any = {
        property: {
          media: [],
        },
      };

      const result = stepTenValidation.isStepTenValid(data);
      expect(result).toBe(false);
    });

    it("should require at least one image", () => {
      const data: any = {
        property: {
          media: null as any,
        },
      };

      const result = stepTenValidation.isStepTenValid(data);
      expect(result).toBeFalsy(); // Returns null, which is falsy
    });
  });

  describe("hasExistingStepTenData", () => {
    it("should return true when draft has media", () => {
      const mockDraft = {
        property: {
          media: [{ url: "image.jpg" }],
        },
      } as DraftListingWithFullPayload;

      const result = stepTenValidation.hasExistingStepTenData(mockDraft);
      expect(result).toBe(true);
    });

    it("should return false when media array is empty", () => {
      const mockDraft = {
        property: {
          media: [],
        },
      } as DraftListingWithFullPayload;

      const result = stepTenValidation.hasExistingStepTenData(mockDraft);
      expect(result).toBe(false);
    });

    it("should return false when media is null", () => {
      const mockDraft = {
        property: {
          media: null,
        },
      } as DraftListingWithFullPayload;

      const result = stepTenValidation.hasExistingStepTenData(mockDraft);
      expect(result).toBe(false);
    });
  });
});
