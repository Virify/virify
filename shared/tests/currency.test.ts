import { describe, it, expect } from "vitest";
import { numberToCurrency, currencyToNumber } from "../utils/currency";

describe("numberToCurrency", () => {
  it("formats a whole number as GBP", () => {
    expect(numberToCurrency(1000)).toBe("£1,000");
  });

  it("formats zero as GBP", () => {
    expect(numberToCurrency(0)).toBe("£0");
  });

  it("formats a large number with commas", () => {
    expect(numberToCurrency(250000)).toBe("£250,000");
  });

  it("returns £- for Infinity", () => {
    expect(numberToCurrency(Infinity)).toBe("£-");
  });

  it("returns £- for -Infinity", () => {
    expect(numberToCurrency(-Infinity)).toBe("£-");
  });

  it("returns £- for NaN", () => {
    expect(numberToCurrency(NaN)).toBe("£-");
  });

  it("floors decimal when isFloor is true", () => {
    expect(numberToCurrency(1234.99, true)).toBe("£1,234");
  });

  it("rounds decimals to nearest whole number (no pence)", () => {
    // maximumFractionDigits: 0 — all prices are whole pounds
    expect(numberToCurrency(1234.5)).toBe("£1,235");
    expect(numberToCurrency(1234.4)).toBe("£1,234");
  });

  it("formats negative numbers", () => {
    expect(numberToCurrency(-500)).toBe("-£500");
  });
});

describe("currencyToNumber", () => {
  it("strips £ sign and parses to number", () => {
    expect(currencyToNumber("£1,000")).toBe(1000);
  });

  it("strips commas and parses to number", () => {
    expect(currencyToNumber("250,000")).toBe(250000);
  });

  it("parses plain numeric string", () => {
    expect(currencyToNumber("500")).toBe(500);
  });

  it("returns 0 for empty string", () => {
    expect(currencyToNumber("")).toBe(0);
  });

  it("returns 0 for string with no digits", () => {
    expect(currencyToNumber("abc")).toBe(0);
  });

  it("handles £ prefix with spaces", () => {
    expect(currencyToNumber("£ 1 500")).toBe(1500);
  });
});
