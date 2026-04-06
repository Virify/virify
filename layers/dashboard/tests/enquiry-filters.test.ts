import { describe, it, expect } from "vitest";
import {
  buildEnquiryUrl,
  canFetchEnquiries,
  isMessageFromUser,
  isActiveConversation,
  messageExists,
  findConversation,
  isListingContacted,
} from "../app/utils/enquiry-filters";

// ──────────────────────────────────────────────────────────────────────────────
// buildEnquiryUrl
// ──────────────────────────────────────────────────────────────────────────────

describe("buildEnquiryUrl", () => {
  it("builds a URL with default params", () => {
    const url = buildEnquiryUrl();
    expect(url).toContain("/api/conversation/");
    expect(url).toContain("filter=all");
    expect(url).toContain("direction=all");
    expect(url).toContain("sort=newest");
    expect(url).toContain("page=1");
    expect(url).toContain("limit=30");
  });

  it("applies provided options", () => {
    const url = buildEnquiryUrl({ filter: "unread", direction: "received", sort: "oldest", page: 2, limit: 10 });
    expect(url).toContain("filter=unread");
    expect(url).toContain("direction=received");
    expect(url).toContain("sort=oldest");
    expect(url).toContain("page=2");
    expect(url).toContain("limit=10");
  });

  it("appends listingId when provided", () => {
    const url = buildEnquiryUrl({ listingId: 42 });
    expect(url).toContain("listingId=42");
  });

  it("does not include listingId param when not provided", () => {
    const url = buildEnquiryUrl();
    expect(url).not.toContain("listingId");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// canFetchEnquiries
// ──────────────────────────────────────────────────────────────────────────────

describe("canFetchEnquiries", () => {
  it("returns true when logged in with a valid userId", () => {
    expect(canFetchEnquiries(true, 1)).toBe(true);
  });

  it("returns false when not logged in", () => {
    expect(canFetchEnquiries(false, 1)).toBe(false);
  });

  it("returns false when userId is null", () => {
    expect(canFetchEnquiries(true, null)).toBe(false);
  });

  it("returns false when both loggedIn is false and userId is null", () => {
    expect(canFetchEnquiries(false, null)).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// isMessageFromUser
// ──────────────────────────────────────────────────────────────────────────────

describe("isMessageFromUser", () => {
  it("returns true when senderId matches userId", () => {
    expect(isMessageFromUser({ senderId: 5 }, 5)).toBe(true);
  });

  it("returns false when senderId does not match userId", () => {
    expect(isMessageFromUser({ senderId: 5 }, 9)).toBe(false);
  });

  it("returns false for null message", () => {
    expect(isMessageFromUser(null, 5)).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// isActiveConversation
// ──────────────────────────────────────────────────────────────────────────────

describe("isActiveConversation", () => {
  it("returns true when IDs match", () => {
    expect(isActiveConversation(5, 5)).toBe(true);
  });

  it("returns false when IDs differ", () => {
    expect(isActiveConversation(5, 6)).toBe(false);
  });

  it("returns true when both are null", () => {
    expect(isActiveConversation(null, null)).toBe(true);
  });

  it("returns false when one is null and the other is not", () => {
    expect(isActiveConversation(null, 5)).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// messageExists
// ──────────────────────────────────────────────────────────────────────────────

describe("messageExists", () => {
  it("returns true when message with given id exists", () => {
    expect(messageExists([{ id: 1 }, { id: 2 }], 2)).toBe(true);
  });

  it("returns false when message not found", () => {
    expect(messageExists([{ id: 1 }], 99)).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(messageExists([], 1)).toBe(false);
  });

  it("returns false for null messages", () => {
    expect(messageExists(null as any, 1)).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// findConversation
// ──────────────────────────────────────────────────────────────────────────────

describe("findConversation", () => {
  it("returns the matching conversation", () => {
    const convs = [{ id: 1 }, { id: 2 }];
    expect(findConversation(convs, 2)).toEqual({ id: 2 });
  });

  it("returns null when not found", () => {
    expect(findConversation([{ id: 1 }], 99)).toBeNull();
  });

  it("returns null when conversationId is null", () => {
    expect(findConversation([{ id: 1 }], null)).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// isListingContacted
// ──────────────────────────────────────────────────────────────────────────────

describe("isListingContacted", () => {
  it("returns true for a positive conversationId", () => {
    expect(isListingContacted(5)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isListingContacted(null)).toBe(false);
  });

  it("returns false for 0", () => {
    expect(isListingContacted(0)).toBe(false);
  });
});
