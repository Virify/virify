import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createBoundingBox,
  getRiskLevelText,
  getRiskDescription,
  calculateFloodRiskLevel,
  processFloodEvents,
} from "../../app/utils/flood-risk";

describe("createBoundingBox", () => {
  it("returns a string in the correct BBOX format", () => {
    const result = createBoundingBox(51.48, -3.18, 1000);
    expect(result).toMatch(/^-[\d.]+,[\d.]+,-[\d.]+,[\d.]+,EPSG:4326$/);
  });

  it("produces correct offset for 111km radius (1 degree offset)", () => {
    const result = createBoundingBox(51.0, 0.0, 111000);
    // offset ~1 degree
    expect(result).toBe("-1,50,1,52,EPSG:4326");
  });
});

describe("getRiskLevelText", () => {
  it("returns 'Very Low Risk' for very-low", () => {
    expect(getRiskLevelText("very-low")).toBe("Very Low Risk");
  });

  it("returns 'High Risk' for high", () => {
    expect(getRiskLevelText("high")).toBe("High Risk");
  });

  it("returns 'Unknown Risk' for unknown level", () => {
    expect(getRiskLevelText("extreme")).toBe("Unknown Risk");
  });
});

describe("getRiskDescription", () => {
  it("returns description for very-low", () => {
    expect(getRiskDescription("very-low")).toContain("No recorded flood events");
  });

  it("returns description for high", () => {
    expect(getRiskDescription("high")).toContain("Regular historical flooding");
  });

  it("returns fallback for unknown level", () => {
    expect(getRiskDescription("extreme")).toBe("Risk level unknown");
  });
});

describe("calculateFloodRiskLevel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-06T00:00:00Z"));
  });

  it("returns 'low' for empty events array", () => {
    expect(calculateFloodRiskLevel([])).toBe("low");
  });

  it("returns 'high' for 2+ events in last year", () => {
    const events = [
      { startDate: "2026-01-01", id: "1" },
      { startDate: "2025-09-01", id: "2" },
    ];
    expect(calculateFloodRiskLevel(events as any)).toBe("high");
  });

  it("returns 'high' for 4+ events in last 5 years", () => {
    const events = [
      { startDate: "2022-01-01", id: "1" },
      { startDate: "2022-06-01", id: "2" },
      { startDate: "2023-03-01", id: "3" },
      { startDate: "2023-11-01", id: "4" },
    ];
    expect(calculateFloodRiskLevel(events as any)).toBe("high");
  });

  it("returns 'medium' for 1 event in last year", () => {
    const events = [{ startDate: "2025-12-01", id: "1" }];
    expect(calculateFloodRiskLevel(events as any)).toBe("medium");
  });

  it("returns 'low' for events older than 5 years", () => {
    const events = [{ startDate: "2015-01-01", id: "1" }];
    expect(calculateFloodRiskLevel(events as any)).toBe("low");
  });
});

describe("processFloodEvents", () => {
  const cutoffDate = new Date("2016-01-01");

  it("filters out events before the cutoff date", () => {
    const features = [
      { properties: { start_date: "2015-06-01", recorded_outline_id: "old" } },
      { properties: { start_date: "2020-06-01", recorded_outline_id: "recent" } },
    ];
    const result = processFloodEvents(features, cutoffDate);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("recent");
  });

  it("filters out events with no start_date", () => {
    const features = [{ properties: { recorded_outline_id: "no-date" } }];
    const result = processFloodEvents(features, cutoffDate);
    expect(result).toHaveLength(0);
  });

  it("returns all events within cutoff", () => {
    const features = [
      { properties: { start_date: "2020-01-01", recorded_outline_id: "1" } },
      { properties: { start_date: "2022-06-15", recorded_outline_id: "2" } },
    ];
    const result = processFloodEvents(features, cutoffDate);
    expect(result).toHaveLength(2);
  });
});
