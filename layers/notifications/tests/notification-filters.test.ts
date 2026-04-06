import { describe, it, expect } from "vitest";
import {
  countUnreadNotifications,
  countUnreadNotificationById,
  getUnreadNotifications,
  getNonDismissedNotifications,
  findNotification,
  getConversationNotifications,
  hasDuplicateNotification,
  markNotificationsAsReadOptimistic,
  removeNotificationOptimistic,
  mergeNotifications,
  canProcessNotification,
  shouldShowNotificationBadge,
  calculateDismissCountDecrement,
  decrementNotificationCounts,
} from "../utils/notification-filters";
import type { UserNotification } from "../types/notification";

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

function makeNotif(id: number, overrides: Partial<UserNotification> = {}): UserNotification {
  return {
    id,
    userId: 1,
    type: "NEW_MESSAGE" as any,
    title: `Notification ${id}`,
    message: "A message",
    senderUsername: null,
    senderAvatar: null,
    conversationId: null,
    listingId: null,
    messageId: null,
    listingPrice: null,
    listingAddress: null,
    listingImage: null,
    listingIsRental: null,
    isRead: false,
    isDismissed: false,
    createdAt: new Date(),
    readAt: null,
    ...overrides,
  };
}

const counts = { total: 5, byType: {}, newMessages: 3, newEnquiries: 2, enquiryReplies: 0, listingUpdates: 0, system: 0 };

// ──────────────────────────────────────────────────────────────────────────────
// countUnreadNotifications
// ──────────────────────────────────────────────────────────────────────────────

