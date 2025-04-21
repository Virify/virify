import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { PrismaClient, Reviewed } from "@prisma/client";
import {
  findUser,
  findFirstUser,
  finduUserWithVerification,
  findUserByActivationToken,
  findUserByPasswordToken,
  updateUserByToken,
  findUserByToken,
  deleteUser,
  createUserWithTokens,
  updateUserTokens,
  updateuUserAndActivate,
  updateUserAndReview,
  isActive,
} from "../server/utils/user";

vi.mock("../server/utils/prisma-client", () => {
  const testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  return {
    prisma: testPrisma,
  };
});

let testUser: any;
let userActivationToken: string;
let resetToken: string;
let testPassword: string;
let otpCode: string;

/**
 * Create a test owner and agent before all tests
 */
beforeAll(async () => {
  // global tokens
  userActivationToken = "owner-activation-token";
  resetToken = "reset-token";
  testPassword = "new-password";
  otpCode = "123456";

  const { prisma } = await import("../server/utils/prisma-client");
  testUser = await prisma.user.create({
    data: {
      email: "test-owner@example.com",
      passwordResetToken: resetToken,
      otpCode: otpCode,
      verification: {
        create: {
          activationToken: userActivationToken,
        },
      },
    },
    include: {
      verification: true,
    },
  });
});

/**
 * Clean up test data
 */
afterAll(async () => {
  // Clean up test data
  const { prisma } = await import("../server/utils/prisma-client");
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
});

/**
 * Test suite for owner functions
 */
describe("owner functions", () => {
  it("should find owner by email", async () => {
    const found = await findUser(testUser.email);
    expect(found?.email).toBe(testUser.email);
  });

  it("should find the first owner", async () => {
    const found = await findFirstUser();
    expect(found).toBeDefined();
  });

  it("should find owner with verification by email", async () => {
    const found = await finduUserWithVerification(testUser.email);
    expect(found?.email).toBe(testUser.email);
  });

  it("should fail to find owner by activation token when no token is matched", async () => {
    const token = "test-token";
    const found = await findUserByActivationToken(token);
    expect(found).toBeNull();
  });

  it("should find owner by activation token", async () => {
    const found = await findUserByActivationToken(userActivationToken);
    expect(found?.verification?.activationToken).toBe(userActivationToken);
  });

  it('should return a otp code', async () => {
    const found = await finduUserWithVerification(testUser.email);
    expect(found?.otpCode).toBe(otpCode);
  });

  it("should fail to find owner by password reset token", async () => {
    const token = "non-existent-token";
    const found = await findUserByPasswordToken(token);
    expect(found).toBeNull();
  });

  it("Should find owner with active password reset token", async () => {
    const updatedOwner = await findUserByPasswordToken(resetToken);
    expect(updatedOwner?.email).toBe(testUser.email);
  });

  it("should update owner's password by token", async () => {
    const updatedOwner = await updateUserByToken(resetToken, testPassword);
    expect(updatedOwner?.password).toBe(testPassword);
  });

  it("should fail to find owner by token", async () => {
    const token = "no-match-token";
    const found = await findUserByToken(token);
    expect(found).toBeNull();
  });

  it("should find owner by valid token", async () => {
    const found = await findUserByToken(userActivationToken);
    expect(found?.email).toBe(testUser.email);
  });


  it("should delete owner by ID", async () => {
    const { prisma } = await import("../server/utils/prisma-client");
    const testOwner = await prisma.user.create({
      data: {
        email: "delete@example.com",
      },
    });
    const deletedUser = await deleteUser(testUser.id);
    expect(deletedUser.id).toBe(testUser.id);
  });

  it("should create owner with token", async () => {
    const email = "new-owner@example.com";
    const token = "new-activation-token";
    const otpCode = "654321";
    const newUser = await createUserWithTokens(email, token, otpCode);
    expect(newUser.verification?.activationToken).toBe(token);
  });

  it("should check if owner is active", () => {
    const result = isActive(testUser);
    expect(result).toBe(false);
  });
});
