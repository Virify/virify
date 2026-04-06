import { describe, it, expect } from "vitest";
import {
  buildFilterUrl,
  buildEnquiriesUrl,
  buildNotesUrl,
  buildFavouritesUrl,
  buildListingsUrl,
} from "../app/utils/filter-url-builder";

// ──────────────────────────────────────────────────────────────────────────────
// buildFilterUrl
// ──────────────────────────────────────────────────────────────────────────────

describe("buildFilterUrl", () => {
  it("returns base path with no query string when params are empty", () => {
    expect(buildFilterUrl("/dashboard/enquiries")).toBe("/dashboard/enquiries");
  });

  it("returns base path with no query string when all params are 'all'", () => {
    expect(buildFilterUrl("/dashboard/enquiries", { filter: "all", direction: "all" })).toBe("/dashboard/enquiries");
  });

  it("adds non-'all' params to query string", () => {
    const result = buildFilterUrl("/dashboard/enquiries", { direction: "sent" });
    expect(result).toBe("/dashboard/enquiries?direction=sent");
  });

  it("combines multiple non-default params", () => {
    const result = buildFilterUrl("/dashboard/enquiries", { direction: "received", sort: "newest" });
    expect(result).toContain("direction=received");
    expect(result).toContain("sort=newest");
    expect(result).toContain("?");
  });

  it("omits params with undefined values", () => {
    const result = buildFilterUrl("/dashboard/enquiries", { direction: undefined });
    expect(result).toBe("/dashboard/enquiries");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// buildEnquiriesUrl
// ──────────────────────────────────────────────────────────────────────────────

describe("buildEnquiriesUrl", () => {
  it("uses /dashboard/enquiries as base path", () => {
    expect(buildEnquiriesUrl()).toBe("/dashboard/enquiries");
  });

  it("appends filter params", () => {
    expect(buildEnquiriesUrl({ direction: "sent" })).toContain("/dashboard/enquiries");
    expect(buildEnquiriesUrl({ direction: "sent" })).toContain("direction=sent");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// buildNotesUrl
// ──────────────────────────────────────────────────────────────────────────────

describe("buildNotesUrl", () => {
  it("uses /dashboard/notes as base path", () => {
    expect(buildNotesUrl()).toBe("/dashboard/notes");
  });

  it("appends filter params", () => {
    expect(buildNotesUrl({ sort: "oldest" })).toContain("sort=oldest");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// buildFavouritesUrl
// ──────────────────────────────────────────────────────────────────────────────

describe("buildFavouritesUrl", () => {
  it("uses /dashboard/favourites as base path", () => {
    expect(buildFavouritesUrl()).toBe("/dashboard/favourites");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// buildListingsUrl
// ──────────────────────────────────────────────────────────────────────────────

describe("buildListingsUrl", () => {
  it("uses /dashboard/listings as base path", () => {
    expect(buildListingsUrl()).toBe("/dashboard/listings");
  });

  it("appends category param when not 'all'", () => {
    expect(buildListingsUrl({ category: "sale" })).toContain("category=sale");
  });

  it("omits category param when value is 'all'", () => {
    expect(buildListingsUrl({ category: "all" })).toBe("/dashboard/listings");
  });
});
