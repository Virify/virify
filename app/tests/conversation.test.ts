import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  filterMessagesExcludingConversation,
  shouldNotifyForNewConversation,
  getConversationSenderName,
  getConversationLatestMessage,
  getConversationPoV,
  getConvoMessagePoV,
  isMessageFromUser,
  formatMessageTimestampToTime,
  formatPartnerName,
  getLastMessage,
} from "../../app/utils/conversation";

// Minimal message factory
const makeMessage = (id: number, conversationId: number, senderId: number, senderName = "Alice") => ({
  id,
  conversationId,
  senderId,
  receiverId: 99,
  content: "hello",
  isRead: false,
  createdAt: new Date("2026-04-06T10:00:00Z"),
  updatedAt: new Date("2026-04-06T10:00:00Z"),
  sender: { id: senderId, username: senderName, avatar: null },
  receiver: { id: 99, username: "Bob", avatar: null },
});

// Minimal conversation factory
const makeConvo = (senderId: number, receiverId: number, messages: any[] = []) => ({
  id: 1,
  listingId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  sender: { id: senderId, username: "Alice", avatar: null },
  receiver: { id: receiverId, username: "Bob", avatar: null },
  messages,
});

describe("filterMessagesExcludingConversation", () => {
  it("filters out messages belonging to a given conversationId", () => {
    const msgs = [makeMessage(1, 10, 1), makeMessage(2, 20, 1), makeMessage(3, 10, 1)];
    const result = filterMessagesExcludingConversation(msgs as any, 10);
    expect(result).toHaveLength(1);
    expect(result[0].conversationId).toBe(20);
  });

  it("returns all messages when none match the conversationId", () => {
    const msgs = [makeMessage(1, 10, 1)];
    const result = filterMessagesExcludingConversation(msgs as any, 99);
    expect(result).toHaveLength(1);
  });

  it("returns empty array for empty messages", () => {
    expect(filterMessagesExcludingConversation([], 10)).toEqual([]);
  });
});

describe("shouldNotifyForNewConversation", () => {
  it("returns false when currentUserId is undefined", () => {
    expect(shouldNotifyForNewConversation(makeConvo(1, 2) as any, undefined)).toBe(false);
  });

  it("returns false when sender is the current user", () => {
    expect(shouldNotifyForNewConversation(makeConvo(1, 2) as any, 1)).toBe(false);
  });

  it("returns true when sender is NOT the current user", () => {
    expect(shouldNotifyForNewConversation(makeConvo(1, 2) as any, 2)).toBe(true);
  });
});

describe("getConversationSenderName", () => {
  it("returns sender username", () => {
    expect(getConversationSenderName(makeConvo(1, 2) as any)).toBe("Alice");
  });

  it("returns 'Someone' when sender has no username", () => {
    const convo = makeConvo(1, 2);
    convo.sender.username = null as any;
    expect(getConversationSenderName(convo as any)).toBe("Someone");
  });
});

describe("getConversationLatestMessage", () => {
  it("returns null for empty messages", () => {
    expect(getConversationLatestMessage(makeConvo(1, 2, []) as any)).toBeNull();
  });

  it("returns the last message in the array", () => {
    const msgs = [makeMessage(1, 1, 1), makeMessage(2, 1, 1)];
    const result = getConversationLatestMessage(makeConvo(1, 2, msgs) as any);
    expect(result?.id).toBe(2);
  });
});

describe("getConversationPoV", () => {
  it("when current user is sender, returns receiver info", () => {
    const result = getConversationPoV(makeConvo(1, 2) as any, 1);
    expect(result.name).toBe("Bob");
    expect(result.otherUserId).toBe(2);
  });

  it("when current user is receiver, returns sender info", () => {
    const result = getConversationPoV(makeConvo(1, 2) as any, 2);
    expect(result.name).toBe("Alice");
    expect(result.otherUserId).toBe(1);
  });

  it("returns fallback when currentUserId is undefined", () => {
    const result = getConversationPoV(makeConvo(1, 2) as any, undefined);
    expect(result.name).toBe("Alice");
    expect(result.otherUserId).toBeUndefined();
  });

  it("works with string currentUserId", () => {
    const result = getConversationPoV(makeConvo(1, 2) as any, "1");
    expect(result.name).toBe("Bob");
  });
});

describe("getConvoMessagePoV", () => {
  it("returns 'You' when message sender is current user", () => {
    const msg = makeMessage(1, 1, 5, "Alice");
    expect(getConvoMessagePoV(msg as any, 5)).toBe("You");
  });

  it("returns sender username when sender is not current user", () => {
    const msg = makeMessage(1, 1, 5, "Alice");
    expect(getConvoMessagePoV(msg as any, 99)).toBe("Alice");
  });

  it("works with string IDs", () => {
    const msg = makeMessage(1, 1, 5, "Alice");
    expect(getConvoMessagePoV(msg as any, "5")).toBe("You");
  });
});

describe("isMessageFromUser (inverted — returns true when NOT from user)", () => {
  it("returns false when senderId matches currentUserId (i.e. IS from user)", () => {
    const msg = makeMessage(1, 1, 5);
    expect(isMessageFromUser(msg as any, 5)).toBe(false);
  });

  it("returns true when senderId does NOT match currentUserId", () => {
    const msg = makeMessage(1, 1, 5);
    expect(isMessageFromUser(msg as any, 99)).toBe(true);
  });

  it("works with string IDs", () => {
    const msg = makeMessage(1, 1, 5);
    expect(isMessageFromUser(msg as any, "5")).toBe(false);
  });
});

describe("formatMessageTimestampToTime", () => {
  it("returns empty string for undefined", () => {
    expect(formatMessageTimestampToTime(undefined)).toBe("");
  });

  it("formats a Date to HH:MM", () => {
    const result = formatMessageTimestampToTime(new Date("2026-04-06T10:30:00Z"));
    // en-GB 24h format
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("formatPartnerName", () => {
  it("strips domain from email and replaces separators", () => {
    expect(formatPartnerName("john.doe@example.com")).toBe("john doe");
  });

  it("returns plain name unchanged", () => {
    expect(formatPartnerName("John")).toBe("John");
  });

  it("replaces underscores in email username", () => {
    expect(formatPartnerName("john_doe@example.com")).toBe("john doe");
  });
});

describe("getLastMessage", () => {
  it("returns null for no messages", () => {
    expect(getLastMessage(makeConvo(1, 2, []) as any)).toBeNull();
  });

  it("returns last message in array", () => {
    const msgs = [makeMessage(1, 1, 1), makeMessage(2, 1, 1)];
    expect(getLastMessage(makeConvo(1, 2, msgs) as any)?.id).toBe(2);
  });
});
