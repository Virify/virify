import { describe, it, expect } from "vitest";
import {
  sqftToSqm,
  sqmToSqft,
  getFloorOptions,
  formatEnumLabel,
  formatPrice,
} from "../app/utils/create-listing";

describe("sqftToSqm", () => {
  it("converts 100 sqft to ~9.29 sqm", () => {
    expect(sqftToSqm(100)).toBeCloseTo(9.29, 1);
  });

  it("converts 0 sqft to 0 sqm", () => {
    expect(sqftToSqm(0)).toBe(0);
  });

  it("is the inverse of sqmToSqft (round-trip)", () => {
    const sqm = sqftToSqm(500);
    const backToSqft = sqmToSqft(sqm);
    expect(backToSqft).toBeCloseTo(500, 0);
  });
});

describe("sqmToSqft", () => {
  it("converts 100 sqm to ~1076 sqft", () => {
    expect(sqmToSqft(100)).toBeCloseTo(1076, 0);
  });

  it("converts 0 sqm to 0 sqft", () => {
    expect(sqmToSqft(0)).toBe(0);
  });
});

describe("getFloorOptions", () => {
  it("returns one option per floor", () => {
    expect(getFloorOptions(3)).toHaveLength(3);
  });

  it("labels first floor as Ground Floor", () => {
    const options = getFloorOptions(3);
    expect(options[0].label).toBe("Ground Floor");
    expect(options[0].value).toBe(1);
  });

  it("labels subsequent floors as Floor N-1", () => {
    const options = getFloorOptions(3);
    expect(options[1].label).toBe("Floor 1");
    expect(options[2].label).toBe("Floor 2");
  });

  it("returns empty array for 0 floors", () => {
    expect(getFloorOptions(0)).toHaveLength(0);
  });
});

describe("formatEnumLabel", () => {
  it("converts SNAKE_CASE to title case", () => {
    expect(formatEnumLabel("OPEN_PLAN")).toBe("Open plan");
  });

  it("handles single-word enums", () => {
    expect(formatEnumLabel("FREEHOLD")).toBe("Freehold");
  });

  it("handles already lowercased values", () => {
    expect(formatEnumLabel("standard")).toBe("Standard");
  });
});

describe("formatPrice", () => {
  it("formats a GBP price with commas and £ symbol", () => {
    const result = formatPrice(250000);
    expect(result).toContain("£");
    expect(result).toContain("250,000");
  });

  it("returns £0 for null", () => {
    expect(formatPrice(null)).toBe("£0");
  });

  it("returns £0 for undefined", () => {
    expect(formatPrice(undefined)).toBe("£0");
  });

  it("returns £0 for 0", () => {
    expect(formatPrice(0)).toBe("£0");
  });
});
