import { describe, it, expect } from "vitest";
import { stepNineValidation } from "../../../../app/utils/draft/step-nine";
import { DraftListingWithFullPayload } from "../../../../shared/types/draft";

describe("Step9 - Property Details Validation", () => {
  describe("areEnergyAndUtilitiesValid", () => {
    it("should validate with epcRating", () => {
      const data = {
        epcRating: "A",
      };

      const result = stepNineValidation.areEnergyAndUtilitiesValid(data);
      expect(result).toBe(true);
    });

    it("should invalidate without epcRating", () => {
      const data = {
        epcRating: null,
      };

      const result = stepNineValidation.areEnergyAndUtilitiesValid(data);
      expect(result).toBe(false);
    });

    it("should accept UNKNOWN as valid epcRating", () => {
      const data = {
        epcRating: "UNKNOWN",
      };

      const result = stepNineValidation.areEnergyAndUtilitiesValid(data);
      expect(result).toBe(true);
    });
  });

  describe("areRunningCostsValid", () => {
    it("should validate with councilTaxBand", () => {
      const data = {
        councilTaxBand: "D",
      };

      const result = stepNineValidation.areRunningCostsValid(data);
      expect(result).toBe(true);
    });

    it("should invalidate without councilTaxBand", () => {
      const data = {
        councilTaxBand: null,
      };

      const result = stepNineValidation.areRunningCostsValid(data);
      expect(result).toBe(false);
    });
  });

  describe("isStepNineValid", () => {
    it("should validate with both epcRating and councilTaxBand", () => {
      const data = {
        property: {
          energyAndUtilities: {
            epcRating: "B",
          },
          runningCosts: {
            councilTaxBand: "C",
          },
        },
      };

      const draft = {} as DraftListingWithFullPayload;

      const result = stepNineValidation.isStepNineValid(data, draft);
      expect(result).toBe(true);
    });

    it("should invalidate without energyAndUtilities", () => {
      const data = {
        property: {
          energyAndUtilities: null,
          runningCosts: {
            councilTaxBand: "C",
          },
        },
      };

      const draft = {} as DraftListingWithFullPayload;

      const result = stepNineValidation.isStepNineValid(data, draft);
      expect(result).toBe(false);
    });

    it("should invalidate without runningCosts", () => {
      const data = {
        property: {
          energyAndUtilities: {
            epcRating: "B",
          },
          runningCosts: null,
        },
      };

      const draft = {} as DraftListingWithFullPayload;

      const result = stepNineValidation.isStepNineValid(data, draft);
      expect(result).toBe(false);
    });
  });

  describe("hasExistingStepNineData", () => {
    it("should return true when both relationships exist", () => {
      const mockDraft = {
        property: {
          energyAndUtilities: { epcRating: "A" },
          runningCosts: { councilTaxBand: "B" },
        },
      } as DraftListingWithFullPayload;

      const result = stepNineValidation.hasExistingStepNineData(mockDraft);
      expect(result).toBe(true);
    });

    it("should return false when relationships are missing", () => {
      const mockDraft = {
        property: {
          energyAndUtilities: null,
          runningCosts: null,
        },
      } as DraftListingWithFullPayload;

      const result = stepNineValidation.hasExistingStepNineData(mockDraft);
      expect(result).toBe(false);
    });
  });
});
