import { describe, it, expect } from "vitest";
import { stepSixValidation } from "../../../../app/utils/draft/step-six";
import type { DraftListingWithFullPayload, StepSix } from "../../../../shared/types/draft";

describe("Step6 - Reception Rooms Validation", () => {
  describe("areReceptionRoomsValid", () => {
    it("should validate empty reception rooms (optional)", () => {
      const result = stepSixValidation.areReceptionRoomsValid([]);
      expect(result).toBe(true);
    });

    it("should validate reception rooms with data", () => {
      const result = stepSixValidation.areReceptionRoomsValid([{ name: "Living Room" }]);
      expect(result).toBe(true);
    });
  });

  describe("areKitchenFeaturesValid", () => {
    it("should validate empty kitchens (optional)", () => {
      const result = stepSixValidation.areKitchenFeaturesValid([]);
      expect(result).toBe(true);
    });
  });

  describe("areOtherRoomsValid", () => {
    it("should validate empty other rooms (optional)", () => {
      const result = stepSixValidation.areOtherRoomsValid([]);
      expect(result).toBe(true);
    });
  });

  describe("isStepSixValid", () => {
    it("should validate step with all empty room types (all optional)", () => {
      const data: any = {
        property: {
          totalFloors: 2,
          kitchenFeatures: [],
          numberKitchens: null,
          reception: [],
          numberReceptions: null,
          otherRoom: [],
          numberOtherRooms: null,
        },
      };

      const result = stepSixValidation.isStepSixValid(data);
      expect(result).toBe(true);
    });

    it("should validate step with populated room data", () => {
      const data: any = {
        property: {
          totalFloors: 2,
          kitchenFeatures: [{ name: "Kitchen" } as any],
          numberKitchens: 1,
          reception: [{ name: "Living Room" } as any],
          numberReceptions: 1,
          otherRoom: [{ name: "Study" } as any],
          numberOtherRooms: 1,
        },
      };

      const result = stepSixValidation.isStepSixValid(data);
      expect(result).toBe(true);
    });
  });

  describe("hasExistingStepSixData", () => {
    it("should return true when draft has any room data", () => {
      const mockDraft = {
        property: {
          reception: [{ name: "Living Room" }],
        },
      } as DraftListingWithFullPayload;

      const result = stepSixValidation.hasExistingStepSixData(mockDraft);
      expect(result).toBe(true);
    });

    it("should return false when all room arrays are empty", () => {
      const mockDraft = {
        property: {
          kitchenFeatures: [],
          reception: [],
          otherRoom: [],
        },
      } as DraftListingWithFullPayload;

      const result = stepSixValidation.hasExistingStepSixData(mockDraft);
      expect(result).toBe(false);
    });
  });
});
