import { describe, it, expect } from "vitest";
import { isNumber, roundFloat } from "../utils/numbers";

describe("isNumber", () => {
  it("returns true for a positive integer", () => {
    expect(isNumber(42)).toBe(true);
  });

  it("returns true for a negative integer", () => {
    expect(isNumber(-5)).toBe(true);
  });

  it("returns true for a float", () => {
    expect(isNumber(3.14)).toBe(true);
  });

  it("returns true for zero", () => {
    // !!Number(0) is false, but Number(0) === 0 is true → overall true
    expect(isNumber(0)).toBe(true);
  });

  it("returns true for a numeric string", () => {
    // Number('42') === 42, which is truthy
    expect(isNumber("42")).toBe(true);
  });

  it("returns true for empty string (edge case)", () => {
    // Number('') === 0, and Number(0) === 0 → true
    expect(isNumber("")).toBe(true);
  });

  it("returns false for NaN", () => {
    expect(isNumber(NaN)).toBe(false);
  });

  it("returns true for null (Number(null)===0 edge case)", () => {
    // Number(null) === 0, which satisfies the === 0 check
    expect(isNumber(null)).toBe(true);
  });

  it("returns false for undefined", () => {
    expect(isNumber(undefined)).toBe(false);
  });

  it("returns false for a non-numeric string", () => {
    expect(isNumber("abc")).toBe(false);
  });

  it("returns false for an object", () => {
    expect(isNumber({})).toBe(false);
  });
});

describe("roundFloat", () => {
  it("rounds to 2 decimal places", () => {
    expect(roundFloat(1.125, 2)).toBe(1.13);
  });

  it("rounds to 0 decimal places", () => {
    expect(roundFloat(1.6, 0)).toBe(2);
  });

  it("rounds down correctly", () => {
    expect(roundFloat(1.444, 2)).toBe(1.44);
  });

  it("handles negative values", () => {
    expect(roundFloat(-1.555, 2)).toBe(-1.55);
  });

  it("handles whole numbers with any decimal places", () => {
    expect(roundFloat(5, 3)).toBe(5);
  });

  it("rounds to 1 decimal place", () => {
    expect(roundFloat(2.35, 1)).toBe(2.4);
  });
});
