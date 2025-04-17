import { describe, expect, it } from "vitest";
import generateToken from "~~/shared/utils/generate-token";
describe("Auth Utils", () => {
  describe("generateToken", () => {
    it("should generate a token of the correct length", () => {
      const token = generateToken();
      expect(token).toHaveLength(40); // 20 bytes * 2 hex characters per byte
    });
    it("should generate a token that is a valid hex string", () => {
      const token = generateToken();
      expect(token).toMatch(/^[a-f0-9]+$/);
    });
    it("should generate a different token each time", () => {
      const token1 = generateToken();
      const token2 = generateToken();
      expect(token1).not.toEqual(token2);
    });
  });
});
