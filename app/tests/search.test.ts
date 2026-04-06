import { describe, it, expect } from "vitest";
import {
  matchesListingSearch,
  filterListingItems,
} from "../utils/search/search-filter";
import { applySortToResults } from "../utils/results/search-sort";

// ============================================================================
// matchesListingSearch
// ============================================================================

const makeListing = (overrides: Record<string, any> = {}) => ({
  listing: {
    property: { address: { fullAddress: "123 Main Street, London" } },
    title: "Beautiful Family Home",
    price: 350000,
    saleListing: {},
    rentalListing: null,
    ...overrides.listing,
  },
  note: overrides.note,
});

describe("matchesListingSearch", () => {
  it("returns true when term is empty", () => {
    expect(matchesListingSearch(makeListing(), "")).toBe(true);
  });

  it("matches on full address", () => {
    expect(matchesListingSearch(makeListing(), "main street")).toBe(true);
  });

  it("matches on title", () => {
    expect(matchesListingSearch(makeListing(), "family home")).toBe(true);
  });

  it("matches on price as string", () => {
    expect(matchesListingSearch(makeListing(), "350000")).toBe(true);
  });

  it("matches 'sale' category for saleListing", () => {
    expect(matchesListingSearch(makeListing(), "sale")).toBe(true);
  });

  it("matches 'rental' category for rentalListing", () => {
    const item = makeListing();
    item.listing.saleListing = null;
    item.listing.rentalListing = {};
    expect(matchesListingSearch(item, "rental")).toBe(true);
  });

  it("returns false when term does not match anything", () => {
    expect(matchesListingSearch(makeListing(), "zzznomatch")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(matchesListingSearch(makeListing(), "LONDON")).toBe(true);
  });

  it("matches note when includeNote is true", () => {
    const item = { ...makeListing(), note: "great view from balcony" };
    expect(matchesListingSearch(item, "balcony", true)).toBe(true);
  });

  it("does NOT match note when includeNote is false (default)", () => {
    const item = { ...makeListing(), note: "great view from balcony" };
    expect(matchesListingSearch(item, "balcony", false)).toBe(false);
  });

  it("falls back to raw listing if no .listing wrapper", () => {
    const rawListing = {
      property: { address: { fullAddress: "99 Oak Avenue" } },
      title: "Flat near station",
      price: 120000,
      saleListing: null,
      rentalListing: {},
    };
    expect(matchesListingSearch(rawListing, "oak avenue")).toBe(true);
  });
});

// ============================================================================
// filterListingItems
// ============================================================================

describe("filterListingItems", () => {
  const items = [
    makeListing({ listing: { title: "Riverside Cottage", property: { address: { fullAddress: "1 River Rd" } }, price: 200000, saleListing: {}, rentalListing: null } }),
    makeListing({ listing: { title: "City Centre Flat", property: { address: { fullAddress: "22 High St" } }, price: 150000, saleListing: null, rentalListing: {} } }),
    makeListing({ listing: { title: "Countryside Manor", property: { address: { fullAddress: "Farm Lane" } }, price: 750000, saleListing: {}, rentalListing: null } }),
  ];

  it("returns all items when term is empty", () => {
    expect(filterListingItems(items, "")).toHaveLength(3);
  });

  it("filters by title", () => {
    const result = filterListingItems(items, "cottage");
    expect(result).toHaveLength(1);
    expect(result[0]?.listing.title).toBe("Riverside Cottage");
  });

  it("filters by address", () => {
    const result = filterListingItems(items, "high st");
    expect(result).toHaveLength(1);
    expect(result[0]?.listing.title).toBe("City Centre Flat");
  });

  it("filters by price", () => {
    const result = filterListingItems(items, "750000");
    expect(result).toHaveLength(1);
    expect(result[0]?.listing.title).toBe("Countryside Manor");
  });

  it("returns empty array when nothing matches", () => {
    expect(filterListingItems(items, "zzznomatch")).toHaveLength(0);
  });

  it("trims whitespace from term", () => {
    const result = filterListingItems(items, "  cottage  ");
    expect(result).toHaveLength(1);
  });

  it("returns all items when term is whitespace only", () => {
    expect(filterListingItems(items, "   ")).toHaveLength(3);
  });

  it("handles null/undefined items array gracefully", () => {
    expect(filterListingItems(null as any, "cottage")).toHaveLength(0);
  });
});

// ============================================================================
// applySortToResults
// ============================================================================

const makeResult = (price: number, createdAt: string) =>
  ({ price, createdAt } as any);

describe("applySortToResults", () => {
  const results = [
    makeResult(300000, "2024-01-15"),
    makeResult(100000, "2024-03-01"),
    makeResult(500000, "2024-02-10"),
  ];

  it("returns results unchanged for 'relevance'", () => {
    const sorted = applySortToResults(results, "relevance");
    expect(sorted).toBe(results); // same reference
  });

  it("sorts price ascending", () => {
    const sorted = applySortToResults(results, "price-asc");
    expect(sorted.map((r) => r.price)).toEqual([100000, 300000, 500000]);
  });

  it("sorts price descending", () => {
    const sorted = applySortToResults(results, "price-desc");
    expect(sorted.map((r) => r.price)).toEqual([500000, 300000, 100000]);
  });

  it("sorts date ascending (oldest first)", () => {
    const sorted = applySortToResults(results, "date-asc");
    expect(sorted.map((r) => r.createdAt)).toEqual([
      "2024-01-15",
      "2024-02-10",
      "2024-03-01",
    ]);
  });

  it("sorts date descending (newest first)", () => {
    const sorted = applySortToResults(results, "date-desc");
    expect(sorted.map((r) => r.createdAt)).toEqual([
      "2024-03-01",
      "2024-02-10",
      "2024-01-15",
    ]);
  });

  it("does not mutate the original array", () => {
    const original = [...results];
    applySortToResults(results, "price-asc");
    expect(results.map((r) => r.price)).toEqual(original.map((r) => r.price));
  });

  it("returns results unchanged for unknown sort key", () => {
    const sorted = applySortToResults(results, "unknown-sort" as any);
    expect(sorted).toEqual(results);
  });
});
