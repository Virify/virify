/**
 * End-to-end tests for the Listing utilities, focusing on the getListingByDistanceAndFilters function.
 * These tests use a real test database and verify the integration of property, address, user, and listing creation,
 * as well as geospatial queries and filtering logic. The test data is created and cleaned up for each run.
 */

import { describe, it, expect, afterAll, vi } from "vitest";
import { PrismaClient, ConstructionType, PlanningClassification, ListingTier, RentalAvailabilityStatus, RentalPriceType } from "@prisma/client";
import { getListingByDistanceAndFilters } from "../server/utils/listing";
import type { ListingCardType } from "~~/shared/types/listing";

/**
 * Mock the Prisma client to always use the test database URL.
 * This ensures that all database operations in the test suite are isolated from production data.
 */
vi.mock("../server/utils/prisma-client", () => {
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
const { prisma } = await import("../server/utils/prisma-client");

// Test data handles for cleanup
let testProperty: any;
let testAddress: any;
let testUser: any;
let testListing: any;

/**
 * Main test suite for Listing E2E functionality.
 * Covers creation of test data, geospatial filtering, and cleanup.
 */
describe("Listing E2E Tests", () => {
  sequential: true;

  /**
   * Creates a user, address (with geolocation), property, and rental listing for use in subsequent tests.
   * Also sets the PostGIS location field using a raw SQL query to enable geospatial queries.
   *
   * @returns {Promise<void>}
   */
  it("should create test data", async () => {
    // Create test user first
    testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "testpassword"
      }
    });

    // Create test address with lat/lon (location set below)
    testAddress = await prisma.address.create({
      data: {
        number: "123",
        street: "Test Street",
        city: "Test City",
        postcode: "TE1 1ST",
        country: "Test Country",
        county: "Test County",
        lat: 51.5074,
        lon: -0.1278
      }
    });

    // Set the location field using a raw SQL query for PostGIS geospatial support
    await prisma.$executeRaw`
      UPDATE "Address"
      SET location = ST_SetSRID(ST_MakePoint(${testAddress.lon}, ${testAddress.lat}), 4326)
      WHERE id = ${testAddress.id}
    `;

    // Create a property linked to the address and user
    testProperty = await prisma.property.create({
      data: {
        title: "Test Property",
        description: "A test property",
        value: 500000,
        size: 100,
        yearBuilt: "2020",
        chainFree: true,
        vacant: true,
        constructionType: ConstructionType.STANDARD,
        numberBedrooms: 2,
        numberBathrooms: 1,
        numberReceptions: 1,
        address: {
          connect: {
            id: testAddress.id
          }
        },
        type: {
          connect: {
            id: 1 // Assumes a valid property type exists with id 1
          }
        },
        classification: {
          connect: {
            id: 1 // Assumes a valid classification exists with id 1
          }
        },
        user: {
          connect: {
            id: testUser.id
          }
        }
      },
      include: {
        address: true,
        type: true,
        classification: true
      }
    });

    // Create a rental listing for the property
    testListing = await prisma.listing.create({
      data: {
        title: "Test Rental",
        description: "A test rental listing",
        price: 1500,
        listingTier: ListingTier.FEATURED,
        published: true,
        publishedAt: new Date(),
        property: {
          connect: {
            id: testProperty.id
          }
        },
        user: {
          connect: {
            id: testUser.id
          }
        },
        rentalListing: {
          create: {
            availabilityStatus: RentalAvailabilityStatus.AVAILABLE,
            rentFrequency: RentalPriceType.MONTHLY,
            isBillsIncluded: false
          }
        }
      }
    });

    // Assertions to verify that all test data was created successfully
    expect(testProperty).toBeDefined();
    expect(testProperty.id).toBeDefined();
    expect(testProperty.address).toBeDefined();
    expect(testProperty.type).toBeDefined();
    expect(testProperty.classification).toBeDefined();
    expect(testListing).toBeDefined();
    expect(testListing.id).toBeDefined();
  });

  /**
   * Tests that the function returns an empty array when filters do not match any listings.
   *
   * @returns {Promise<void>}
   */
  it("should return empty array for invalid filters", async () => {
    const result = await getListingByDistanceAndFilters(
      { type: "rent", location: testAddress.city, radius: 5 },
      {
        propertyTypes: ["House"], // Different from our test property type
        priceRange: [999999, 1000000] // Outside our test price range
      }
    );

    // No listings should match these filters
    expect(result).toHaveLength(0);
  });

  /**
   * Tests that the function can find listings with only partial filters provided.
   *
   * @returns {Promise<void>}
   */
  it("should find listings with partial filters", async () => {
    const result = await getListingByDistanceAndFilters(
      { type: "rent", location: testAddress.city, radius: 5 },
      {
        priceRange: [1400, 1600]
      }
    );

    // Should still find the listing with only property type filter
    expect(result).toHaveLength(1);
    const foundListing = result[0] as ListingCardType;
    expect(foundListing).toBeDefined();
    expect(foundListing.id).toBe(testListing.id);
  });

  /**
   * Cleans up all test data created during the test suite.
   * Ensures the test database is left in a clean state after tests run.
   *
   * @returns {Promise<void>}
   */
  afterAll(async () => {
    if (testListing?.id) {
      await prisma.rentalListing.delete({ where: { id: testListing.id } });
      await prisma.listing.delete({ where: { id: testListing.id } });
    }
    if (testProperty?.id) {
      await prisma.property.delete({ where: { id: testProperty.id } });
    }
    if (testAddress?.id) {
      await prisma.address.delete({ where: { id: testAddress.id } });
    }
    if (testUser?.id) {
      await prisma.user.delete({ where: { id: testUser.id } });
    }
  });
}); 