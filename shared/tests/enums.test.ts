import { describe, it, expect } from "vitest";
import { convertToValidEnum, convertEnumToString, convertEnumToCapalizedString } from "../utils/enums";

describe("convertToValidEnum", () => {
  it("returns undefined for undefined input", () => {
    expect(convertToValidEnum(undefined)).toBeUndefined();
  });

  it("returns undefined for 'all'", () => {
    expect(convertToValidEnum("all")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(convertToValidEnum("")).toBeUndefined();
  });

  it("converts a single value to uppercase enum array", () => {
    expect(convertToValidEnum("available")).toEqual(["AVAILABLE"]);
  });

  it("converts comma-separated values to array", () => {
    expect(convertToValidEnum("available,sold")).toEqual(["AVAILABLE", "SOLD"]);
  });

  it("trims whitespace around values", () => {
    expect(convertToValidEnum("available, under_offer")).toEqual(["AVAILABLE", "UNDER_OFFER"]);
  });

  it("replaces spaces with underscores and uppercases", () => {
    expect(convertToValidEnum("under offer")).toEqual(["UNDER_OFFER"]);
  });
});

describe("convertEnumToString", () => {
  it("returns empty string for null", () => {
    expect(convertEnumToString(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(convertEnumToString(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(convertEnumToString("")).toBe("");
  });

  it("converts underscore-separated enum to title case", () => {
    expect(convertEnumToString("OPEN_PLAN")).toBe("Open Plan");
  });

  it("converts multi-word underscore enum", () => {
    expect(convertEnumToString("EN_SUITE_BATHROOM")).toBe("En Suite Bathroom");
  });

  it("converts all-uppercase single word", () => {
    expect(convertEnumToString("GYM")).toBe("Gym");
  });

  it("converts camelCase enum to spaced string", () => {
    expect(convertEnumToString("enSuite")).toBe("En Suite");
  });

  it("converts simple camelCase", () => {
    expect(convertEnumToString("openPlan")).toBe("Open Plan");
  });
});

describe("convertEnumToCapalizedString", () => {
  it("returns empty string for undefined", () => {
    expect(convertEnumToCapalizedString(undefined)).toBe("");
  });

  it("capitalizes first letter of a lowercase enum", () => {
    expect(convertEnumToCapalizedString("available")).toBe("Available");
  });

  it("converts uppercase enum to capitalized", () => {
    expect(convertEnumToCapalizedString("AVAILABLE")).toBe("Available");
  });

  it("converts underscore enum to spaced capitalized string", () => {
    expect(convertEnumToCapalizedString("UNDER_OFFER")).toBe("Under offer");
  });

  it("handles mixed case with underscores", () => {
    expect(convertEnumToCapalizedString("sold_stc")).toBe("Sold stc");
  });
});
