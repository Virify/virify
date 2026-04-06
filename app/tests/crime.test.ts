import { describe, it, expect, vi } from "vitest";

const mockCalculateDistance = vi.hoisted(() => vi.fn(() => 0));
vi.mock("#imports", () => ({
  calculateDistance: mockCalculateDistance,
}));
vi.mock("../../layers/map/utils/calculate", () => ({
  calculateDistance: mockCalculateDistance,
}));

import {
  getScoreLevelText,
  filterCrimesByRadius,
  calculateCrimeScore,
  groupCrimesByCategory,
} from "../../app/utils/crime";

const makeIncident = (category: string, lat = "51.48", lon = "-3.18") => ({
  category,
  location: { latitude: lat, longitude: lon },
});

describe("getScoreLevelText", () => {
  it("returns correct label for very-low", () => {
    expect(getScoreLevelText("very-low")).toBe("Very Low Crime");
  });

  it("returns correct label for high", () => {
    expect(getScoreLevelText("high")).toBe("High Crime");
  });

  it("returns 'Unknown' for unknown level", () => {
    expect(getScoreLevelText("extreme")).toBe("Unknown");
  });
});

describe("filterCrimesByRadius", () => {
  const centerLat = 51.48;
  const centerLon = -3.18;

  it("includes crimes within the radius", () => {
    mockCalculateDistance.mockReturnValue(50); // 50m — within 100m radius
    const crimes = [makeIncident("burglary", "51.48", "-3.18")] as any;
    const result = filterCrimesByRadius(crimes, centerLat, centerLon, 100);
    expect(result).toHaveLength(1);
  });

  it("excludes crimes outside the radius", () => {
    mockCalculateDistance.mockReturnValue(500); // 500m — outside 100m radius
    const crimes = [makeIncident("burglary", "52.48", "-3.18")] as any;
    const result = filterCrimesByRadius(crimes, centerLat, centerLon, 100);
    expect(result).toHaveLength(0);
  });

  it("excludes crimes with missing location", () => {
    const crimes = [{ category: "burglary", location: {} }] as any;
    const result = filterCrimesByRadius(crimes, centerLat, centerLon, 1000);
    expect(result).toHaveLength(0);
  });
});

describe("calculateCrimeScore", () => {
  it("returns very-low for empty crimes array", () => {
    const result = calculateCrimeScore([]);
    expect(result.level).toBe("very-low");
    expect(result.score).toBe(0);
  });

  it("returns a score object with required fields", () => {
    const crimes = [makeIncident("burglary")] as any;
    const result = calculateCrimeScore(crimes);
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("level");
    expect(result).toHaveProperty("description");
  });

  it("assigns high score for robbery crimes", () => {
    // robbery has weight 4 → (4/1) * 10 = 40 → level 'medium'
    const crimes = [makeIncident("robbery")] as any;
    const result = calculateCrimeScore(crimes);
    expect(result.score).toBe(40);
    expect(result.level).toBe("medium");
  });

  it("assigns low score for shoplifting", () => {
    // shoplifting weight 1 → (1/1) * 10 = 10 → level 'very-low'
    const crimes = [makeIncident("shoplifting")] as any;
    const result = calculateCrimeScore(crimes);
    expect(result.level).toBe("very-low");
  });

  it("caps score at 100", () => {
    // Many high-weight crimes
    const crimes = Array(30).fill(makeIncident("robbery")) as any;
    const result = calculateCrimeScore(crimes);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe("groupCrimesByCategory", () => {
  it("groups crimes by category", () => {
    const crimes = [
      makeIncident("burglary"),
      makeIncident("burglary"),
      makeIncident("robbery"),
    ] as any;
    const result = groupCrimesByCategory(crimes);
    const burglaryGroup = result.find((g) => g.category === "burglary");
    expect(burglaryGroup?.count).toBe(2);
  });

  it("sorts groups by count descending", () => {
    const crimes = [
      makeIncident("robbery"),
      makeIncident("burglary"),
      makeIncident("burglary"),
    ] as any;
    const result = groupCrimesByCategory(crimes);
    expect(result[0]?.category).toBe("burglary");
    expect(result[0]?.count).toBe(2);
  });

  it("returns empty array for no crimes", () => {
    expect(groupCrimesByCategory([])).toEqual([]);
  });
});
