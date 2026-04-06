import { describe, it, expect } from "vitest";
import {
  createDefaultSaleListing,
  createDefaultRentalListing,
  createInitialStep1Values,
  isStep1Valid,
  listingTypeItems,
  chainItems,
  billsIncludedItems,
  tenureItems,
  saleAvailabilityItems,
  furnishedItems,
  rentalLengthItems,
  rentalAvailabilityItems,
} from "../app/utils/step1";

describe("Option arrays", () => {
  it("listingTypeItems has sale and rent options", () => {
    expect(listingTypeItems.some((i) => i.value === "sale")).toBe(true);
    expect(listingTypeItems.some((i) => i.value === "rent")).toBe(true);
  });

  it("chainItems is non-empty", () => expect(chainItems.length).toBeGreaterThan(0));
  it("billsIncludedItems is non-empty", () => expect(billsIncludedItems.length).toBeGreaterThan(0));
  it("tenureItems is non-empty", () => expect(tenureItems.length).toBeGreaterThan(0));
  it("saleAvailabilityItems is non-empty", () => expect(saleAvailabilityItems.length).toBeGreaterThan(0));
  it("furnishedItems is non-empty", () => expect(furnishedItems.length).toBeGreaterThan(0));
  it("rentalLengthItems is non-empty", () => expect(rentalLengthItems.length).toBeGreaterThan(0));
  it("rentalAvailabilityItems is non-empty", () => expect(rentalAvailabilityItems.length).toBeGreaterThan(0));
});

describe("createDefaultSaleListing", () => {
  it("returns FREEHOLD tenure and AVAILABLE status by default", () => {
    const result = createDefaultSaleListing();
    expect(result.tenureType).toBe("FREEHOLD");
    expect(result.availabilityStatus).toBe("AVAILABLE");
    expect(result.chain).toBe(false);
    expect(result.sharedOwnership).toBe(false);
  });
});

describe("createDefaultRentalListing", () => {
  it("returns UNFURNISHED, LONG_TERM, AVAILABLE and no bills by default", () => {
    const result = createDefaultRentalListing();
    expect(result.furnishedStatus).toBe("UNFURNISHED");
    expect(result.rentalLength).toBe("LONG_TERM");
    expect(result.availabilityStatus).toBe("AVAILABLE");
    expect(result.isBillsIncluded).toBe(false);
  });
});

describe("createInitialStep1Values", () => {
  it("defaults to sale type", () => {
    const result = createInitialStep1Values();
    expect(result.selectedType).toBe("sale");
  });

  it("includes sale listing data", () => {
    const result = createInitialStep1Values();
    expect(result.saleListing).not.toBeNull();
    expect(result.saleListing?.tenureType).toBe("FREEHOLD");
  });

  it("rentalListing is null initially", () => {
    const result = createInitialStep1Values();
    expect(result.rentalListing).toBeNull();
  });
});

describe("isStep1Valid (sale)", () => {
  it("is valid when tenureType is set", () => {
    expect(isStep1Valid({ selectedType: "sale", saleListing: { tenureType: "FREEHOLD", chain: false, sharedOwnership: false, availabilityStatus: "AVAILABLE" }, rentalListing: null })).toBe(true);
  });

  it("is invalid when saleListing is null", () => {
    expect(isStep1Valid({ selectedType: "sale", saleListing: null, rentalListing: null } as any)).toBe(false);
  });
});

describe("isStep1Valid (rent)", () => {
  const validRental = {
    furnishedStatus: "FURNISHED" as const,
    isBillsIncluded: false,
    rentalLength: "LONG_TERM" as const,
    availabilityStatus: "AVAILABLE" as const,
  };

  it("is valid when all required rental fields are set", () => {
    expect(isStep1Valid({ selectedType: "rent", saleListing: null, rentalListing: validRental })).toBe(true);
  });

  it("is invalid when furnishedStatus is missing", () => {
    expect(isStep1Valid({ selectedType: "rent", saleListing: null, rentalListing: { ...validRental, furnishedStatus: "" as any } })).toBe(false);
  });

  it("is invalid when rentalLength is missing", () => {
    expect(isStep1Valid({ selectedType: "rent", saleListing: null, rentalListing: { ...validRental, rentalLength: "" as any } })).toBe(false);
  });
});
