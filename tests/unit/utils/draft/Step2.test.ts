import { describe, it, expect, vi } from "vitest";
import type { DraftListingWithFullPayload, StepTwo } from "../../../../shared/types/draft";

// Mock $fetch at the global level before the module loads
vi.stubGlobal("$fetch", vi.fn().mockResolvedValue([]));

const { stepTwoValidation } = await import("../../../../app/utils/draft/step-two");

describe("Step2 - Property Basics Validation", () => {
  describe("isStepTwoValid", () => {
    it("should validate complete property data", () => {
      const data: StepTwo = {
        property: {
          type: "DETACHED" as any,
          classification: "HOUSE" as any,
          description: "A lovely detached house",
          totalFloors: 2,
          constructionType: null,
          size: null,
          yearBuilt: null,
        },
      };

      const result = stepTwoValidation.isStepTwoValid(data);
      expect(result).toBe(true);
    });

    it("should invalidate property without type", () => {
      const data: StepTwo = {
        property: {
          type: null,
          classification: "HOUSE" as any,
          description: "A lovely house",
          totalFloors: 2,
          constructionType: null,
          size: null,
          yearBuilt: null,
        },
      };

      const result = stepTwoValidation.isStepTwoValid(data);
      expect(result).toBe(false);
    });

    it("should invalidate property without classification", () => {
      const data: StepTwo = {
        property: {
          type: "DETACHED" as any,
          classification: null,
          description: "A lovely detached house",
          totalFloors: 2,
          constructionType: null,
          size: null,
          yearBuilt: null,
        },
      };

      const result = stepTwoValidation.isStepTwoValid(data);
      expect(result).toBe(false);
    });

    it("should invalidate property without description", () => {
      const data: StepTwo = {
        property: {
          type: "DETACHED" as any,
          classification: "HOUSE" as any,
          description: null,
          totalFloors: 2,
          constructionType: null,
          size: null,
          yearBuilt: null,
        },
      };

      const result = stepTwoValidation.isStepTwoValid(data);
      expect(result).toBe(false);
    });

    it("should invalidate property without totalFloors", () => {
      const data: StepTwo = {
        property: {
          type: "DETACHED" as any,
          classification: "HOUSE" as any,
          description: "A lovely detached house",
          totalFloors: null,
          constructionType: null,
          size: null,
          yearBuilt: null,
        },
      };

      const result = stepTwoValidation.isStepTwoValid(data);
      expect(result).toBe(false);
    });

    it("should validate with optional fields (constructionType, size, yearBuilt)", () => {
      const data: StepTwo = {
        property: {
          type: "FLAT" as any,
          classification: "APARTMENT" as any,
          description: "Modern apartment",
          totalFloors: 1,
          constructionType: "STANDARD",
          size: 75.5,
          yearBuilt: "2020",
        },
      };

      const result = stepTwoValidation.isStepTwoValid(data);
      expect(result).toBe(true);
    });
  });

  describe("hasExistingStepTwoData", () => {
    it("should return true when draft has complete property data", () => {
      const mockDraft = {
        property: {
          type: "SEMI_DETACHED",
          classification: "HOUSE",
          description: "Nice semi-detached home",
          totalFloors: 2,
        },
      } as DraftListingWithFullPayload;

      const result = stepTwoValidation.hasExistingStepTwoData(mockDraft);
      expect(result).toBe(true);
    });

    it("should return false when property is missing type", () => {
      const mockDraft = {
        property: {
          type: null,
          classification: "HOUSE",
          description: "Nice home",
          totalFloors: 2,
        },
      } as DraftListingWithFullPayload;

      const result = stepTwoValidation.hasExistingStepTwoData(mockDraft);
      expect(result).toBe(false);
    });

    it("should return false when property is null", () => {
      const mockDraft = {
        property: null,
      } as DraftListingWithFullPayload;

      const result = stepTwoValidation.hasExistingStepTwoData(mockDraft);
      expect(result).toBe(false);
    });

    it("should return false when any required field is missing", () => {
      const mockDraft = {
        property: {
          type: "TERRACED",
          classification: "HOUSE",
          description: null, // Missing required field
          totalFloors: 3,
        },
      } as DraftListingWithFullPayload;

      const result = stepTwoValidation.hasExistingStepTwoData(mockDraft);
      expect(result).toBe(false);
    });
  });
});
