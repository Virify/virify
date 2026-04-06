import { describe, it, expect, vi } from "vitest";
import { verifyOtpCode, otpToString } from "../server/utils/verify-otp-code";
import validatePasswordToken from "../server/utils/validate-password-token";
import generateOtpCode from "../../../shared/utils/generate-otp-code";
import generateToken from "../../../shared/utils/generate-token";

// ──────────────────────────────────────────────────────────────────────────────
// verifyOtpCode
// ──────────────────────────────────────────────────────────────────────────────

describe("verifyOtpCode", () => {
  const futureExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  const pastExpiry = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

  const baseUser = {
    otpCode: "123456",
    otpCodeExpiry: futureExpiry,
    verification: null,
  } as any;

  it("returns true when code matches and expiry is in the future", async () => {
    expect(await verifyOtpCode(baseUser, "123456")).toBe(true);
  });

  it("returns false when code does not match", async () => {
    expect(await verifyOtpCode(baseUser, "000000")).toBe(false);
  });

  it("returns false when otpCode is null", async () => {
    const user = { ...baseUser, otpCode: null };
    expect(await verifyOtpCode(user, "123456")).toBe(false);
  });

  it("returns false when expiry is in the past", async () => {
    const user = { ...baseUser, otpCodeExpiry: pastExpiry };
    expect(await verifyOtpCode(user, "123456")).toBe(false);
  });

  it("returns true when otpCodeExpiry is null (no expiry set)", async () => {
    const user = { ...baseUser, otpCodeExpiry: null };
    expect(await verifyOtpCode(user, "123456")).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// otpToString
// ──────────────────────────────────────────────────────────────────────────────

describe("otpToString", () => {
  it("joins array of digits into a single string", () => {
    expect(otpToString(["1", "2", "3", "4", "5", "6"])).toBe("123456");
  });

  it("handles single-element array", () => {
    expect(otpToString(["9"])).toBe("9");
  });

  it("returns empty string for empty array", () => {
    expect(otpToString([])).toBe("");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// validatePasswordToken (default export)
// ──────────────────────────────────────────────────────────────────────────────

describe("validatePasswordToken", () => {
  const futureExpiry = new Date(Date.now() + 60 * 60 * 1000);
  const pastExpiry = new Date(Date.now() - 60 * 60 * 1000);

  it("returns true when token exists and expiry is in the future", () => {
    const user = { passwordResetToken: "abc123", passwordResetTokenExpiry: futureExpiry } as any;
    expect(validatePasswordToken(user)).toBe(true);
  });

  it("returns false when token is null", () => {
    const user = { passwordResetToken: null, passwordResetTokenExpiry: futureExpiry } as any;
    expect(validatePasswordToken(user)).toBe(false);
  });

  it("returns false when expiry is in the past", () => {
    const user = { passwordResetToken: "abc123", passwordResetTokenExpiry: pastExpiry } as any;
    expect(validatePasswordToken(user)).toBe(false);
  });

  it("returns true when token exists and expiry is null (no expiry set)", () => {
    const user = { passwordResetToken: "abc123", passwordResetTokenExpiry: null } as any;
    expect(validatePasswordToken(user)).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// generateOtpCode
// ──────────────────────────────────────────────────────────────────────────────

describe("generateOtpCode", () => {
  it("returns a string of exactly 6 digits by default", () => {
    const otp = generateOtpCode();
    expect(typeof otp).toBe("string");
    expect(otp).toHaveLength(6);
    expect(/^\d+$/.test(otp)).toBe(true);
  });

  it("returns a string of the requested length", () => {
    const otp = generateOtpCode(4);
    expect(otp).toHaveLength(4);
    expect(/^\d+$/.test(otp)).toBe(true);
  });

  it("pads with leading zeros to reach requested length", () => {
    // All returned values should be exactly `len` characters
    for (let i = 0; i < 10; i++) {
      const otp = generateOtpCode(6);
      expect(otp).toHaveLength(6);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// generateToken
// ──────────────────────────────────────────────────────────────────────────────

describe("generateToken", () => {
  it("returns a 40-character hexadecimal string", () => {
    const token = generateToken();
    expect(typeof token).toBe("string");
    expect(token).toHaveLength(40);
    expect(/^[0-9a-f]+$/i.test(token)).toBe(true);
  });

  it("returns a different token on each call", () => {
    const t1 = generateToken();
    const t2 = generateToken();
    expect(t1).not.toBe(t2);
  });
});
