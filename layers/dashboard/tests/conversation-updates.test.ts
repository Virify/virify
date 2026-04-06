import { describe, it, expect } from "vitest";
import {
  markMessageAsReadInConversation,
  updateConversationInList,
  getUnreadMessageCountInConversation,
} from "../app/utils/conversation-updates";

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

function makeMessage(id: number, receiverId: number, isRead: boolean): any {
  return { id, senderId: 99, receiverId, content: "hello", isRead, createdAt: new Date(), updatedAt: new Date(), conversationId: 1, sender: null, receiver: null };
}

function makeConversation(id: number, messages: any[] = []): any {
  return { id, listingId: null, createdAt: new Date(), updatedAt: new Date(), messages, sender: { id: 1, username: "a", avatar: null }, receiver: { id: 2, username: "b", avatar: null } };
}

// ──────────────────────────────────────────────────────────────────────────────
// markMessageAsReadInConversation
// ──────────────────────────────────────────────────────────────────────────────

describe("markMessageAsReadInConversation", () => {
  it("returns null when conversation is not found", () => {
    const result = markMessageAsReadInConversation([makeConversation(1)], 999, 1);
    expect(result).toBeNull();
  });

  it("returns null when message is not found in conversation", () => {
    const conv = makeConversation(1, [makeMessage(10, 2, false)]);
    const result = markMessageAsReadInConversation([conv], 1, 999);
    expect(result).toBeNull();
  });

  it("returns null when message is already read", () => {
    const conv = makeConversation(1, [makeMessage(10, 2, true)]);
    const result = markMessageAsReadInConversation([conv], 1, 10);
    expect(result).toBeNull();
  });

  it("returns updated conversation with message marked as read", () => {
    const conv = makeConversation(1, [makeMessage(10, 2, false)]);
    const result = markMessageAsReadInConversation([conv], 1, 10);
    expect(result).not.toBeNull();
    expect(result!.messages[0]!.isRead).toBe(true);
  });

  it("does not mutate the original conversation object", () => {
    const msg = makeMessage(10, 2, false);
    const conv = makeConversation(1, [msg]);
    markMessageAsReadInConversation([conv], 1, 10);
    expect(msg.isRead).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// updateConversationInList
// ──────────────────────────────────────────────────────────────────────────────

describe("updateConversationInList", () => {
  it("replaces the matching conversation", () => {
    const original = makeConversation(1);
    const updated = { ...original, updatedAt: new Date("2099-01-01") };
    const result = updateConversationInList([original], 1, updated);
    expect(result[0]!.updatedAt).toEqual(updated.updatedAt);
  });

  it("does not change the list when id not found", () => {
    const original = makeConversation(1);
    const updated = makeConversation(99);
    const result = updateConversationInList([original], 99, updated);
    // id 99 not in list, so list length unchanged but no replacement at index 0
    expect(result[0]!.id).toBe(1);
  });

  it("does not mutate the original array", () => {
    const original = makeConversation(1);
    const arr = [original];
    const updated = { ...original, updatedAt: new Date("2099-01-01") };
    updateConversationInList(arr, 1, updated);
    expect(arr[0]!.updatedAt).not.toEqual(updated.updatedAt);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getUnreadMessageCountInConversation
// ──────────────────────────────────────────────────────────────────────────────

describe("getUnreadMessageCountInConversation", () => {
  it("returns 0 for a conversation with no messages", () => {
    expect(getUnreadMessageCountInConversation(makeConversation(1, []), 2)).toBe(0);
  });

  it("counts only unread messages addressed to the current user", () => {
    const messages = [
      makeMessage(1, 2, false), // unread, to user 2 ✓
      makeMessage(2, 2, true),  // read, to user 2 ✗
      makeMessage(3, 3, false), // unread, to another user ✗
    ];
    const conv = makeConversation(1, messages);
    expect(getUnreadMessageCountInConversation(conv, 2)).toBe(1);
  });

  it("returns 0 when all messages are already read", () => {
    const messages = [makeMessage(1, 2, true), makeMessage(2, 2, true)];
    expect(getUnreadMessageCountInConversation(makeConversation(1, messages), 2)).toBe(0);
  });
});
