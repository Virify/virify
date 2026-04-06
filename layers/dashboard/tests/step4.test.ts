import { describe, it, expect } from "vitest";
import {
  toggleRoomFeature,
  getBedSizeOptions,
  getBedroomFeatureOptions,
  getBathroomFeatureOptions,
} from "../app/utils/step4";

describe("toggleRoomFeature", () => {
  it("adds a feature when checked and features is undefined", () => {
    const result = toggleRoomFeature(undefined, "EN_SUITE", true);
    expect(result).toEqual(["EN_SUITE"]);
  });

  it("adds a feature when checked and list is empty", () => {
    const result = toggleRoomFeature([], "WALK_IN_WARDROBE", true);
    expect(result).toEqual(["WALK_IN_WARDROBE"]);
  });

  it("adds a feature to an existing list", () => {
    const result = toggleRoomFeature(["EN_SUITE"], "WALK_IN_WARDROBE", true);
    expect(result).toContain("EN_SUITE");
    expect(result).toContain("WALK_IN_WARDROBE");
  });

  it("does not duplicate a feature that already exists", () => {
    const result = toggleRoomFeature(["EN_SUITE"], "EN_SUITE", true);
    expect(result.filter((f) => f === "EN_SUITE")).toHaveLength(1);
  });

  it("removes a feature when unchecked", () => {
    const result = toggleRoomFeature(["EN_SUITE", "WALK_IN_WARDROBE"], "EN_SUITE", false);
    expect(result).not.toContain("EN_SUITE");
    expect(result).toContain("WALK_IN_WARDROBE");
  });

  it("returns the same array when removing a feature that doesn't exist", () => {
    const result = toggleRoomFeature(["EN_SUITE"], "BALCONY", false);
    expect(result).toEqual(["EN_SUITE"]);
  });

  it("returns empty array when removing the only feature", () => {
    const result = toggleRoomFeature(["EN_SUITE"], "EN_SUITE", false);
    expect(result).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const original = ["EN_SUITE"];
    toggleRoomFeature(original, "BALCONY", true);
    expect(original).toEqual(["EN_SUITE"]);
  });
});

describe("getBedSizeOptions", () => {
  it("returns a non-empty array", () => {
    expect(getBedSizeOptions().length).toBeGreaterThan(0);
  });

  it("each option has a value and label", () => {
    for (const opt of getBedSizeOptions()) {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    }
  });
});

describe("getBedroomFeatureOptions", () => {
  it("returns a non-empty array", () => {
    expect(getBedroomFeatureOptions().length).toBeGreaterThan(0);
  });
});

describe("getBathroomFeatureOptions", () => {
  it("returns a non-empty array", () => {
    expect(getBathroomFeatureOptions().length).toBeGreaterThan(0);
  });
});
