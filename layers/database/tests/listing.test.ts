import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { getListingByDistanceAndFilters } from "../server/utils/listing";
import { ListingTier, RentalAvailabilityStatus, SaleAvailabilityStatus } from "../server/database/prisma/generated/enums";

// Create hoisted mocks
const mockPrisma = vi.hoisted(() => ({
  listing: {
    findMany: vi.fn(),
  },
}));

const mockNearbyProperties = vi.hoisted(() => vi.fn());
const mockPriceFilter = vi.hoisted(() => vi.fn());

// Mock the modules
vi.mock("../server/utils/prisma-client", () => ({
  prisma: mockPrisma,
}));

vi.mock("../server/utils/location", () => ({
  getPropertyIdsByDistance: mockNearbyProperties,
}));

vi.mock("../server/utils/price", () => ({
  getPriceFilter: mockPriceFilter,
}));

const baseListing = {
  id: 1,
  title: "Test Listing",
  price: 1000,
  listingTier: ListingTier.FEATURED,
  publishedAt: new Date(),
  rentalListing: { availabilityStatus: RentalAvailabilityStatus.AVAILABLE },
  saleListing: { availabilityStatus: SaleAvailabilityStatus.AVAILABLE },
  property: {
    media: [{ image: "img.jpg", metadata: {} }],
    address: {
      number: "1",
      id: 10,
      flat: null,
      street: "Main St",
      city: "Testville",
      postcode: "TST123",
      country: "Testland",
      county: "Testshire",
      lat: 1.23,
      lon: 4.56,
    },
    type: { name: "Flat" },
    accessibilityFeatures: { wheelchairFriendly: true },
    additionalFeatures: { petFriendly: true },
    numberBedrooms: 2,
    numberBathrooms: 1,
    parking: { evCharging: true, garage: false },
  },
};

const baseNearby = [
  { propertyId: 10, distanceMiles: 2.5 },
  { propertyId: 20, distanceMiles: 4.2 },
];

// Test coordinates for Testville
const testvilleCoords = { lat: 51.5074, lon: -0.1278 };

describe("getListingByDistanceAndFilters", () => {
  /**
   * Clears all mocks before each test.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that listings are filtered by all filters and distances are mapped correctly.
   */
  it("returns listings filtered by all filters and maps distance", async () => {
    mockNearbyProperties.mockResolvedValue(baseNearby);
    mockPriceFilter.mockReturnValue({ gte: 900, lte: 1100 });
    mockPrisma.listing.findMany.mockResolvedValue([
      { ...baseListing },
      { ...baseListing, id: 2, property: { ...baseListing.property, address: { ...baseListing.property.address, id: 20 } } },
    ]);

    const result = await getListingByDistanceAndFilters(
      { type: "rent", coordinates: testvilleCoords, radius: 5 },
      {
        propertyTypes: { "1": [1, 2] },
        priceRange: [900, 1100],
        bedrooms: [1, 3],
        bathrooms: [1, 2],
        addedToSite: new Date("2023-01-01"),
        availabilityOptions: [RentalAvailabilityStatus.AVAILABLE],
        featured: { listingTier: { FEATURED: true } },
        take: 2,
        skip: 0,
      }
    );

    expect(mockNearbyProperties).toHaveBeenCalledWith(testvilleCoords.lat, testvilleCoords.lon, 5);
    expect(mockPriceFilter).toHaveBeenCalledWith([900, 1100]);
    expect(mockPrisma.listing.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]?.distanceMiles).toBe(2.5);
    expect(result[1]?.distanceMiles).toBe(4.2);
  });

  /**
   * Tests that an empty array is returned if no nearby properties are found.
   */
  it("returns empty array if no nearby properties", async () => {
    mockNearbyProperties.mockResolvedValue([]);
    mockPrisma.listing.findMany.mockResolvedValue([]);
    const result = await getListingByDistanceAndFilters(
      { type: "buy", coordinates: { lat: 0, lon: 0 }, radius: 10 },
      {}
    );
    expect(result).toEqual([]);
  });

  /**
   * Tests that an empty array is returned if no listings match the filters.
   */
  it("returns empty array if no listings match", async () => {
    mockNearbyProperties.mockResolvedValue(baseNearby);
    mockPrisma.listing.findMany.mockResolvedValue([]);
    const result = await getListingByDistanceAndFilters(
      { type: "rent", coordinates: testvilleCoords, radius: 5 },
      { propertyTypes: { "1": [2, 3] } }
    );
    expect(result).toEqual([]);
  });

  /**
   * Tests that the function handles missing or optional filters gracefully.
   */
  it("handles missing/optional filters gracefully", async () => {
    mockNearbyProperties.mockResolvedValue(baseNearby);
    mockPriceFilter.mockReturnValue(undefined);
    mockPrisma.listing.findMany.mockResolvedValue([{ ...baseListing }]);
    const result = await getListingByDistanceAndFilters(
      { type: "buy", coordinates: testvilleCoords, radius: 5 },
      {}
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.distanceMiles).toBe(2.5);
  });

  /**
   * Tests that the function handles the edge case where no filters are provided.
   */
  it("handles edge case: no filters at all", async () => {
    mockNearbyProperties.mockResolvedValue(baseNearby);
    mockPriceFilter.mockReturnValue(undefined);
    mockPrisma.listing.findMany.mockResolvedValue([{ ...baseListing }]);
    const result = await getListingByDistanceAndFilters(
      { type: "rent", coordinates: testvilleCoords, radius: 5 },
      {}
    );
    expect(result).toHaveLength(1);
  });

  /**
   * Tests that the function correctly applies sale filters and availability options.
   */
  it("correctly uses sale filters and availability", async () => {
    mockNearbyProperties.mockResolvedValue(baseNearby);
    mockPriceFilter.mockReturnValue({ gte: 500000, lte: 600000 });
    mockPrisma.listing.findMany.mockResolvedValue([{ ...baseListing, saleListing: { availabilityStatus: SaleAvailabilityStatus.AVAILABLE } }]);
    const result = await getListingByDistanceAndFilters(
      { type: "buy", coordinates: testvilleCoords, radius: 5 },
      { priceRange: [500000, 600000], availabilityOptions: [SaleAvailabilityStatus.AVAILABLE] }
    );
    expect(result[0]).toBeTruthy();
    expect(result[0] && result[0].saleListing?.availabilityStatus).toBe(SaleAvailabilityStatus.AVAILABLE);
  });
});