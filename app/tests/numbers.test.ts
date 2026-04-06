import { describe, it, expect } from "vitest";
import { clampNumber } from "../utils/numbers/clamp-number";
import { isPositiveInteger } from "../utils/numbers/is-positive-integer";

describe("clampNumber", () => {
  it("returns the number when within range", () => {
    expect(clampNumber(5, { min: 0, max: 10 })).toBe(5);
  });

  it("clamps to min when below range", () => {
    expect(clampNumber(-5, { min: 0, max: 10 })).toBe(0);
  });

  it("clamps to max when above range", () => {
    expect(clampNumber(15, { min: 0, max: 10 })).toBe(10);
  });

  it("returns min exactly when value equals min", () => {
    expect(clampNumber(0, { min: 0, max: 10 })).toBe(0);
  });

  it("returns max exactly when value equals max", () => {
    expect(clampNumber(10, { min: 0, max: 10 })).toBe(10);
  });

  it("handles reversed min/max when both non-zero (sorts them)", () => {
    // min=10, max=5 → realMin=5, realMax=10
    expect(clampNumber(7, { min: 10, max: 5 })).toBe(7);
    expect(clampNumber(3, { min: 10, max: 5 })).toBe(5);
    expect(clampNumber(15, { min: 10, max: 5 })).toBe(10);
  });

  it("treats max=0 as invalid and defaults to Infinity", () => {
    // max=0 is falsy, so it becomes Infinity; min stays 10
    expect(clampNumber(5, { min: 10, max: 0 })).toBe(10);
  });

  it("defaults invalid min to 0", () => {
    expect(clampNumber(5, { min: NaN, max: 10 })).toBe(5);
  });

  it("defaults invalid max to Infinity", () => {
    expect(clampNumber(9999, { min: 0, max: NaN })).toBe(9999);
  });

  it("returns min (0) when num is NaN", () => {
    expect(clampNumber(NaN, { min: 0, max: 10 })).toBe(0);
  });

  it("returns min (0) when num is Infinity (non-finite)", () => {
    expect(clampNumber(Infinity, { min: 0, max: 10 })).toBe(0);
  });

  it("works with negative ranges", () => {
    expect(clampNumber(-5, { min: -10, max: -1 })).toBe(-5);
    expect(clampNumber(0, { min: -10, max: -1 })).toBe(-1);
    expect(clampNumber(-15, { min: -10, max: -1 })).toBe(-10);
  });
});

describe("isPositiveInteger", () => {
  it("returns true for 1", () => {
    expect(isPositiveInteger(1)).toBe(true);
  });

  it("returns true for large integers", () => {
    expect(isPositiveInteger(1000)).toBe(true);
  });

  it("returns false for 0", () => {
    expect(isPositiveInteger(0)).toBe(false);
  });

  it("returns false for negative integers", () => {
    expect(isPositiveInteger(-1)).toBe(false);
    expect(isPositiveInteger(-100)).toBe(false);
  });

  it("returns false for floats", () => {
    expect(isPositiveInteger(1.5)).toBe(false);
    expect(isPositiveInteger(0.9)).toBe(false);
  });

  it("returns false for strings", () => {
    expect(isPositiveInteger("1")).toBe(false);
    expect(isPositiveInteger("abc")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPositiveInteger(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isPositiveInteger(undefined)).toBe(false);
  });

  it("returns false for Infinity", () => {
    expect(isPositiveInteger(Infinity)).toBe(false);
  });

  it("returns false for NaN", () => {
    expect(isPositiveInteger(NaN)).toBe(false);
  });
});
