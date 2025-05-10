/**
 * End-to-end tests for user-related functions in the auth layer.
 * These tests interact with a real database to verify the complete flow of user operations.
 * Uses a test database URL for isolation from production data.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { PrismaClient, Reviewed } from "@prisma/client";

// Mock the Prisma client to always use the test database URL
vi.mock("../../database/server/utils/prisma-client", () => {
  const testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });
  return { prisma: testPrisma };
});

// Import prisma from the mocked module
const { prisma } = await import("../../database/server/utils/prisma-client");

import {
  findUser,
  findFirstUser,
  finduUserWithVerification,
  findUserByActivationToken,
  findUserByPasswordToken,
  updateUserByToken,
  findUserByToken,
  createUserWithTokens,
  isActive,
} from "../../database/server/utils/user";

let testUser: any;
let userActivationToken: string;
let resetToken: string;
let testPassword: string;
let otpCode: string;

/**
 * End-to-end tests for user-related functions in the auth layer.
 * These tests interact with a real database to verify the complete flow of user operations.
 * Uses a test database URL for isolation from production data.
 */

/**
 * Setup: Creates a test user before running any tests.
 * This ensures we have a known state to test against.
 */
beforeAll(async () => {
  // global tokens
  userActivationToken = "user-activation-token";
  resetToken = "reset-token";
  testPassword = "new-password";
  otpCode = "123456";

  // Clean up any existing test data
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // Create a test user with all required fields
  testUser = await prisma.user.create({
    data: {
      email: "test-user@example.com",
      password: "hashed-password",
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      phoneNumber: "1234567890",
      passwordResetToken: resetToken,
      passwordResetTokenExpiry: new Date(Date.now() + 3600000),
      otpCode: otpCode,
      otpCodeExpiry: new Date(Date.now() + 3600000),
      createdAt: new Date(),
      updatedAt: new Date(),
      verification: {
        create: {
          activationToken: userActivationToken,
          activationTokenExpiry: new Date(Date.now() + 3600000),
          reviewed: Reviewed.PENDING,
          activated: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    include: {
      verification: true,
    },
  });
});

/**
 * Cleanup: Removes all test data after tests complete.
 * This ensures the test database remains clean for future test runs.
 */
afterAll(async () => {
  // Clean up test data
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

/**
 * Test suite for user-related E2E tests.
 * Tests cover the complete flow of user operations with a real database.
 */
describe("user functions E2E", () => {
  /**
   * Tests the findUser function's ability to locate a user by email in the database.
   * Verifies that the correct user is returned with all their data.
   */
  it("should find user by email", async () => {
    const found = await findUser(testUser.email);
    expect(found?.email).toBe(testUser.email);
  });

  /**
   * Tests the findFirstUser function's ability to retrieve the first user from the database.
   * Verifies that a user is returned and contains the expected data.
   */
  it("should find the first user", async () => {
    const found = await findFirstUser();
    expect(found).toBeDefined();
    expect(found?.email).toBe(testUser.email);
  });

  /**
   * Tests the finduUserWithVerification function's ability to find a user with their verification data.
   * Verifies that both user and verification data are returned correctly.
   */
  it("should find user with verification by email", async () => {
    const found = await finduUserWithVerification(testUser.email);
    expect(found?.email).toBe(testUser.email);
    expect(found?.verification).toBeDefined();
  });

  /**
   * Tests the findUserByActivationToken function's ability to find a user by their activation token.
   * Verifies that the correct user is returned when a valid token is provided.
   */
  it("should find user by activation token", async () => {
    const found = await findUserByActivationToken(userActivationToken);
    expect(found?.verification?.activationToken).toBe(userActivationToken);
  });

  it('should return a otp code', async () => {
    const found = await finduUserWithVerification(testUser.email);
    expect(found?.otpCode).toBe(otpCode);
  });

  /**
   * Tests the findUserByPasswordToken function's ability to find a user by their password reset token.
   * Verifies that the correct user is returned when a valid token is provided.
   */
  it("should find user by password reset token", async () => {
    const updateduser = await findUserByPasswordToken(resetToken);
    expect(updateduser?.email).toBe(testUser.email);
    expect(updateduser?.passwordResetToken).toBe(resetToken);
  });

  /**
   * Tests the updateUserByToken function's ability to update a user's password using their reset token.
   * Verifies that the password is updated and reset token fields are cleared.
   */
  it("should update user's password by token", async () => {
    const updateduser = await updateUserByToken(resetToken, testPassword);
    expect(updateduser?.password).toBe(testPassword);
    expect(updateduser?.passwordResetToken).toBeNull();
    expect(updateduser?.passwordResetTokenExpiry).toBeNull();
  });

  /**
   * Tests the findUserByToken function's ability to find a user by their token.
   * Verifies that the correct user is returned when a valid token is provided.
   */
  it("should find user by valid token", async () => {
    const found = await findUserByToken(userActivationToken);
    expect(found?.email).toBe(testUser.email);
    expect(found?.verification?.activationToken).toBe(userActivationToken);
  });

  /**
   * Tests the createUserWithTokens function's ability to create a new user with activation tokens.
   * Verifies that the user is created with the correct data and tokens.
   */
  it("should create user with token", async () => {
    const email = "new-user@example.com";
    const token = "new-activation-token";
    const otpCode = "654321";
    const newUser = await createUserWithTokens(email, token, otpCode);
    expect(newUser.email).toBe(email);
    expect(newUser.verification?.activationToken).toBe(token);
    expect(newUser.otpCode).toBe(otpCode);
  });

  /**
   * Tests the isActive function's ability to check a user's activation status.
   * Verifies that it correctly identifies both active and inactive users.
   */
  it("should check if user is active", () => {
    expect(isActive(testUser)).toBe(false);
    
    // Activate the user
    testUser.verification.activated = true;
    expect(isActive(testUser)).toBe(true);
  });
}); 