describe("countUnreadNotifications", () => {
  it("counts all unread notifications", () => {
    const notifs = [makeNotif(1), makeNotif(2, { isRead: true }), makeNotif(3)];
    expect(countUnreadNotifications(notifs)).toBe(2);
  });

  it("counts unread for a specific conversation", () => {
    const notifs = [
      makeNotif(1, { conversationId: 10 }),
      makeNotif(2, { conversationId: 20 }),
      makeNotif(3, { conversationId: 10, isRead: true }),
    ];
    expect(countUnreadNotifications(notifs, "conversation", 10)).toBe(1);
  });

  it("returns 0 for empty list", () => {
    expect(countUnreadNotifications([])).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// countUnreadNotificationById
// ──────────────────────────────────────────────────────────────────────────────

describe("countUnreadNotificationById", () => {
  it("returns 1 for an unread notification", () => {
    expect(countUnreadNotificationById([makeNotif(5)], 5)).toBe(1);
  });

  it("returns 0 for a read notification", () => {
    expect(countUnreadNotificationById([makeNotif(5, { isRead: true })], 5)).toBe(0);
  });

  it("returns 0 when notification is not found", () => {
    expect(countUnreadNotificationById([], 99)).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getUnreadNotifications
// ──────────────────────────────────────────────────────────────────────────────

describe("getUnreadNotifications", () => {
  it("filters out read and dismissed notifications", () => {
    const notifs = [makeNotif(1), makeNotif(2, { isRead: true }), makeNotif(3, { isDismissed: true })];
    expect(getUnreadNotifications(notifs)).toHaveLength(1);
    expect(getUnreadNotifications(notifs)[0]!.id).toBe(1);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getNonDismissedNotifications
// ──────────────────────────────────────────────────────────────────────────────

describe("getNonDismissedNotifications", () => {
  it("filters out dismissed notifications only", () => {
    const notifs = [makeNotif(1), makeNotif(2, { isDismissed: true }), makeNotif(3, { isRead: true })];
    const result = getNonDismissedNotifications(notifs);
    expect(result).toHaveLength(2);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// findNotification
// ──────────────────────────────────────────────────────────────────────────────

describe("findNotification", () => {
  it("returns the correct notification", () => {
    expect(findNotification([makeNotif(1), makeNotif(2)], 2)?.id).toBe(2);
  });

  it("returns undefined when not found", () => {
    expect(findNotification([], 99)).toBeUndefined();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getConversationNotifications
// ──────────────────────────────────────────────────────────────────────────────

describe("getConversationNotifications", () => {
  it("returns only notifications for the given conversation", () => {
    const notifs = [makeNotif(1, { conversationId: 5 }), makeNotif(2, { conversationId: 6 })];
    expect(getConversationNotifications(notifs, 5)).toHaveLength(1);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// hasDuplicateNotification
// ──────────────────────────────────────────────────────────────────────────────

describe("hasDuplicateNotification", () => {
  it("returns true when notification id exists in list", () => {
    expect(hasDuplicateNotification([makeNotif(3)], 3)).toBe(true);
  });

  it("returns false when id not in list", () => {
    expect(hasDuplicateNotification([makeNotif(1)], 99)).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// markNotificationsAsReadOptimistic
// ──────────────────────────────────────────────────────────────────────────────

describe("markNotificationsAsReadOptimistic", () => {
  it("marks all notifications as read", () => {
    const notifs = [makeNotif(1), makeNotif(2)];
    const result = markNotificationsAsReadOptimistic(notifs, "all");
    expect(result.every((n) => n.isRead)).toBe(true);
  });

  it("marks only conversation notifications as read", () => {
    const notifs = [makeNotif(1, { conversationId: 10 }), makeNotif(2, { conversationId: 20 })];
    const result = markNotificationsAsReadOptimistic(notifs, "conversation", 10);
    expect(result.find((n) => n.id === 1)!.isRead).toBe(true);
    expect(result.find((n) => n.id === 2)!.isRead).toBe(false);
  });

  it("marks single notification as read", () => {
    const notifs = [makeNotif(1), makeNotif(2)];
    const result = markNotificationsAsReadOptimistic(notifs, "single", 1);
    expect(result.find((n) => n.id === 1)!.isRead).toBe(true);
    expect(result.find((n) => n.id === 2)!.isRead).toBe(false);
  });

  it("does not mutate original array", () => {
    const notifs = [makeNotif(1)];
    markNotificationsAsReadOptimistic(notifs, "all");
    expect(notifs[0]!.isRead).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// removeNotificationOptimistic
// ──────────────────────────────────────────────────────────────────────────────

describe("removeNotificationOptimistic", () => {
  it("removes the notification with matching id", () => {
    const result = removeNotificationOptimistic([makeNotif(1), makeNotif(2)], 1);
    expect(result.some((n) => n.id === 1)).toBe(false);
    expect(result).toHaveLength(1);
  });

  it("does not mutate the original array", () => {
    const notifs = [makeNotif(1)];
    removeNotificationOptimistic(notifs, 1);
    expect(notifs).toHaveLength(1);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// mergeNotifications
// ──────────────────────────────────────────────────────────────────────────────

describe("mergeNotifications", () => {
  it("deduplicates by id", () => {
    const existing = [makeNotif(1), makeNotif(2)];
    const incoming = [makeNotif(2), makeNotif(3)];
    const result = mergeNotifications(existing, incoming);
    expect(result).toHaveLength(3);
  });

  it("appends new notifications", () => {
    const result = mergeNotifications([makeNotif(1)], [makeNotif(2)]);
    expect(result.some((n) => n.id === 2)).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// canProcessNotification
// ──────────────────────────────────────────────────────────────────────────────

describe("canProcessNotification", () => {
  it("returns true for a valid notification", () => {
    expect(canProcessNotification(makeNotif(1))).toBe(true);
  });

  it("returns false for null", () => {
    expect(canProcessNotification(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(canProcessNotification(undefined)).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// shouldShowNotificationBadge
// ──────────────────────────────────────────────────────────────────────────────

describe("shouldShowNotificationBadge", () => {
  it("returns true when count > 0", () => {
    expect(shouldShowNotificationBadge(3)).toBe(true);
  });

  it("returns false when count is 0", () => {
    expect(shouldShowNotificationBadge(0)).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// calculateDismissCountDecrement
// ──────────────────────────────────────────────────────────────────────────────

describe("calculateDismissCountDecrement", () => {
  it("returns 1 for an unread notification", () => {
    expect(calculateDismissCountDecrement(makeNotif(1, { isRead: false }))).toBe(1);
  });

  it("returns 0 for a read notification", () => {
    expect(calculateDismissCountDecrement(makeNotif(1, { isRead: true }))).toBe(0);
  });

  it("returns 0 for undefined", () => {
    expect(calculateDismissCountDecrement(undefined)).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// decrementNotificationCounts
// ──────────────────────────────────────────────────────────────────────────────

describe("decrementNotificationCounts", () => {
  it("decrements total by specified amount", () => {
    const result = decrementNotificationCounts(counts, 2);
    expect(result!.total).toBe(3);
  });

  it("does not go below 0", () => {
    const result = decrementNotificationCounts({ ...counts, total: 1 }, 5);
    expect(result!.total).toBe(0);
  });

  it("returns unchanged counts when decrement is 0", () => {
    const result = decrementNotificationCounts(counts, 0);
    expect(result).toBe(counts);
  });

  it("returns null input unchanged", () => {
    expect(decrementNotificationCounts(null, 1)).toBeNull();
  });
});
