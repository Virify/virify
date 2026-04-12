import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createNotification,
  createMessageNotification,
  createEnquiryNotification,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markConversationNotificationsAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
  getNotificationCounts,
} from "../server/utils/notification";

// ──────────────────────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────────────────────

const mockNotification = vi.hoisted(() => ({
  create: vi.fn(),
  findMany: vi.fn(),
  findFirst: vi.fn(),
  updateMany: vi.fn(),
  count: vi.fn(),
  groupBy: vi.fn(),
}));

vi.mock("../server/utils/prisma-client", () => ({
  prisma: {
    userNotification: mockNotification,
  },
}));

const mockStorage = { removeItem: vi.fn().mockResolvedValue(undefined) };
vi.stubGlobal("useStorage", vi.fn().mockReturnValue(mockStorage));

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

const baseNotifData = {
  userId: 1,
  type: "NEW_MESSAGE" as any,
  title: "New message",
  message: "Hello!",
};

const sampleNotif = {
  id: 1,
  userId: 1,
  type: "NEW_MESSAGE",
  title: "New message",
  message: "Hello!",
  isRead: false,
  isDismissed: false,
  createdAt: new Date("2024-01-01"),
};

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

describe("createNotification", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls prisma.userNotification.create with correct data", async () => {
    mockNotification.create.mockResolvedValue(sampleNotif);

    const result = await createNotification(baseNotifData);

    expect(mockNotification.create).toHaveBeenCalledOnce();
    const arg = mockNotification.create.mock.calls[0][0].data;
    expect(arg.userId).toBe(1);
    expect(arg.type).toBe("NEW_MESSAGE");
    expect(arg.title).toBe("New message");
    expect(result).toEqual(sampleNotif);
  });

  it("defaults isRead to false when not provided", async () => {
    mockNotification.create.mockResolvedValue(sampleNotif);

    await createNotification(baseNotifData);

    const arg = mockNotification.create.mock.calls[0][0].data;
    expect(arg.isRead).toBe(false);
  });
});

describe("createMessageNotification", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns existing notification without creating a new one when dedupe matches", async () => {
    const existingNotif = { id: 99, ...sampleNotif };
    mockNotification.findFirst.mockResolvedValue(existingNotif);

    const result = await createMessageNotification(1, "hi", "sender", null, 5, 10);

    expect(mockNotification.findFirst).toHaveBeenCalledOnce();
    expect(mockNotification.create).not.toHaveBeenCalled();
    expect(result).toEqual(existingNotif);
  });

  it("creates notification when no duplicate exists", async () => {
    mockNotification.findFirst.mockResolvedValue(null);
    mockNotification.create.mockResolvedValue({ id: 100, ...sampleNotif });

    await createMessageNotification(1, "hi", "sender", null, 5, 10);

    expect(mockNotification.create).toHaveBeenCalledOnce();
    const arg = mockNotification.create.mock.calls[0][0].data;
    expect(arg.type).toBe("NEW_MESSAGE");
  });

  it("truncates message content that exceeds 200 characters", async () => {
    mockNotification.findFirst.mockResolvedValue(null);
    mockNotification.create.mockResolvedValue({ id: 101, ...sampleNotif });

    const longMessage = "a".repeat(250);
    await createMessageNotification(1, longMessage, "sender", null, 5, 10);

    const arg = mockNotification.create.mock.calls[0][0].data;
    expect(arg.message.length).toBeLessThanOrEqual(203); // 200 + "..."
    expect(arg.message.endsWith("...")).toBe(true);
  });
});

describe("createEnquiryNotification", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a NEW_ENQUIRY notification", async () => {
    mockNotification.findFirst.mockResolvedValue(null);
    mockNotification.create.mockResolvedValue({ id: 1, ...sampleNotif, type: "NEW_ENQUIRY" });

    await createEnquiryNotification(2, "I am interested", "Alice", null, 3, 7);

    const arg = mockNotification.create.mock.calls[0][0].data;
    expect(arg.type).toBe("NEW_ENQUIRY");
    expect(arg.userId).toBe(2);
  });
});

