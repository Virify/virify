import { describe, it, expect } from "vitest";
import { stepSevenValidation } from "../../../../app/utils/listing/step-seven";

describe("Step7 - Garden & Parking Validation", () => {
  describe("areGardensValid", () => {
    it("should validate empty gardens (optional)", () => {
      const result = stepSevenValidation.areGardensValid([]);
      expect(result).toBe(true);
    });

    it("should validate gardens with names", () => {
      const result = stepSevenValidation.areGardensValid([{ name: "Back Garden" }]);
      expect(result).toBe(true);
    });

    it("should invalidate gardens without names", () => {
      const result = stepSevenValidation.areGardensValid([{ name: null }]);
      expect(result).toBe(false);
    });
  });

  describe("areYardsValid", () => {
    it("should validate empty yards (optional)", () => {
      const result = stepSevenValidation.areYardsValid([]);
      expect(result).toBe(true);
    });

    it("should validate yards with names", () => {
      const result = stepSevenValidation.areYardsValid([{ name: "Front Yard" }]);
      expect(result).toBe(true);
    });
  });

  describe("areLandsValid", () => {
    it("should validate empty land (optional)", () => {
      const result = stepSevenValidation.areLandsValid([]);
      expect(result).toBe(true);
    });

    it("should validate land with names", () => {
      const result = stepSevenValidation.areLandsValid([{ name: "Field" }]);
      expect(result).toBe(true);
    });
  });

  describe("isStepSevenValid", () => {
    it("should validate when gardens exist with valid data", () => {
      const data: any = {
        property: {
          outdoorSpace: {
            hasGarden: true,
            hasYard: false,
            hasLand: false,
            garden: [{ name: "Garden" } as any],
            yard: [],
            land: [],
          },
          parking: null,
        },
      };

      const result = stepSevenValidation.isStepSevenValid(data);
      expect(result).toBe(true);
    });

    it("should invalidate when gardens exist but are missing required fields", () => {
      const data: any = {
        property: {
          outdoorSpace: {
            hasGarden: true,
            hasYard: false,
            hasLand: false,
            garden: [{ name: null } as any],
            yard: [],
            land: [],
          },
          parking: null,
        },
      };

      const result = stepSevenValidation.isStepSevenValid(data);
      expect(result).toBe(false);
    });

    it("should validate when yards exist with valid data", () => {
      const data: any = {
        property: {
          outdoorSpace: {
            hasGarden: false,
            hasYard: true,
            hasLand: false,
            garden: [],
            yard: [{ name: "Yard" } as any],
            land: [],
          },
          parking: null,
        },
      };

      const result = stepSevenValidation.isStepSevenValid(data);
      expect(result).toBe(true);
    });

    it("should validate when no outdoor spaces exist", () => {
      const data: any = {
        property: {
          outdoorSpace: {
            hasGarden: false,
            hasYard: false,
            hasLand: false,
            garden: [],
            yard: [],
            land: [],
          },
          parking: null,
        },
      };

      const result = stepSevenValidation.isStepSevenValid(data);
      expect(result).toBe(true);
    });
  });
});
