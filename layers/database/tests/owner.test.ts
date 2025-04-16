import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { PrismaClient, OwnerRole, Reviewed } from "@prisma/client";
import {
  findOwner,
  findFirstOwner,
  findOwnerWithVerification,
  findOwnerByActivationToken,
  findOwnerByPasswordToken,
  updateOwnerByToken,
  updateOwnerByEmailPasswordReset,
  findOwnerByToken,
  findBusinessOwner,
  findAgent,
  deleteOwner,
  createOwnerWithToken,
  createBusinessOwnerWithToken,
  updateOwnerToken,
  updateOwnerAndActivate,
  updateOwnerAndReview,
  hasRole,
  isActive,
} from "../server/utils/owner";

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

let testOwner: any;
let testAgent: any;
let ownerActivationToken: string;
let agentActivationToken: string;
let resetToken: string;
let testPassword: string;

/**
 * Create a test owner and agent before all tests
 */
beforeAll(async () => {
  // global tokens
  ownerActivationToken = "owner-activation-token";
  agentActivationToken = "agent-activation-token";
  resetToken = "reset-token";
  testPassword = "new-password";

  const { prisma } = await import("../server/utils/prisma-client");
  testOwner = await prisma.owner.create({
    data: {
      email: "test-owner@example.com",
      role: OwnerRole.USER,
      passwordResetToken: resetToken,
      verification: {
        create: {
          activationToken: ownerActivationToken,
        },
      },
    },
    include: {
      verification: true,
    },
  });

  testAgent = await prisma.owner.create({
    data: {
      email: "test-agent@example.com",
      role: OwnerRole.AGENT,
      verification: {
        create: {
          activationToken: agentActivationToken,
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
  await prisma.owner.deleteMany();
});

/**
 * Test suite for owner functions
 */
describe("owner functions", () => {
  it("should find owner by email", async () => {
    const found = await findOwner(testOwner.email);
    expect(found?.email).toBe(testOwner.email);
  });

  it("should find the first owner", async () => {
    const found = await findFirstOwner();
    expect(found).toBeDefined();
  });

  it("should find owner with verification by email", async () => {
    const found = await findOwnerWithVerification(testOwner.email);
    expect(found?.email).toBe(testOwner.email);
    expect(found?.verification).toBeDefined();
  });

  it("should fail to find owner by activation token when no token is matched", async () => {
    const token = "test-token";
    const found = await findOwnerByActivationToken(token);
    expect(found).toBeNull();
  });

  it("should find owner by activation token", async () => {
    const found = await findOwnerByActivationToken(ownerActivationToken);
    expect(found?.email).toBe(testOwner.email);
    expect(found?.verification?.activationToken).toBe(ownerActivationToken);
  });

  it("should fail to find owner by password reset token", async () => {
    const token = "non-existent-token";
    const found = await findOwnerByPasswordToken(token);
    expect(found).toBeNull();
  });

  it("Should find owner with active password reset token", async () => {
    // Now, try to update the password using the token
    const updatedOwner = await findOwnerByPasswordToken(resetToken);

    // Validate that the updated owner exists
    expect(updatedOwner).toBeDefined();
    expect(updatedOwner?.email).toBe(testOwner.email);
    expect(updatedOwner?.passwordResetToken).toBe(resetToken);
  });

  it("should update owner's password by token", async () => {
    const updatedOwner = await updateOwnerByToken(resetToken, testPassword);
    expect(updatedOwner?.password).toBe(testPassword);
    expect(updatedOwner?.passwordResetToken).toBeNull();
    expect(updatedOwner?.passwordResetTokenExpiry).toBeNull();
  });

  it("should update owner's password reset token by email", async () => {
    const updatedOwner = await updateOwnerByEmailPasswordReset(testOwner.email, resetToken);
    expect(updatedOwner.passwordResetToken).toBe(resetToken);
  });

  it("should fail to find owner by token", async () => {
    const token = "no-match-token";
    const found = await findOwnerByToken(token);
    expect(found).toBeNull();
  });

  it("should find owner by valid token", async () => {
    const found = await findOwnerByToken(ownerActivationToken);
    expect(found?.email).toBe(testOwner.email);
  });

  it("should find business owner by email or address", async () => {
    const found = await findBusinessOwner(testOwner.email, "123 Test Address");
    expect(found?.email).toBe(testOwner.email);
  });

  it("should find agent by email or owner role", async () => {
    const found = await findAgent(testAgent.email);
    expect(found?.email).toBe(testAgent.email);
  });

  it("should delete owner by ID", async () => {
    const { prisma } = await import("../server/utils/prisma-client");
    const testOwner = await prisma.owner.create({
      data: {
        email: "delete@example.com",
        role: OwnerRole.USER,
      },
    });
    const deletedOwner = await deleteOwner(testOwner.id);
    expect(deletedOwner.id).toBe(testOwner.id);
  });

  it("should create owner with token", async () => {
    const email = "new-owner@example.com";
    const token = "new-activation-token";
    const newOwner = await createOwnerWithToken(email, token);
    expect(newOwner.email).toBe(email);
    expect(newOwner.verification?.activationToken).toBe(token);
  });

  it("should create business owner with token", async () => {
    const newOwner = await createBusinessOwnerWithToken("business-owner@example.com", "Business Inc.", "John Doe", "123 Business St", "City", "County", "Country", "12345", "123456789", "review-token");
    expect(newOwner?.email).toBe("business-owner@example.com");
  });

  it("should update owner's activation token by email", async () => {
    const token = "random-token-activation-token";
    const updatedOwner = await updateOwnerToken(testOwner.email, token);
    expect(updatedOwner.verification?.activationToken).toBe(token);
  });

  it("should update owner and activate", async () => {
    const updatedOwner = await updateOwnerAndActivate(testOwner.id, "new-password");
    expect(updatedOwner.verification?.activated).toBe(true);
  });

  it("should update owner and review", async () => {
    const approval = Reviewed.PENDING;
    const token = "review-token";
    const updatedOwner = await updateOwnerAndReview(testOwner.id, approval, token);
    expect(updatedOwner.verification?.reviewed).toBe(approval);
  });

  it("should check owner role", () => {
    const result = hasRole(testOwner, OwnerRole.USER);
    expect(result).toBe(true);
  });

  it("should check agent role", () => {
    const result = hasRole(testAgent, OwnerRole.AGENT);
    expect(result).toBe(true);
  });

  it("should check if owner is active", () => {
    const result = isActive(testOwner);
    expect(result).toBe(false);
  });
});
