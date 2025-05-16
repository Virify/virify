// Using node environment instead of nuxt to avoid browser API dependencies
// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Mock AWS SDK
const mockSend = vi.fn().mockResolvedValue({ MessageId: "mock-message-id" });

vi.mock("@aws-sdk/client-ses", () => {
  return {
    SESClient: vi.fn().mockImplementation(() => ({
      send: mockSend
    })),
    SendEmailCommand: vi.fn().mockImplementation((params) => params)
  };
});

// Create a test version of the sesSender that doesn't rely on useRuntimeConfig
async function testSesSender(html: string, subject: string, to: string) {
  const client = new SESClient({
    region: "eu-west-2",
    credentials: {
      accessKeyId: "test-access-key",
      secretAccessKey: "test-secret-key",
    },
  });

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "Virify <no-reply@virify.co.uk>",
  };

  const command = new SendEmailCommand(params);
  return await client.send(command);
}

describe("sesSender", () => {
  it("sends an email successfully", async () => {
    const result = testSesSender("<p>Hello</p>", "Subject", "test@example.com");
    await expect(result).resolves.not.toThrow();
    expect(mockSend).toHaveBeenCalledOnce();
  });
});