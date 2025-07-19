/**
 * Unit tests for user-related functions in the auth layer.
 * These tests use mocked Prisma client to verify the behavior of user functions
 * in isolation, without requiring a database connection.
 */

vi.mock("../../database/server/utils/prisma-client", () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      verification: {
        deleteMany: vi.fn(),
      },
    },
  };
});

import { describe, it, expect, vi, beforeEach } from "vitest";
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
  isActive,
} from "../../database/server/utils/user";
import { prisma } from "../../database/server/utils/prisma-client";
import { Reviewed } from "~~/layers/database/server/database/prisma/generated/enums";

const prismaAny = prisma as any;

/**
 * Test suite for user-related functions.
 * Tests cover user lookup, creation, updates, and verification status checks.
 */
describe("user functions", () => {
  /**
   * Mock user object used across all tests.
   * Includes all required fields for User and Verification models.
   */
  const mockUser = {
    id: 1,
    firstName: null,
    lastName: null,
    username: null,
    email: "test@example.com",
    phoneNumber: null,
    password: "hashed-password",
    passwordResetToken: "reset-token",
    passwordResetTokenExpiry: null,
    otpCode: "123456",
    otpCodeExpiry: null,
    lastLogin: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    addressId: null,
    listings: [],
    properties: [],
    favourites: [],
    verification: {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      address: null,
      userId: 1,
      estateAgentId: null,
      activationToken: "activation-token",
      identity: null,
      reviewed: Reviewed.PENDING,
      reviewToken: null,
      reviewTokenExpiry: null,
      activated: false,
      activationTokenExpiry: null,
      bank: null,
      payslip: null,
      business: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests the findUser function's ability to locate a user by email.
   * Verifies that the correct Prisma query is made and the user is returned.
   */
  it("should find user by email", async () => {
    prismaAny.user.findUnique.mockResolvedValue(mockUser);
    const found = await findUser(mockUser.email);
    expect(found).toEqual(mockUser);
    expect(prismaAny.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
  });

  /**
   * Tests the findFirstUser function's ability to retrieve the first user.
   * Verifies that the correct Prisma query is made and the user is returned.
   */
  it("should find the first user", async () => {
    prismaAny.user.findFirst.mockResolvedValue(mockUser);
    const found = await findFirstUser();
    expect(found).toEqual(mockUser);
    expect(prismaAny.user.findFirst).toHaveBeenCalled();
  });

  /**
   * Tests the finduUserWithVerification function's ability to find a user with their verification data.
   * Verifies that the correct Prisma query is made with the verification include.
   */
  it("should find user with verification by email", async () => {
    prismaAny.user.findUnique.mockResolvedValue(mockUser);
    const found = await finduUserWithVerification(mockUser.email);
    expect(found).toEqual(mockUser);
    expect(prismaAny.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUser.email },
      include: { verification: true },
    });
  });

  /**
   * Tests the findUserByActivationToken function's behavior when no matching token is found.
   * Verifies that null is returned when the token doesn't exist.
   */
  it("should fail to find user by activation token when no token is matched", async () => {
    prismaAny.user.findFirst.mockResolvedValue(null);
    const found = await findUserByActivationToken("non-existent-token");
    expect(found).toBeNull();
  });

  /**
   * Tests the findUserByActivationToken function's ability to find a user by their activation token.
   * Verifies that the correct user is returned when a valid token is provided.
   */
  it("should find user by activation token", async () => {
    prismaAny.user.findFirst.mockResolvedValue(mockUser);
    const found = await findUserByActivationToken(mockUser.verification.activationToken);
    expect(found).toEqual(mockUser);
  });

  /**
   * Tests the findUserByPasswordToken function's behavior when no matching token is found.
   * Verifies that null is returned when the token doesn't exist.
   */
  it("should fail to find user by password reset token", async () => {
    prismaAny.user.findUnique.mockResolvedValue(null);
    const found = await findUserByPasswordToken("non-existent-token");
    expect(found).toBeNull();
  });

  /**
   * Tests the findUserByPasswordToken function's ability to find a user by their password reset token.
   * Verifies that the correct user is returned when a valid token is provided.
   */
  it("should find user by password reset token", async () => {
    prismaAny.user.findUnique.mockResolvedValue(mockUser);
    const found = await findUserByPasswordToken(mockUser.passwordResetToken);
    expect(found).toEqual(mockUser);
  });

  /**
   * Tests the updateUserByToken function's ability to update a user's password using their reset token.
   * Verifies that the password is updated and reset token fields are cleared.
   */
  it("should update user's password by token", async () => {
    const newPassword = "new-password";
    const updatedUser = { ...mockUser, password: newPassword };
    prismaAny.user.update.mockResolvedValue(updatedUser);
    
    const result = await updateUserByToken(mockUser.passwordResetToken, newPassword);
    expect(result).toEqual(updatedUser);
    expect(prismaAny.user.update).toHaveBeenCalledWith({
      where: { passwordResetToken: mockUser.passwordResetToken },
      data: {
        password: newPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });
  });

  /**
   * Tests the findUserByToken function's behavior when no matching token is found.
   * Verifies that null is returned when the token doesn't exist.
   */
  it("should fail to find user by token", async () => {
    prismaAny.user.findFirst.mockResolvedValue(null);
    const found = await findUserByToken("non-existent-token");
    expect(found).toBeNull();
  });

  /**
   * Tests the findUserByToken function's ability to find a user by their token.
   * Verifies that the correct user is returned when a valid token is provided.
   */
  it("should find user by valid token", async () => {
    prismaAny.user.findFirst.mockResolvedValue(mockUser);
    const found = await findUserByToken(mockUser.verification.activationToken);
    expect(found).toEqual(mockUser);
  });

  /**
   * Tests the deleteUser function's ability to delete a user by their ID.
   * Verifies that the correct Prisma query is made and the deleted user is returned.
   */
  it("should delete user by ID", async () => {
    prismaAny.user.delete.mockResolvedValue(mockUser);
    const deletedUser = await deleteUser(mockUser.id);
    expect(deletedUser).toEqual(mockUser);
    expect(prismaAny.user.delete).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
  });

  /**
   * Tests the createUserWithTokens function's ability to create a new user with activation tokens.
   * Verifies that the user is created with the correct data and tokens.
   */
  it("should create user with token", async () => {
    const newUser = {
      email: "new@example.com",
      token: "new-token",
      otpCode: "654321",
    };
    const createdUser = {
      ...mockUser,
      email: newUser.email,
      verification: { ...mockUser.verification, activationToken: newUser.token },
    };
    prismaAny.user.create.mockResolvedValue(createdUser);

    const result = await createUserWithTokens(
      newUser.email,
      newUser.token,
      newUser.otpCode
    );
    expect(result).toEqual(createdUser);
    expect(prismaAny.user.create).toHaveBeenCalledWith({
      data: {
        email: newUser.email,
        otpCode: newUser.otpCode,
        otpCodeExpiry: expect.any(Date),
        verification: {
          create: {
            activationToken: newUser.token,
            activationTokenExpiry: expect.any(Date),
          },
        },
      },
      include: {
        verification: true,
      },
    });
  });

  /**
   * Tests the isActive function's ability to check a user's activation status.
   * Verifies that it correctly identifies both active and inactive users.
   */
  it("should check if user is active", () => {
    const activeUser = { ...mockUser, verification: { ...mockUser.verification, activated: true } };
    expect(isActive(activeUser)).toBe(true);
    expect(isActive(mockUser)).toBe(false);
  });
}); 