describe("getUnreadNotifications", () => {
  beforeEach(() => vi.clearAllMocks());

  it("queries for unread, non-dismissed notifications", async () => {
    mockNotification.findMany.mockResolvedValue([sampleNotif]);

    const result = await getUnreadNotifications(1);

    expect(mockNotification.findMany).toHaveBeenCalledOnce();
    const arg = mockNotification.findMany.mock.calls[0][0];
    expect(arg.where.userId).toBe(1);
    expect(arg.where.isRead).toBe(false);
    expect(arg.where.isDismissed).toBe(false);
    expect(result).toHaveLength(1);
  });

  it("uses default limit of 50", async () => {
    mockNotification.findMany.mockResolvedValue([]);

    await getUnreadNotifications(1);

    const arg = mockNotification.findMany.mock.calls[0][0];
    expect(arg.take).toBe(50);
  });
});

describe("getNotifications", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns paginated notifications and total count", async () => {
    mockNotification.findMany.mockResolvedValue([sampleNotif]);
    mockNotification.count.mockResolvedValue(1);

    const result = await getNotifications(1);

    expect(result.notifications).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("excludes read notifications by default", async () => {
    mockNotification.findMany.mockResolvedValue([]);
    mockNotification.count.mockResolvedValue(0);

    await getNotifications(1);

    const arg = mockNotification.findMany.mock.calls[0][0];
    expect(arg.where.isRead).toBe(false);
  });

  it("includes read notifications when includeRead is true", async () => {
    mockNotification.findMany.mockResolvedValue([]);
    mockNotification.count.mockResolvedValue(0);

    await getNotifications(1, { includeRead: true });

    const arg = mockNotification.findMany.mock.calls[0][0];
    expect(arg.where.isRead).toBeUndefined();
  });
});

describe("markNotificationAsRead", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates notification with isRead=true and readAt date", async () => {
    mockNotification.updateMany.mockResolvedValue({ count: 1 });

    await markNotificationAsRead(5, 1);

    const arg = mockNotification.updateMany.mock.calls[0][0];
    expect(arg.where.id).toBe(5);
    expect(arg.where.userId).toBe(1);
    expect(arg.data.isRead).toBe(true);
    expect(arg.data.readAt).toBeInstanceOf(Date);
  });
});

describe("markConversationNotificationsAsRead", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates all unread notifications for a conversation", async () => {
    mockNotification.updateMany.mockResolvedValue({ count: 3 });

    await markConversationNotificationsAsRead(10, 1);

    const arg = mockNotification.updateMany.mock.calls[0][0];
    expect(arg.where.conversationId).toBe(10);
    expect(arg.where.userId).toBe(1);
    expect(arg.where.isRead).toBe(false);
    expect(arg.data.isRead).toBe(true);
  });
});

describe("markAllNotificationsAsRead", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates all unread notifications for a user", async () => {
    mockNotification.updateMany.mockResolvedValue({ count: 5 });

    await markAllNotificationsAsRead(1);

    const arg = mockNotification.updateMany.mock.calls[0][0];
    expect(arg.where.userId).toBe(1);
    expect(arg.where.isRead).toBe(false);
    expect(arg.data.isRead).toBe(true);
  });
});

describe("dismissNotification", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sets isDismissed to true for the notification", async () => {
    mockNotification.updateMany.mockResolvedValue({ count: 1 });

    await dismissNotification(7, 1);

    const arg = mockNotification.updateMany.mock.calls[0][0];
    expect(arg.where.id).toBe(7);
    expect(arg.where.userId).toBe(1);
    expect(arg.data.isDismissed).toBe(true);
  });
});

describe("getNotificationCounts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns totals and counts broken down by type", async () => {
    mockNotification.count.mockResolvedValue(3);
    mockNotification.groupBy.mockResolvedValue([
      { type: "NEW_MESSAGE", _count: 2 },
      { type: "NEW_ENQUIRY", _count: 1 },
    ]);

    const result = await getNotificationCounts(1);

    expect(result.total).toBe(3);
    expect(result.newMessages).toBe(2);
    expect(result.newEnquiries).toBe(1);
    expect(result.enquiryReplies).toBe(0);
    expect(result.listingUpdates).toBe(0);
    expect(result.system).toBe(0);
  });

  it("returns zero counts when no notifications exist", async () => {
    mockNotification.count.mockResolvedValue(0);
    mockNotification.groupBy.mockResolvedValue([]);

    const result = await getNotificationCounts(1);

    expect(result.total).toBe(0);
    expect(result.byType).toEqual({});
  });
});
