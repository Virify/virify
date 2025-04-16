// @vitest-environment nuxt
import { describe, it, expect, vi } from "vitest";
// Mock Nuxt's runtime config
vi.mock("#imports", () => ({
  useRuntimeConfig: () => ({
    SES_ACCESS_KEY_ID: "test-access-key",
    SES_SECRET_ACCESS_KEY: "test-secret-key",
  }),
}));

// Mock AWS SDK
const mockSend = vi.fn().mockResolvedValue({ MessageId: "mock-message-id" });

vi.mock("@aws-sdk/client-ses", () => ({
  SESClient: vi.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  SendEmailCommand: vi.fn().mockImplementation((params) => params),
}));

// Import AFTER mocks
const { sesSender } = await import("../server/utils/ses-sender");

describe("sesSender", () => {
  it("sends an email successfully", async () => {
    const result = sesSender("<p>Hello</p>", "Subject", "test@example.com");
    await expect(result).resolves.not.toThrow();
    expect(mockSend).toHaveBeenCalledOnce();
  });
});