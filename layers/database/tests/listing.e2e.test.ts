/**
 * End-to-end tests for the Listing utilities, focusing on the getListingByDistanceAndFilters function.
 * as well as geospatial queries and filtering logic. The test data is created and cleaned up for each run.
 */

import { describe, it, expect, afterAll, afterEach, beforeAll, vi } from "vitest";
import { 
  PrismaClient, 
  ConstructionType, 
  ListingTier, 
  RentalAvailabilityStatus, 
  RentalPriceType,
  SaleAvailabilityStatus,
  SalePriceType
} from "@prisma/client";
import { 
  getListingByDistanceAndFilters, 
  getFullListingById,
} from "../server/utils/listing";
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
let testAddress2: any;
let testUser: any;
let testRentalListing: any;
let testSaleListing: any;
let testProperty2: any;
let testPropertyType1: any;
let testPropertyType2: any;
let testClassification1: any;
let testClassification2: any;

/**
 * Main test suite for Listing E2E functionality.
 * Covers creation of test data, geospatial filtering, and cleanup.
 */
describe("Listing E2E Tests", () => {
  sequential: true;
  
  // No beforeAll needed - afterAll should handle all cleanup

  /**
   * Creates test data for both rental and sale listings to support comprehensive testing
   * of all listing-related functionality.
   *
   * @returns {Promise<void>}
   */
  it("should create test data for rental and sale listings", async () => {
    // Create property types and classifications first
    // Generate unique names with timestamp to avoid unique constraint violations
    const timestamp = Date.now();
    
    testPropertyType1 = await prisma.propertyType.create({
      data: {
        name: `Test Property Type 1 ${timestamp}`,
        defaultSelected: true,
        classifications: {
          create: {
            name: `Test Classification 1 ${timestamp}`
          }
        }
      },
      include: {
        classifications: true
      }
    });
    
    testClassification1 = testPropertyType1.classifications[0];
    
    testPropertyType2 = await prisma.propertyType.create({
      data: {
        name: `Test Property Type 2 ${timestamp}`,
        defaultSelected: true,
        classifications: {
          create: {
            name: `Test Classification 2 ${timestamp}`
          }
        }
      },
      include: {
        classifications: true
      }
    });
    
    testClassification2 = testPropertyType2.classifications[0];

    // Create test user with more details to meet schema requirements
    
      testUser = await prisma.user.create({
        data: {
          email: `test${Date.now()}@example.com`, // Make email unique
          password: "testpassword",
          firstName: "Test",
          lastName: "User",
          phoneNumber: "01234567890",
        }
      });

    // Create test address with lat/lon for rental property
    const addressTimestamp = Date.now();
    testAddress = await prisma.address.create({
      data: {
      number: "123",
      street: `Test Street ${addressTimestamp}`, // Make street unique
      city: `Test City ${addressTimestamp}`, // Make city unique 
      postcode: `TE${addressTimestamp}`, // Make postcode unique
      country: "Test Country",
      county: "Test County",
      fullAddress: `Test Street ${addressTimestamp}, Test City ${addressTimestamp}, TE${addressTimestamp}, Test Country`,
      lat: 51.5074, // London coordinates
      lon: -0.1278
      }
    });

    // Set the location field using a raw SQL query for PostGIS geospatial support
    try {
      await prisma.$executeRaw`
        UPDATE "Address"
        SET location = ST_SetSRID(ST_MakePoint(${testAddress.lon}, ${testAddress.lat}), 4326)
        WHERE id = ${testAddress.id}
      `;
    } catch (error) {
      console.warn('Warning: Could not set PostGIS location for first address. Tests might still work, but geospatial queries may not be accurate.', error);
    }

    // Create a second address at a specific distance away (about 2 miles from the first)
    const address2Timestamp = Date.now() + 1;
    testAddress2 = await prisma.address.create({
      data: {
        number: "456",
        street: `Another Street ${address2Timestamp}`, // Make street unique
        city: `Test City ${address2Timestamp}`, // Make city unique
        postcode: `TE${address2Timestamp}`, // Make postcode unique
        country: "Test Country",
        county: "Test County",
        lat: 51.5300, // ~2 miles from first address
        lon: -0.1550
      }
    });

    // Set the location field for second address
    try {
      await prisma.$executeRaw`
        UPDATE "Address"
        SET location = ST_SetSRID(ST_MakePoint(${testAddress2.lon}, ${testAddress2.lat}), 4326)
        WHERE id = ${testAddress2.id}
      `;
    } catch (error) {
      console.warn('Warning: Could not set PostGIS location for second address. Tests might still work, but geospatial queries may not be accurate.', error);
    }

    // Create a property for rental listing
    testProperty = await prisma.property.create({
      data: {
        title: "Test Rental Property",
        description: "A test property for rental",
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
            id: testPropertyType1.id
          }
        },
        classification: {
          connect: {
            id: testClassification1.id
          }
        },
      },
      include: {
        address: true,
        type: true,
        classification: true
      }
    });

    // Create a second property for sale listing
    testProperty2 = await prisma.property.create({
      data: {
        title: "Test Sale Property",
        description: "A test property for sale",
        value: 750000,
        size: 150,
        yearBuilt: "2018",
        chainFree: true,
        vacant: false,
        constructionType: ConstructionType.STANDARD,
        numberBedrooms: 3,
        numberBathrooms: 2,
        numberReceptions: 2,
        address: {
          connect: {
            id: testAddress2.id
          }
        },
        type: {
          connect: {
            id: testPropertyType2.id
          }
        },
        classification: {
          connect: {
            id: testClassification2.id
          }
        },
      },
      include: {
        address: true,
        type: true,
        classification: true
      }
    });

    // Create a rental listing for the first property
    testRentalListing = await prisma.listing.create({
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
        rentalListing: {
          create: {
            availabilityStatus: RentalAvailabilityStatus.AVAILABLE,
            rentFrequency: RentalPriceType.MONTHLY,
            isBillsIncluded: false
          }
        }
      }
    });

    // Create a sale listing for the second property
    testSaleListing = await prisma.listing.create({
      data: {
        title: "Test Sale",
        description: "A test sale listing",
        price: 750000,
        listingTier: ListingTier.BASIC, // Not featured
        published: true,
        publishedAt: new Date(),
        property: {
          connect: {
            id: testProperty2.id
          }
        },
        saleListing: {
          create: {
            availabilityStatus: SaleAvailabilityStatus.AVAILABLE,
            priceType: SalePriceType.FIXED,
            chain: false,
            tenureType: "FREEHOLD"
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
    expect(testRentalListing).toBeDefined();
    expect(testRentalListing.id).toBeDefined();
    
    expect(testProperty2).toBeDefined();
    expect(testProperty2.id).toBeDefined();
    expect(testSaleListing).toBeDefined();
    expect(testSaleListing.id).toBeDefined();
  });

  /**
   * Tests that the function returns an empty array when filters do not match any listings.
   *
   * @returns {Promise<void>}
   */
  it("should return empty array for invalid filters", async () => {
    if (!testAddress || !testRentalListing) {
      console.warn('Test address or listing not set up correctly, skipping test');
      return;
    }
    
    const result = await getListingByDistanceAndFilters(
      { 
        type: "rent", 
        coordinates: { lat: testAddress.lat, lon: testAddress.lon },
        radius: 5 
      },
      {
        propertyTypes: { "999": [] }, // Invalid property type ID
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
    if (!testAddress || !testRentalListing) {
      console.warn('Test address or listing not set up correctly, skipping test');
      return;
    }
    
    const result = await getListingByDistanceAndFilters(
      { 
        type: "rent", 
        coordinates: { lat: testAddress.lat, lon: testAddress.lon }, 
        radius: 5 
      },
      {
        priceRange: [1400, 1600]
      }
    );

    // Should still find the listing with only property type filter
    expect(result).toHaveLength(1);
    const foundListing = result[0] as ListingCardType;
    expect(foundListing).toBeDefined();
    expect(foundListing.id).toBe(testRentalListing.id);
  });

  /**
   * Tests that the function can find sale listings with the correct filters.
   *
   * @returns {Promise<void>}
   */
  it("should find sale listings with appropriate filters", async () => {
    if (!testAddress2 || !testSaleListing) {
      console.warn('Test address or sale listing not set up correctly, skipping test');
      return;
    }
    
    const result = await getListingByDistanceAndFilters(
      { 
        type: "buy", 
        coordinates: { lat: testAddress2.lat, lon: testAddress2.lon }, 
        radius: 5 
      },
      {
        priceRange: [700000, 800000]
      }
    );

    // Should find the sale listing
    expect(result).toHaveLength(1);
    const foundListing = result[0] as ListingCardType;
    expect(foundListing).toBeDefined();
    expect(foundListing.id).toBe(testSaleListing.id);
    expect(foundListing.price).toBe(750000);
  });

  /**
   * Tests that the radius filter works correctly by restricting the search area.
   *
   * @returns {Promise<void>}
   */
  it("should filter listings by distance radius correctly", async () => {
    if (!testAddress || !testAddress2 || !testRentalListing || !testSaleListing) {
      console.warn('Test addresses or listings not set up correctly, skipping test');
      return;
    }
    
    // Using a small radius (5 mile) from the first address should only find the rental listing
    const resultSmallRadius = await getListingByDistanceAndFilters(
      { 
        type: "rent", 
        coordinates: { lat: testAddress.lat, lon: testAddress.lon }, 
        radius: 5 
      },
      {}
    );

    expect(resultSmallRadius).toHaveLength(1);
    expect(resultSmallRadius[0]).toBeDefined();
    expect(resultSmallRadius[0]?.id).toBe(testRentalListing.id);

    // Using a larger radius (5 mile) from the second address to find the sale listing
    const resultSmallRadius2 = await getListingByDistanceAndFilters(
      { 
        type: "buy", 
        coordinates: { lat: testAddress2.lat, lon: testAddress2.lon }, 
        radius: 5 
      },
      {}
    );

    expect(resultSmallRadius2).toHaveLength(1);
    expect(resultSmallRadius2[0]).toBeDefined();
    expect(resultSmallRadius2[0]?.id).toBe(testSaleListing.id);
  });

  /**
   * Tests the bedroom and bathroom filtering functionality.
   *
   * @returns {Promise<void>}
   */
  it("should filter listings by bedroom and bathroom count", async () => {
    if (!testAddress || !testAddress2 || !testRentalListing || !testSaleListing) {
      console.warn('Test addresses or listings not set up correctly, skipping test');
      return;
    }
    
    // Find rental listing with 2 bedrooms
    const rentalResult = await getListingByDistanceAndFilters(
      { 
        type: "rent", 
        coordinates: { lat: testAddress.lat, lon: testAddress.lon }, 
        radius: 5 
      },
      {
        bedrooms: [2, 2]  // Exactly 2 bedrooms
      }
    );

    expect(rentalResult).toHaveLength(1);
    expect(rentalResult[0]).toBeDefined();
    expect(rentalResult[0]?.id).toBe(testRentalListing.id);

    // Find sale listing with 3 bedrooms and 2 bathrooms
    const saleResult = await getListingByDistanceAndFilters(
      { 
        type: "buy", 
        coordinates: { lat: testAddress2.lat, lon: testAddress2.lon }, 
        radius: 5 
      },
      {
        bedrooms: [3, 3],  // Exactly 3 bedrooms
        bathrooms: [2, 2]  // Exactly 2 bathrooms
      }
    );

    expect(saleResult).toHaveLength(1);
    expect(saleResult[0]).toBeDefined();
    expect(saleResult[0]?.id).toBe(testSaleListing.id);

    // No listings with 4 bedrooms
    const noResult = await getListingByDistanceAndFilters(
      { 
        type: "buy", 
        coordinates: { lat: testAddress.lat, lon: testAddress.lon }, 
        radius: 10 
      },
      {
        bedrooms: [4, 5]  // 4-5 bedrooms (none match)
      }
    );

    expect(noResult).toHaveLength(0);
  });

  /**
   * Tests the featured filter to ensure it returns only featured listings.
   *
   * @returns {Promise<void>}
   */
  it("should filter for featured listings", async () => {
    if (!testAddress || !testAddress2 || !testRentalListing || !testSaleListing) {
      console.warn('Test addresses or listings not set up correctly, skipping test');
      return;
    }
    
    // Get the rental listing with FEATURED tier
    const rentalResults = await getListingByDistanceAndFilters(
      { 
        type: "rent", 
        coordinates: { lat: testAddress.lat, lon: testAddress.lon }, 
        radius: 10 
      },
      {}
    );
    
    expect(rentalResults).toBeDefined();
    expect(Array.isArray(rentalResults)).toBe(true);
    expect(rentalResults.length).toBeGreaterThan(0);
    
    // Find our test rental listing which should be FEATURED
    const ourFeaturedListing = rentalResults.find(listing => listing.id === testRentalListing.id);
    expect(ourFeaturedListing).toBeDefined();
    expect(ourFeaturedListing?.listingTier).toBe(ListingTier.FEATURED);
    
    // Get the sale listing with BASIC tier in a separate query
    const saleResults = await getListingByDistanceAndFilters(
      { 
        type: "buy", 
        coordinates: { lat: testAddress2.lat, lon: testAddress2.lon }, 
        radius: 10 
      },
      {}
    );
    
    // Find our test sale listing which should be BASIC
    const ourBasicListing = saleResults.find(listing => listing.id === testSaleListing.id);
    expect(ourBasicListing).toBeDefined();
    expect(ourBasicListing?.listingTier).toBe(ListingTier.BASIC);
  });

  /**
   * Tests that getFullListingById returns the correct listing with all related data.
   *
   * @returns {Promise<void>}
   */
  it("should return full listing details by ID", async () => {
    if (!testRentalListing || !testSaleListing) {
      console.warn('Test listings not set up correctly, skipping test');
      return;
    }
    
    // Get full details for the rental listing
    const rentalDetails = await getFullListingById(testRentalListing.id);
    
    expect(rentalDetails).toBeDefined();
    expect(rentalDetails?.id).toBe(testRentalListing.id);
    expect(rentalDetails?.property).toBeDefined();
    expect(rentalDetails?.rentalListing).toBeDefined();
    expect(rentalDetails?.saleListing).toBeNull();
    
    // Get full details for the sale listing
    const saleDetails = await getFullListingById(testSaleListing.id);
    
    expect(saleDetails).toBeDefined();
    expect(saleDetails?.id).toBe(testSaleListing.id);
    expect(saleDetails?.property).toBeDefined();
    expect(saleDetails?.saleListing).toBeDefined();
    expect(saleDetails?.rentalListing).toBeNull();
  });

  /**
   * Cleans up all test data created during the test suite.
   * Ensures the test database is left in a clean state after tests run.
   *
   * @returns {Promise<void>}
   */
  afterAll(async () => {
    try {
      // Clean up in reverse order of creation to respect foreign key constraints
      
      // Clean up listings first - only if they exist
      if (testRentalListing?.id) {
        try {
          await prisma.rentalListing.delete({ where: { id: testRentalListing.id } });
          await prisma.listing.delete({ where: { id: testRentalListing.id } });
        } catch (e) {
          console.error('Error deleting rental listing:', e);
        }
      }
      
      if (testSaleListing?.id) {
        try {
          await prisma.saleListing.delete({ where: { id: testSaleListing.id } });
          await prisma.listing.delete({ where: { id: testSaleListing.id } });
        } catch (e) {
          console.error('Error deleting sale listing:', e);
        }
      }
      
      // Clean up properties - this removes the references to classifications
      const propertyIds = [];
      if (testProperty?.id) propertyIds.push({ id: testProperty.id });
      if (testProperty2?.id) propertyIds.push({ id: testProperty2.id });
      
      if (propertyIds.length > 0) {
        try {
          await prisma.property.deleteMany({
            where: { OR: propertyIds }
          });
        } catch (e) {
          console.error('Error deleting properties:', e);
        }
      }
      
      // Clean up addresses
      const addressIds = [];
      if (testAddress?.id) addressIds.push({ id: testAddress.id });
      if (testAddress2?.id) addressIds.push({ id: testAddress2.id });
      
      if (addressIds.length > 0) {
        try {
          await prisma.address.deleteMany({
            where: { OR: addressIds }
          });
        } catch (e) {
          console.error('Error deleting addresses:', e);
        }
      }
      
      // Clean up user
      if (testUser?.id) {
        try {
          await prisma.user.delete({
            where: { id: testUser.id }
          });
        } catch (e) {
          console.error('Error deleting user:', e);
        }
      }
      
      // First, clean up the PropertyClassifications
      const classificationIds = [];
      if (testClassification1?.id) classificationIds.push({ id: testClassification1.id });
      if (testClassification2?.id) classificationIds.push({ id: testClassification2.id });
      
      if (classificationIds.length > 0) {
        try {
          await prisma.propertyClassification.deleteMany({
            where: { OR: classificationIds }
          });
        } catch (e) {
          console.error('Error deleting property classifications:', e);
        }
      }
      
      // Then clean up the PropertyTypes
      const propertyTypeIds = [];
      if (testPropertyType1?.id) propertyTypeIds.push({ id: testPropertyType1.id });
      if (testPropertyType2?.id) propertyTypeIds.push({ id: testPropertyType2.id });
      
      if (propertyTypeIds.length > 0) {
        try {
          await prisma.propertyType.deleteMany({
            where: { OR: propertyTypeIds }
          });
        } catch (e) {
          console.error('Error deleting property types:', e);
        }
      }
      
      console.log('Test cleanup complete');
    } catch (error) {
      console.error('Cleanup error:', error);
      // Continue even if cleanup fails, but log the error
    }
  });
}); 