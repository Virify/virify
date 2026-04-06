import { describe, it, expect } from "vitest";
import { asArray } from "../../app/utils/arrays/as-array";
import { isArrayOfStrings } from "../../app/utils/arrays/is-array-of-strings";
import { isArrayOfOptions, asArrayOfOptions } from "../../app/utils/arrays/is-array-of-options";
import {
  isPopulatedArray,
  containsPopulatedArray,
  containsOnlyPopulatedArrays,
} from "../../app/utils/arrays/is-populated-array";

describe("asArray", () => {
  it("returns an array as-is", () => {
    expect(asArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("returns [] for a non-array when forceArray is false (default)", () => {
    expect(asArray("hello" as any)).toEqual([]);
  });

  it("wraps a non-array in an array when forceArray is true", () => {
    expect(asArray("hello" as any, true)).toEqual(["hello"]);
  });

  it("returns array as-is when forceArray is true", () => {
    expect(asArray([1, 2], true)).toEqual([1, 2]);
  });
});

describe("isArrayOfStrings", () => {
  it("returns true for an array of strings", () => {
    expect(isArrayOfStrings(["a", "b"])).toBe(true);
  });

  it("returns false for a mixed array", () => {
    expect(isArrayOfStrings(["a", 1])).toBe(false);
  });

  it("returns false for a non-array", () => {
    expect(isArrayOfStrings("abc")).toBe(false);
  });

  it("returns true for empty array", () => {
    expect(isArrayOfStrings([])).toBe(true);
  });
});

describe("isArrayOfOptions", () => {
  it("returns true for valid option objects", () => {
    expect(isArrayOfOptions([{ key: "a", value: "1" }])).toBe(true);
  });

  it("returns false for plain string array", () => {
    expect(isArrayOfOptions(["a", "b"])).toBe(false);
  });

  it("returns true for empty array", () => {
    expect(isArrayOfOptions([])).toBe(true);
  });

  it("returns false for non-array", () => {
    expect(isArrayOfOptions("abc")).toBe(false);
  });
});

describe("asArrayOfOptions", () => {
  it("converts string array to option objects", () => {
    expect(asArrayOfOptions(["foo", "bar"])).toEqual([
      { key: "foo", value: "foo" },
      { key: "bar", value: "bar" },
    ]);
  });

  it("returns option array unchanged", () => {
    const opts = [{ key: "x", value: "y" }];
    expect(asArrayOfOptions(opts)).toEqual(opts);
  });

  it("returns empty array for invalid input", () => {
    expect(asArrayOfOptions(123)).toEqual([]);
  });
});

describe("isPopulatedArray", () => {
  it("returns true for a non-empty array", () => {
    expect(isPopulatedArray([1])).toBe(true);
  });

  it("returns false for an empty array", () => {
    expect(isPopulatedArray([])).toBe(false);
  });

  it("returns false for a non-array", () => {
    expect(isPopulatedArray("string")).toBe(false);
  });
});

describe("containsPopulatedArray", () => {
  it("returns true when any argument is a non-empty array", () => {
    expect(containsPopulatedArray([], [1])).toBe(true);
  });

  it("returns false when all arguments are empty", () => {
    expect(containsPopulatedArray([], [])).toBe(false);
  });
});

describe("containsOnlyPopulatedArrays", () => {
  it("returns true when all arguments are non-empty arrays", () => {
    expect(containsOnlyPopulatedArrays([1], [2])).toBe(true);
  });

  it("returns false when any argument is empty", () => {
    expect(containsOnlyPopulatedArrays([1], [])).toBe(false);
  });
});
