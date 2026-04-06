import { describe, it, expect } from "vitest";
import {
  formatDuration,
  getHeatColor,
  getPeriodLabel,
  calculateConversionFunnel,
  getEmptyAnalyticsSummary,
  formatChartDate,
  getSourceIcon,
  PERIOD_OPTIONS,
  ANALYTICS_COLORS,
} from "../utils/analytics-helpers";

describe("ANALYTICS_COLORS", () => {
  it("exports BRAND_ORANGE", () => {
    expect(ANALYTICS_COLORS.BRAND_ORANGE).toBe("#FF6B35");
  });
});

describe("PERIOD_OPTIONS", () => {
  it("contains 7d, 30d, 90d options", () => {
    const values = PERIOD_OPTIONS.map((p) => p.value);
    expect(values).toContain("7d");
    expect(values).toContain("30d");
    expect(values).toContain("90d");
  });
});

describe("formatDuration", () => {
  it("formats seconds less than 60 as 'Xs'", () => {
    expect(formatDuration(45)).toBe("45s");
  });

  it("formats exactly 60 seconds as '1m'", () => {
    expect(formatDuration(60)).toBe("1m");
  });

  it("formats 90 seconds as '1m 30s'", () => {
    expect(formatDuration(90)).toBe("1m 30s");
  });

  it("formats 120 seconds as '2m'", () => {
    expect(formatDuration(120)).toBe("2m");
  });
});

describe("getHeatColor", () => {
  it("returns an rgba string", () => {
    const result = getHeatColor(0.5);
    expect(result).toMatch(/^rgba\(/);
  });

  it("intensity 0 produces low alpha (~0.2)", () => {
    const result = getHeatColor(0);
    expect(result).toContain("0.2");
  });

  it("intensity 1 produces high alpha (1)", () => {
    const result = getHeatColor(1);
    expect(result).toContain("1");
  });
});

describe("getPeriodLabel", () => {
  it("returns '7 Days' for 7d", () => {
    expect(getPeriodLabel("7d")).toBe("7 Days");
  });

  it("returns '30 Days' for 30d", () => {
    expect(getPeriodLabel("30d")).toBe("30 Days");
  });

  it("returns '90 Days' for 90d", () => {
    expect(getPeriodLabel("90d")).toBe("90 Days");
  });
});

describe("calculateConversionFunnel", () => {
  it("returns all-zero values for null input", () => {
    const result = calculateConversionFunnel(null);
    expect(result).toHaveLength(4);
    for (const item of result) {
      expect(item.value).toBe(0);
      expect(item.percentage).toBe(0);
    }
  });

  it("sets Impressions percentage to 100", () => {
    const result = calculateConversionFunnel({ totalImpressions: 1000, totalViews: 500, totalFavourites: 100, totalEnquiries: 20 });
    expect(result[0]!.percentage).toBe(100);
  });

  it("calculates Views percentage relative to impressions", () => {
    const result = calculateConversionFunnel({ totalImpressions: 1000, totalViews: 500, totalFavourites: 100, totalEnquiries: 20 });
    expect(result[1]!.percentage).toBe(50);
  });

  it("avoids division by zero when totalImpressions is 0", () => {
    const result = calculateConversionFunnel({ totalImpressions: 0, totalViews: 0, totalFavourites: 0, totalEnquiries: 0 });
    for (const item of result.slice(1)) {
      expect(item.percentage).toBe(0);
    }
  });
});

describe("getEmptyAnalyticsSummary", () => {
  it("returns an object with all-zero numeric fields", () => {
    const result = getEmptyAnalyticsSummary();
    for (const value of Object.values(result)) {
      expect(value).toBe(0);
    }
  });
});

describe("formatChartDate", () => {
  it("returns a shorter format on mobile", () => {
    const mobile = formatChartDate("2024-06-15", true);
    const desktop = formatChartDate("2024-06-15", false);
    expect(mobile.length).toBeLessThanOrEqual(desktop.length);
  });

  it("returns a string for a valid date", () => {
    expect(typeof formatChartDate("2024-01-01", false)).toBe("string");
  });
});

describe("getSourceIcon", () => {
  it("returns the search icon for 'search'", () => {
    expect(getSourceIcon("search")).toBe("i-lucide-search");
  });

  it("returns a fallback icon for unknown source", () => {
    expect(getSourceIcon("unknown")).toBe("i-lucide-circle");
  });
});
