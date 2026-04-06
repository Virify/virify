import { describe, it, expect } from "vitest";
import {
  UK_POSTCODE_REGEX,
  formatPostcode,
  isValidPostcode,
  validateAndFormatPostcode,
  safeValidateAndFormatPostcode,
} from "../utils/postcode";

describe("UK_POSTCODE_REGEX", () => {
  it("matches a standard UK postcode", () => {
    expect(UK_POSTCODE_REGEX.test("CF10 1AA")).toBe(true);
  });

  it("matches GIR 0AA special case", () => {
    expect(UK_POSTCODE_REGEX.test("GIR 0AA")).toBe(true);
  });

  it("matches BFPO postcodes", () => {
    expect(UK_POSTCODE_REGEX.test("BFPO 1234")).toBe(true);
  });

  it("rejects a clearly invalid postcode", () => {
    expect(UK_POSTCODE_REGEX.test("INVALID")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(UK_POSTCODE_REGEX.test("")).toBe(false);
  });
});

describe("formatPostcode", () => {
  it("formats a compact lowercase postcode", () => {
    expect(formatPostcode("cf101aa")).toBe("CF10 1AA");
  });

  it("preserves already-formatted postcode", () => {
    expect(formatPostcode("CF10 1AA")).toBe("CF10 1AA");
  });

  it("formats GIR 0AA", () => {
    expect(formatPostcode("GIR0AA")).toBe("GIR 0AA");
  });

  it("formats BFPO postcode", () => {
    expect(formatPostcode("BFPO1234")).toBe("BFPO 1234");
  });

  it("formats KY overseas territory postcode", () => {
    expect(formatPostcode("KY11234")).toBe("KY1-1234");
  });

  it("handles extra spaces by normalizing", () => {
    expect(formatPostcode("  cf10  1aa  ")).toBe("CF10 1AA");
  });

  it("formats a 5-char postcode", () => {
    expect(formatPostcode("sw1a1")).toBe("SW 1A1");
  });
});

describe("isValidPostcode", () => {
  it("returns true for a valid UK postcode", () => {
    expect(isValidPostcode("SW1A 1AA")).toBe(true);
  });

  it("returns true for a compact valid postcode (case-insensitive)", () => {
    expect(isValidPostcode("sw1a1aa")).toBe(true);
  });

  it("returns false for an invalid postcode", () => {
    expect(isValidPostcode("NOTVALID")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isValidPostcode("")).toBe(false);
  });

  it("handles multiple spaces via normalization", () => {
    expect(isValidPostcode("CF10  1AA")).toBe(true);
  });
});

describe("validateAndFormatPostcode", () => {
  it("parses and formats a valid postcode", () => {
    expect(validateAndFormatPostcode("cf101aa")).toBe("CF10 1AA");
  });

  it("throws for an invalid postcode", () => {
    expect(() => validateAndFormatPostcode("INVALID")).toThrow();
  });
});

describe("safeValidateAndFormatPostcode", () => {
  it("returns formatted postcode for valid input", () => {
    expect(safeValidateAndFormatPostcode("sw1a1aa")).toBe("SW1A 1AA");
  });

  it("returns null for invalid input", () => {
    expect(safeValidateAndFormatPostcode("NOT A POSTCODE")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(safeValidateAndFormatPostcode("")).toBeNull();
  });
});
