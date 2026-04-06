import { describe, it, expect } from "vitest";
import {
  createEmptyAddress,
  createInitialStep2Values,
  isAddressValid,
  isStep2Valid,
  minYearBuilt,
} from "../app/utils/step2";

describe("minYearBuilt", () => {
  it("is 1500", () => {
    expect(minYearBuilt).toBe(1500);
  });
});

describe("createEmptyAddress", () => {
  it("returns all null fields", () => {
    const addr = createEmptyAddress();
    for (const value of Object.values(addr)) {
      expect(value).toBeNull();
    }
  });
});

describe("createInitialStep2Values", () => {
  it("starts with empty address", () => {
    const state = createInitialStep2Values();
    expect(state.property.address.street).toBeNull();
  });

  it("description starts empty", () => {
    const state = createInitialStep2Values();
    expect(state.property.description).toBe("");
  });

  it("totalFloors defaults to 1", () => {
    const state = createInitialStep2Values();
    expect(state.property.totalFloors).toBe(1);
  });
});

describe("isAddressValid", () => {
  const validAddr = {
    number: "1",
    flat: null,
    name: null,
    street: "Main St",
    city: "London",
    postcode: "SW1A 1AA",
    country: "UK",
    locality: null,
    county: null,
    district: null,
    fullAddress: null,
    lat: null,
    lon: null,
  };

  it("returns true for a complete address", () => {
    expect(isAddressValid(validAddr)).toBe(true);
  });

  it("returns false when street is missing", () => {
    expect(isAddressValid({ ...validAddr, street: null })).toBe(false);
  });

  it("returns false when city is missing", () => {
    expect(isAddressValid({ ...validAddr, city: null })).toBe(false);
  });

  it("returns false when postcode is missing", () => {
    expect(isAddressValid({ ...validAddr, postcode: null })).toBe(false);
  });

  it("returns false for null", () => {
    expect(isAddressValid(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isAddressValid(undefined)).toBe(false);
  });
});

describe("isStep2Valid", () => {
  const validAddress = {
    number: null, flat: null, name: null,
    street: "High St", city: "London", postcode: "EC1A 1BB",
    country: null, locality: null, county: null, district: null, fullAddress: null,
    lat: null, lon: null,
  };

  const validState = {
    property: {
      address: validAddress,
      type: 1,
      classification: 2,
      description: "A lovely property in the city centre area.",
      totalFloors: 1,
      constructionType: null,
      size: null,
      yearBuilt: null,
    },
  };

  it("returns true for a fully valid state", () => {
    expect(isStep2Valid(validState)).toBe(true);
  });

  it("returns false when address is incomplete", () => {
    expect(isStep2Valid({ property: { ...validState.property, address: createEmptyAddress() } })).toBe(false);
  });

  it("returns false when type is not set", () => {
    expect(isStep2Valid({ property: { ...validState.property, type: 0 as any } })).toBe(false);
  });

  it("returns false when description is too short (< 10 chars)", () => {
    expect(isStep2Valid({ property: { ...validState.property, description: "Too short" } })).toBe(false);
  });

  it("returns false when description is empty", () => {
    expect(isStep2Valid({ property: { ...validState.property, description: "" } })).toBe(false);
  });

  it("returns false when totalFloors is 0", () => {
    expect(isStep2Valid({ property: { ...validState.property, totalFloors: 0 } })).toBe(false);
  });
});
