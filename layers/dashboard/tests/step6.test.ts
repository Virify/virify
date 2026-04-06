import { describe, it, expect } from "vitest";
import {
  gardenFacingOptions,
  gardenPositionOptions,
  outdoorSpaceFeatureOptions,
  outdoorSpaceFeaturesOptions,
  landFeatureOptions,
} from "../app/utils/step6";

describe("gardenFacingOptions", () => {
  it("contains all four compass directions", () => {
    const values = gardenFacingOptions.map((o) => o.value);
    expect(values).toContain("NORTH");
    expect(values).toContain("EAST");
    expect(values).toContain("SOUTH");
    expect(values).toContain("WEST");
  });

  it("has 4 items", () => {
    expect(gardenFacingOptions).toHaveLength(4);
  });

  it("each item has value, key, and label", () => {
    for (const option of gardenFacingOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("key");
      expect(option).toHaveProperty("label");
    }
  });

  it("formats label correctly (NORTH → North)", () => {
    const north = gardenFacingOptions.find((o) => o.value === "NORTH");
    expect(north?.label).toBe("North");
    expect(north?.key).toBe("North");
  });
});

describe("gardenPositionOptions", () => {
  it("contains FRONT, REAR, SIDE", () => {
    const values = gardenPositionOptions.map((o) => o.value);
    expect(values).toContain("FRONT");
    expect(values).toContain("REAR");
    expect(values).toContain("SIDE");
  });

  it("has 3 items", () => {
    expect(gardenPositionOptions).toHaveLength(3);
  });

  it("each item has value, key, and label", () => {
    for (const option of gardenPositionOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("key");
      expect(option).toHaveProperty("label");
    }
  });

  it("formats label correctly (REAR → Rear)", () => {
    const rear = gardenPositionOptions.find((o) => o.value === "REAR");
    expect(rear?.label).toBe("Rear");
  });
});

describe("outdoorSpaceFeatureOptions", () => {
  it("is non-empty", () => {
    expect(outdoorSpaceFeatureOptions.length).toBeGreaterThan(0);
  });

  it("contains expected features", () => {
    const values = outdoorSpaceFeatureOptions.map((o) => o.value);
    expect(values).toContain("SUN_TERRACE");
    expect(values).toContain("BALCONY");
    expect(values).toContain("PATIO");
    expect(values).toContain("POOL");
  });

  it("each item has value, key, and label", () => {
    for (const option of outdoorSpaceFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("key");
      expect(option).toHaveProperty("label");
    }
  });

  it("formats multi-word labels correctly (SUN_TERRACE → Sun Terrace)", () => {
    const sunTerrace = outdoorSpaceFeatureOptions.find((o) => o.value === "SUN_TERRACE");
    expect(sunTerrace?.label).toBe("Sun Terrace");
  });
});

describe("outdoorSpaceFeaturesOptions (alias)", () => {
  it("is the same array as outdoorSpaceFeatureOptions", () => {
    expect(outdoorSpaceFeaturesOptions).toBe(outdoorSpaceFeatureOptions);
  });
});

describe("landFeatureOptions", () => {
  it("is non-empty", () => {
    expect(landFeatureOptions.length).toBeGreaterThan(0);
  });

  it("contains expected land features", () => {
    const values = landFeatureOptions.map((o) => o.value);
    expect(values).toContain("WOODLAND");
    expect(values).toContain("PADDOCK");
    expect(values).toContain("TENNIS_COURT");
    expect(values).toContain("OUTBUILDING");
  });

  it("each item has value, key, and label", () => {
    for (const option of landFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("key");
      expect(option).toHaveProperty("label");
    }
  });

  it("formats multi-word labels correctly (TENNIS_COURT → Tennis Court)", () => {
    const court = landFeatureOptions.find((o) => o.value === "TENNIS_COURT");
    expect(court?.label).toBe("Tennis Court");
  });
});
