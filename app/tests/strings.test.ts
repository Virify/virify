import { describe, it, expect } from "vitest";
import { isString } from "../utils/strings/is-string";
import { isStringy } from "../utils/strings/is-stringy";
import { asString } from "../utils/strings/as-string";
import { capataliseWords } from "../utils/strings/string-format";

describe("isString", () => {
  it("returns true for a non-empty string", () => {
    expect(isString("hello")).toBe(true);
  });

  it("returns false for an empty string", () => {
    expect(isString("")).toBe(false);
  });

  it("returns false for a number", () => {
    expect(isString(42)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isString(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isString(undefined)).toBe(false);
  });

  it("returns false for an object", () => {
    expect(isString({})).toBe(false);
  });

  it("returns false for an array", () => {
    expect(isString([])).toBe(false);
  });

  it("returns false for a boolean", () => {
    expect(isString(true)).toBe(false);
  });
});

describe("isStringy", () => {
  it("returns true for a non-empty string", () => {
    expect(isStringy("hello")).toBe(true);
  });

  it("returns true for a positive number", () => {
    expect(isStringy(42)).toBe(true);
  });

  it("returns true for 0 (special case)", () => {
    expect(isStringy(0)).toBe(true);
  });

  it("returns false for an empty string", () => {
    expect(isStringy("")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isStringy(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isStringy(undefined)).toBe(false);
  });

  it("returns false for an object", () => {
    expect(isStringy({})).toBe(false);
  });

  it("returns false for an array", () => {
    expect(isStringy([])).toBe(false);
  });

  it("returns false for a boolean", () => {
    expect(isStringy(false)).toBe(false);
    expect(isStringy(true)).toBe(false);
  });

  it("returns false for NaN", () => {
    expect(isStringy(NaN)).toBe(false);
  });
});

describe("asString", () => {
  it("returns the string when given a string", () => {
    expect(asString("hello")).toBe("hello");
  });

  it("returns undefined for a number", () => {
    expect(asString(42)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(asString(null)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(asString(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string (falsy)", () => {
    expect(asString("")).toBeUndefined();
  });

  it("returns undefined for an object", () => {
    expect(asString({})).toBeUndefined();
  });
});

describe("capataliseWords", () => {
  it("capitalises the first letter of each word", () => {
    expect(capataliseWords("hello world")).toBe("Hello World");
  });

  it("lowercases remaining letters in each word", () => {
    expect(capataliseWords("HELLO WORLD")).toBe("Hello World");
  });

  it("handles single word", () => {
    expect(capataliseWords("hello")).toBe("Hello");
  });

  it("handles already capitalised string", () => {
    expect(capataliseWords("Hello World")).toBe("Hello World");
  });

  it("returns null for null input", () => {
    expect(capataliseWords(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(capataliseWords(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(capataliseWords("")).toBeNull();
  });

  it("handles mixed case words", () => {
    expect(capataliseWords("hElLo WoRlD")).toBe("Hello World");
  });
});
