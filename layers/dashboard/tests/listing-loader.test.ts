import { describe, it, expect } from "vitest";
import {
  loadStep1,
  loadStep2,
  loadStep3,
} from "../app/utils/listing-loader";

// ──────────────────────────────────────────────────────────────────────────────
// Minimal draft fixture builder
// ──────────────────────────────────────────────────────────────────────────────

function makeDraft(overrides: Record<string, any> = {}): any {
  return {
    id: 1,
    userId: 10,
    listingTier: "STANDARD",
    createdAt: new Date(),
    updatedAt: new Date(),
    price: null,
    saleListing: null,
    rentalListing: null,
    property: null,
    user: { id: 10, username: "testuser", email: "test@example.com", createdAt: new Date() },
    ...overrides,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// loadStep1
// ──────────────────────────────────────────────────────────────────────────────

describe("loadStep1", () => {
  it("returns selectedType 'sale' when draft has a saleListing", () => {
    const draft = makeDraft({
      saleListing: { tenureType: "FREEHOLD", chain: false, sharedOwnership: false, availabilityStatus: "AVAILABLE" },
    });
    const result = loadStep1(draft);
    expect(result?.selectedType).toBe("sale");
    expect(result?.saleListing?.tenureType).toBe("FREEHOLD");
    expect(result?.rentalListing).toBeNull();
  });

  it("returns selectedType 'rent' when draft has a rentalListing", () => {
    const draft = makeDraft({
      rentalListing: {
        furnishedStatus: "FURNISHED",
        isBillsIncluded: true,
        rentalLength: "LONG_TERM",
        availabilityStatus: "AVAILABLE",
      },
    });
    const result = loadStep1(draft);
    expect(result?.selectedType).toBe("rent");
    expect(result?.rentalListing?.furnishedStatus).toBe("FURNISHED");
    expect(result?.saleListing).toBeNull();
  });

  it("returns null when draft has neither sale nor rental listing", () => {
    const draft = makeDraft();
    expect(loadStep1(draft)).toBeNull();
  });

  it("defaults chain to false when null", () => {
    const draft = makeDraft({
      saleListing: { tenureType: "LEASEHOLD", chain: null, sharedOwnership: null, availabilityStatus: null },
    });
    const result = loadStep1(draft);
    expect(result?.saleListing?.chain).toBe(false);
    expect(result?.saleListing?.availabilityStatus).toBe("AVAILABLE");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// loadStep2
// ──────────────────────────────────────────────────────────────────────────────

describe("loadStep2", () => {
  it("returns null when draft has no property", () => {
    expect(loadStep2(makeDraft())).toBeNull();
  });

  it("extracts property data when present", () => {
    const draft = makeDraft({
      property: {
        address: { street: "High St", city: "London", postcode: "EC1A 1BB", number: null, flat: null, name: null, country: null, locality: null, county: null, district: null, fullAddress: null, lat: null, lon: null },
        type: { id: 1 },
        classification: { id: 2 },
        description: "A lovely flat.",
        totalFloors: 2,
        constructionType: null,
        size: null,
        yearBuilt: null,
        bedroomFeatures: null,
        bathroomFeatures: null,
        kitchenFeatures: null,
        reception: null,
        otherRoom: null,
        numberBedrooms: null,
        numberBathrooms: null,
        numberKitchens: null,
        numberReceptions: null,
        numberOtherRooms: null,
      },
    });
    const result = loadStep2(draft);
    expect(result?.property.description).toBe("A lovely flat.");
    expect(result?.property.type).toBe(1);
    expect(result?.property.totalFloors).toBe(2);
  });

  it("uses empty address when property has no address", () => {
    const draft = makeDraft({
      property: {
        address: null,
        type: null,
        classification: null,
        description: null,
        totalFloors: null,
        constructionType: null,
        size: null,
        yearBuilt: null,
        bedroomFeatures: null,
        bathroomFeatures: null,
        kitchenFeatures: null,
        reception: null,
        otherRoom: null,
        numberBedrooms: null,
        numberBathrooms: null,
        numberKitchens: null,
        numberReceptions: null,
        numberOtherRooms: null,
      },
    });
    const result = loadStep2(draft);
    expect(result?.property.address.street).toBeNull();
  });

  it("defaults totalFloors to 1 when null", () => {
    const draft = makeDraft({
      property: {
        address: null, type: null, classification: null, description: null,
        totalFloors: null, constructionType: null, size: null, yearBuilt: null,
        bedroomFeatures: null, bathroomFeatures: null, kitchenFeatures: null,
        reception: null, otherRoom: null, numberBedrooms: null, numberBathrooms: null,
        numberKitchens: null, numberReceptions: null, numberOtherRooms: null,
      },
    });
    const result = loadStep2(draft);
    expect(result?.property.totalFloors).toBe(1);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// loadStep3
// ──────────────────────────────────────────────────────────────────────────────

describe("loadStep3", () => {
  it("returns null when price is null", () => {
    expect(loadStep3(makeDraft({ price: null }))).toBeNull();
  });

  it("returns price data when price is set", () => {
    const draft = makeDraft({
      price: 300000,
      saleListing: { priceType: "OFFERS_OVER" },
    });
    const result = loadStep3(draft);
    expect(result?.price).toBe(300000);
    expect(result?.saleListing?.priceType).toBe("OFFERS_OVER");
    expect(result?.rentalListing).toBeNull();
  });

  it("extracts rental pricing fields", () => {
    const draft = makeDraft({
      price: 1500,
      rentalListing: { rentFrequency: "MONTHLY", deposit: 1500, holdingDeposit: 500 },
    });
    const result = loadStep3(draft);
    expect(result?.rentalListing?.rentFrequency).toBe("MONTHLY");
    expect(result?.rentalListing?.deposit).toBe(1500);
  });
});
