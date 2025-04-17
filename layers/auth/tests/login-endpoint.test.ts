import { setup, $fetch } from "@nuxt/test-utils";
import { describe, expect, it } from "vitest";

/**
 * This work - but takes ages for the server to spin up
 * Seems like you need seperate test files for unit/E2E tests with no explanation or docs..
 * This is probably not worth the effort providing unit tests are good enough
 */
describe("POST /auth/login", async () => {
  await setup({
    server: true,
  });

  it("returns 400 for invalid input", async () => {
    await expect(
      $fetch("/auth/login", {
        method: "POST",
        body: {
          email: "bademail",
          password: "short",
        },
      })
    ).rejects.toThrow(/400/);
  });
});