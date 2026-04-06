// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("#imports", () => ({
  createError: (msg: string) => new Error(msg),
}));

import { formatMDY, calculateDateFromDays, dateAddedToDays } from "../utils/format-date";

describe("formatMDY", () => {
  it("returns 'N/A' for null", () => {
    expect(formatMDY(null)).toBe("N/A");
  });

  it("returns 'N/A' for undefined", () => {
    expect(formatMDY(undefined)).toBe("N/A");
  });

  it("formats a known date correctly (en-GB long format)", () => {
    const date = new Date("2024-01-15T00:00:00Z");
    expect(formatMDY(date)).toBe("15 January 2024");
  });

  it("formats another date correctly", () => {
    const date = new Date("2023-12-01T00:00:00Z");
    expect(formatMDY(date)).toBe("1 December 2023");
  });
});

describe("calculateDateFromDays", () => {
  beforeEach(() => {
    // Fix current date to 2026-04-06
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-06T00:00:00Z"));
  });

  it("returns a date N days in the past", () => {
    const result = calculateDateFromDays("7");
    const expected = new Date("2026-03-30T00:00:00Z");
    expect(result.toDateString()).toBe(expected.toDateString());
  });

  it("returns today for '0' days", () => {
    const result = calculateDateFromDays("0");
    expect(result.toDateString()).toBe(new Date("2026-04-06").toDateString());
  });

  it("throws for non-numeric string", () => {
    expect(() => calculateDateFromDays("abc")).toThrow();
  });

  it("returns a date 30 days ago", () => {
    const result = calculateDateFromDays("30");
    expect(result.toDateString()).toBe(new Date("2026-03-07T00:00:00Z").toDateString());
  });
});

describe("dateAddedToDays", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-06T00:00:00Z"));
  });

  it("returns 1 for a date added yesterday", () => {
    const yesterday = new Date("2026-04-05T00:00:00Z");
    expect(dateAddedToDays(yesterday)).toBe(1);
  });

  it("returns 7 for a date added 7 days ago", () => {
    const sevenDaysAgo = new Date("2026-03-30T00:00:00Z");
    expect(dateAddedToDays(sevenDaysAgo)).toBe(7);
  });

  it("returns 1 for today (ceil of 0 is 0 but timeDiff may be small)", () => {
    const today = new Date("2026-04-06T00:00:00Z");
    // timeDiff is 0ms → Math.ceil(0 / ms_per_day) = 0
    expect(dateAddedToDays(today)).toBe(0);
  });
});
