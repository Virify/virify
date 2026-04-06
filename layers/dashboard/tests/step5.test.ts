import { describe, it, expect } from "vitest";
import {
  isStep5Valid,
  hasStep5Data,
  createInitialStep5Values,
  getKitchenFeatureOptions,
  getReceptionTypeOptions,
  getReceptionFeatureOptions,
  getOtherRoomTypeOptions,
  getOtherRoomFeatureOptions,
} from "../app/utils/step5";

describe("Option arrays", () => {
  it("getKitchenFeatureOptions returns non-empty array", () => {
    expect(getKitchenFeatureOptions().length).toBeGreaterThan(0);
  });

  it("getReceptionTypeOptions returns non-empty array", () => {
    expect(getReceptionTypeOptions().length).toBeGreaterThan(0);
  });

  it("getReceptionFeatureOptions returns non-empty array", () => {
    expect(getReceptionFeatureOptions().length).toBeGreaterThan(0);
  });

  it("getOtherRoomTypeOptions returns non-empty array", () => {
    expect(getOtherRoomTypeOptions().length).toBeGreaterThan(0);
  });

  it("getOtherRoomFeatureOptions excludes CONSERVATORY", () => {
    const options = getOtherRoomFeatureOptions();
    expect(options.some((o) => o.value === "CONSERVATORY")).toBe(false);
  });
});

describe("createInitialStep5Values", () => {
  it("starts with empty arrays and zero counts", () => {
    const state = createInitialStep5Values();
    expect(state.property.kitchenFeatures).toEqual([]);
    expect(state.property.reception).toEqual([]);
    expect(state.property.otherRoom).toEqual([]);
    expect(state.property.numberKitchens).toBe(0);
    expect(state.property.numberReceptions).toBe(0);
    expect(state.property.numberOtherRooms).toBe(0);
  });
});

describe("isStep5Valid", () => {
  it("always returns true (step is optional)", () => {
    expect(isStep5Valid(createInitialStep5Values())).toBe(true);
  });
});

describe("hasStep5Data", () => {
  it("returns false for empty initial state", () => {
    expect(hasStep5Data(createInitialStep5Values())).toBe(false);
  });

  it("returns true when kitchenFeatures has entries", () => {
    const state = createInitialStep5Values();
    state.property.kitchenFeatures = ["ISLAND" as any];
    expect(hasStep5Data(state)).toBe(true);
  });

  it("returns true when reception has entries", () => {
    const state = createInitialStep5Values();
    state.property.reception = [{ type: "LIVING_ROOM" } as any];
    expect(hasStep5Data(state)).toBe(true);
  });

  it("returns true when otherRoom has entries", () => {
    const state = createInitialStep5Values();
    state.property.otherRoom = [{ type: "CONSERVATORY" } as any];
    expect(hasStep5Data(state)).toBe(true);
  });
});
