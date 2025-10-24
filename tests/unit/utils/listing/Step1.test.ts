import { describe, it, expect } from "vitest";
import { stepOneValidation } from "../../../../app/utils/listing/step-one";
import type { DraftListingWithFullPayload } from "../../../../shared/types/draft";

describe("Step1 - Listing Type Validation", () => {
  describe("Sale Listing Validation", () => {
    it("should validate complete sale listing with tenure type", () => {
      const saleData = {
        tenureType: "FREEHOLD",
        chain: true,
      };

      const result = stepOneValidation.isSaleComplete(saleData);
      expect(result).toBe(true);
    });

    it("should invalidate sale listing without tenure type", () => {
      const saleData = {
        tenureType: null,
        chain: true,
      };

      const result = stepOneValidation.isSaleComplete(saleData);
      expect(result).toBe(false);
    });

    it("should allow sale listing without chain (optional field)", () => {
      const saleData = {
        tenureType: "LEASEHOLD",
        chain: null,
      };

      const result = stepOneValidation.isSaleComplete(saleData);
      expect(result).toBe(true);
    });

    it("should validate all tenure types: FREEHOLD, LEASEHOLD, COMMONHOLD", () => {
      const tenureTypes = ["FREEHOLD", "LEASEHOLD", "COMMONHOLD"] as const;

      tenureTypes.forEach((tenureType) => {
        const saleData = {
          tenureType,
          chain: null,
        };
        expect(stepOneValidation.isSaleComplete(saleData)).toBe(true);
      });
    });
  });

  describe("Rental Listing Validation", () => {
    it("should validate complete rental listing", () => {
      const rentalData = {
        furnishedStatus: "UNFURNISHED",
        isBillsIncluded: true,
      };

      const result = stepOneValidation.isRentalComplete(rentalData);
      expect(result).toBe(true);
    });

    it("should invalidate rental listing without furnished status", () => {
      const rentalData = {
        furnishedStatus: null,
        isBillsIncluded: true,
      };

      const result = stepOneValidation.isRentalComplete(rentalData);
      expect(result).toBe(false);
    });

    it("should invalidate rental listing without bills included value", () => {
      const rentalData = {
        furnishedStatus: "UNFURNISHED",
        isBillsIncluded: null,
      };

      const result = stepOneValidation.isRentalComplete(rentalData);
      expect(result).toBe(false);
    });

    it("should accept bills included as false", () => {
      const rentalData = {
        furnishedStatus: "PART_FURNISHED",
        isBillsIncluded: false,
      };

      const result = stepOneValidation.isRentalComplete(rentalData);
      expect(result).toBe(true);
    });
  });

  describe("isStepOneValid - Combined Validation", () => {
    it('should validate sale listing when selectedType is "sale"', () => {
      const data = {
        selectedType: "sale",
        saleListing: {
          tenureType: "FREEHOLD",
          chain: null,
        },
        rentalListing: {
          furnishedStatus: null,
          isBillsIncluded: null,
        },
      };

      const result = stepOneValidation.isStepOneValid(data);
      expect(result).toBe(true);
    });

    it('should validate rental listing when selectedType is "rent"', () => {
      const data = {
        selectedType: "rent",
        saleListing: {
          tenureType: null,
          chain: null,
        },
        rentalListing: {
          furnishedStatus: "UNFURNISHED",
          isBillsIncluded: false,
        },
      };

      const result = stepOneValidation.isStepOneValid(data);
      expect(result).toBe(true);
    });

    it("should return false when no type is selected", () => {
      const data = {
        selectedType: null,
        saleListing: {
          tenureType: "FREEHOLD",
          chain: null,
        },
        rentalListing: {
          furnishedStatus: "UNFURNISHED",
          isBillsIncluded: true,
        },
      };

      const result = stepOneValidation.isStepOneValid(data);
      expect(result).toBe(false);
    });

    it("should return false when sale selected but incomplete", () => {
      const data = {
        selectedType: "sale",
        saleListing: {
          tenureType: null, // Missing required field
          chain: true,
        },
        rentalListing: {
          furnishedStatus: null,
          isBillsIncluded: null,
        },
      };

      const result = stepOneValidation.isStepOneValid(data);
      expect(result).toBe(false);
    });

    it("should return false when rent selected but incomplete", () => {
      const data = {
        selectedType: "rent",
        saleListing: {
          tenureType: null,
          chain: null,
        },
        rentalListing: {
          furnishedStatus: null, // Missing required field
          isBillsIncluded: true,
        },
      };

      const result = stepOneValidation.isStepOneValid(data);
      expect(result).toBe(false);
    });
  });

  describe("hasExistingStepOneData", () => {
    it("should return true when draft has complete sale listing", () => {
      const mockDraft = {
        saleListing: {
          tenureType: "FREEHOLD",
          chain: false,
        },
        rentalListing: null,
      } as DraftListingWithFullPayload;

      const result = stepOneValidation.hasExistingStepOneData(mockDraft);
      expect(result).toBe(true);
    });

    it("should return true when draft has complete rental listing", () => {
      const mockDraft = {
        saleListing: null,
        rentalListing: {
          furnishedStatus: "PART_FURNISHED",
          isBillsIncluded: true,
        },
      } as DraftListingWithFullPayload;

      const result = stepOneValidation.hasExistingStepOneData(mockDraft);
      expect(result).toBe(true);
    });

    it("should return false when draft has incomplete sale listing", () => {
      const mockDraft = {
        saleListing: {
          tenureType: null,
          chain: true,
        },
        rentalListing: null,
      } as DraftListingWithFullPayload;

      const result = stepOneValidation.hasExistingStepOneData(mockDraft);
      expect(result).toBe(false);
    });

    it("should return false when draft has no listing data", () => {
      const mockDraft = {
        saleListing: null,
        rentalListing: null,
      } as DraftListingWithFullPayload;

      const result = stepOneValidation.hasExistingStepOneData(mockDraft);
      expect(result).toBe(false);
    });
  });
});
