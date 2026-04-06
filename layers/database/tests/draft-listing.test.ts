import { describe, it, expect, beforeEach, vi } from "vitest";
import { createDraftListing, getDraftListingById, getDraftListingsByUserId } from "../server/utils/draft-listing";
import { ListingTier } from "../server/database/prisma/generated/enums";

// ──────────────────────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────────────────────

const mockDraftListing = vi.hoisted(() => ({
  create: vi.fn(),
  findUnique: vi.fn(),
  findMany: vi.fn(),
}));

vi.mock("../server/utils/prisma-client", () => ({
  prisma: {
    draftListing: mockDraftListing,
  },
}));

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

const baseDraft = {
  id: 1,
  userId: 10,
  listingTier: ListingTier.STANDARD,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  rentalListing: null,
  saleListing: null,
  property: null,
  user: { id: 10, username: "testuser", email: "test@example.com", createdAt: new Date() },
};

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

describe("createDraftListing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls prisma.draftListing.create with userId and tier", async () => {
    mockDraftListing.create.mockResolvedValue(baseDraft);

    const result = await createDraftListing(10, ListingTier.STANDARD);

    expect(mockDraftListing.create).toHaveBeenCalledOnce();
    const arg = mockDraftListing.create.mock.calls[0][0];
    expect(arg.data.userId).toBe(10);
    expect(arg.data.listingTier).toBe(ListingTier.STANDARD);
    expect(result).toEqual(baseDraft);
  });

  it("works with FEATURED tier", async () => {
    const featuredDraft = { ...baseDraft, listingTier: ListingTier.FEATURED };
    mockDraftListing.create.mockResolvedValue(featuredDraft);

    const result = await createDraftListing(10, ListingTier.FEATURED);

    const arg = mockDraftListing.create.mock.calls[0][0];
    expect(arg.data.listingTier).toBe(ListingTier.FEATURED);
    expect(result.listingTier).toBe(ListingTier.FEATURED);
  });
});

describe("getDraftListingById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("queries prisma with the given id", async () => {
    mockDraftListing.findUnique.mockResolvedValue(baseDraft);

    const result = await getDraftListingById(1);

    expect(mockDraftListing.findUnique).toHaveBeenCalledOnce();
    const arg = mockDraftListing.findUnique.mock.calls[0][0];
    expect(arg.where.id).toBe(1);
    expect(result).toEqual(baseDraft);
  });

  it("returns null when draft does not exist", async () => {
    mockDraftListing.findUnique.mockResolvedValue(null);

    const result = await getDraftListingById(999);

    expect(result).toBeNull();
  });
});

describe("getDraftListingsByUserId", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all drafts for the given user", async () => {
    const drafts = [baseDraft, { ...baseDraft, id: 2 }];
    mockDraftListing.findMany.mockResolvedValue(drafts);

    const result = await getDraftListingsByUserId(10);

    expect(mockDraftListing.findMany).toHaveBeenCalledOnce();
    const arg = mockDraftListing.findMany.mock.calls[0][0];
    expect(arg.where.userId).toBe(10);
    expect(result).toHaveLength(2);
  });

  it("returns empty array when user has no drafts", async () => {
    mockDraftListing.findMany.mockResolvedValue([]);

    const result = await getDraftListingsByUserId(99);

    expect(result).toEqual([]);
  });

  it("orders results by updatedAt descending", async () => {
    mockDraftListing.findMany.mockResolvedValue([]);

    await getDraftListingsByUserId(10);

    const arg = mockDraftListing.findMany.mock.calls[0][0];
    expect(arg.orderBy?.updatedAt).toBe("desc");
  });
});
