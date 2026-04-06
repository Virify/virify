import { describe, it, expect, beforeEach, vi } from "vitest";
import { createConversation, getConversation, replyToConversation } from "../server/utils/conversation";

// ──────────────────────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────────────────────

const mockCreate = vi.hoisted(() => vi.fn());
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockFindFirst = vi.hoisted(() => vi.fn());
const mockMessageCreate = vi.hoisted(() => vi.fn());
const mockTransaction = vi.hoisted(() => vi.fn());

vi.mock("../server/utils/prisma-client", () => ({
  prisma: {
    conversation: {
      create: mockCreate,
      findUnique: mockFindUnique,
      findFirst: mockFindFirst,
    },
    message: {
      create: mockMessageCreate,
    },
    $transaction: mockTransaction,
  },
}));

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

const minimalUser = (id: number) => ({ id, username: `user${id}`, avatar: null });

const minimalConversation = {
  id: 1,
  listingId: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  messages: [],
  sender: minimalUser(1),
  receiver: minimalUser(2),
};

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

describe("createConversation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls prisma.conversation.create with sender, receiver and message", async () => {
    mockCreate.mockResolvedValue(minimalConversation);

    const result = await createConversation(1, 2, "Hello there");

    expect(mockCreate).toHaveBeenCalledOnce();
    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data.sender.connect.id).toBe(1);
    expect(callArg.data.receiver.connect.id).toBe(2);
    expect(callArg.data.messages.create.content).toBe("Hello there");
    expect(result).toEqual(minimalConversation);
  });

  it("includes listing connect when listingId is provided", async () => {
    mockCreate.mockResolvedValue({ ...minimalConversation, listingId: 99 });

    await createConversation(1, 2, "About your property", 99);

    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data.listing.connect.id).toBe(99);
  });

  it("does not include listing connect when listingId is omitted", async () => {
    mockCreate.mockResolvedValue(minimalConversation);

    await createConversation(1, 2, "General enquiry");

    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data.listing).toBeUndefined();
  });
});

describe("getConversation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns conversation data from prisma", async () => {
    mockFindUnique.mockResolvedValue(minimalConversation);

    const result = await getConversation(1);

    expect(mockFindUnique).toHaveBeenCalledOnce();
    expect(mockFindUnique.mock.calls[0][0].where.id).toBe(1);
    expect(result).toEqual(minimalConversation);
  });

  it("returns null when conversation does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await getConversation(999);

    expect(result).toBeNull();
  });
});

describe("replyToConversation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("delegates work to prisma.$transaction", async () => {
    const expectedMessage = {
      id: 10,
      conversationId: 1,
      senderId: 2,
      receiverId: 1,
      content: "My reply",
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: minimalUser(2),
      receiver: minimalUser(1),
    };

    mockTransaction.mockImplementation(async (fn: Function) => fn({
      conversation: {
        findUnique: vi.fn().mockResolvedValue({
          ...minimalConversation,
          sender: minimalUser(1),
          receiver: minimalUser(2),
        }),
      },
      message: {
        create: vi.fn().mockResolvedValue(expectedMessage),
      },
    }));

    const result = await replyToConversation(1, "My reply", 2);

    expect(mockTransaction).toHaveBeenCalledOnce();
    expect(result).toEqual(expectedMessage);
  });

  it("throws when conversation is not found inside transaction", async () => {
    mockTransaction.mockImplementation(async (fn: Function) => fn({
      conversation: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      message: { create: vi.fn() },
    }));

    await expect(replyToConversation(999, "test", 1)).rejects.toThrow("999");
  });
});
