import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { PrismaClient, OwnerRole } from '@prisma/client';
import { findOwner } from '../server/utils/owner';

vi.mock('../server/utils/prisma-client', () => {
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

/**
 * Create a test user before all tests
 */
beforeAll(async () => {
  const { prisma } = await import('../server/utils/prisma-client');  
  testOwner = await prisma.owner.create({
    data: {
      email: 'test-owner@example.com',
      role: OwnerRole.USER, 
    },
  });
});

/**
 * Clean up test data
 */
afterAll(async () => {
  // Clean up test data
  const { prisma } = await import('../server/utils/prisma-client');
  await prisma.owner.delete({ where: { id: testOwner.id } });
});

/**
 * Test suite for owner functions
 */
describe('owner functions', () => {
  it('should find owner by email', async () => {
    // Test the findOwner function with the created test user
    const found = await findOwner(testOwner.email);
    expect(found?.email).toBe(testOwner.email);  // Validate that the email matches
  });
});
