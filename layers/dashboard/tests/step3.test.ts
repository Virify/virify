import { describe, it, expect } from "vitest";
import {
  formatSalePrice,
  formatRentalPrice,
  isStep3Valid,
  getStep3AlertDescription,
  priceTypeItems,
  rentFrequencyItems,
  createDefaultSalePricing,
  createDefaultRentalPricing,
} from "../app/utils/step3";

describe("Option arrays", () => {
  it("priceTypeItems is non-empty", () => expect(priceTypeItems.length).toBeGreaterThan(0));
  it("rentFrequencyItems is non-empty", () => expect(rentFrequencyItems.length).toBeGreaterThan(0));
});

describe("createDefaultSalePricing", () => {
  it("defaults to FIXED price type", () => {
    expect(createDefaultSalePricing().priceType).toBe("FIXED");
  });
});

describe("createDefaultRentalPricing", () => {
  it("defaults to MONTHLY rent frequency", () => {
    expect(createDefaultRentalPricing().rentFrequency).toBe("MONTHLY");
  });

  it("deposit and holdingDeposit default to null", () => {
    const result = createDefaultRentalPricing();
    expect(result.deposit).toBeNull();
    expect(result.holdingDeposit).toBeNull();
  });
});

describe("formatSalePrice", () => {
  it("formats OFFERS_OVER prefix", () => {
    const result = formatSalePrice(300000, "OFFERS_OVER");
    expect(result).toMatch(/offers over/i);
    expect(result).toContain("300,000");
  });

  it("formats GUIDE_PRICE prefix", () => {
    const result = formatSalePrice(250000, "GUIDE_PRICE");
    expect(result).toMatch(/guide price/i);
    expect(result).toContain("250,000");
  });

  it("formats FIXED with no prefix", () => {
    const result = formatSalePrice(200000, "FIXED");
    expect(result).not.toMatch(/offers|guide/i);
    expect(result).toContain("200,000");
  });

  it("returns £0 for null price", () => {
    expect(formatSalePrice(null, "FIXED")).toBe("£0");
  });
});

describe("formatRentalPrice", () => {
  it("appends pcm for monthly frequency", () => {
    const result = formatRentalPrice(1200, "MONTHLY");
    expect(result).toMatch(/pcm/);
    expect(result).toContain("1,200");
  });

  it("appends pw for weekly frequency", () => {
    const result = formatRentalPrice(300, "WEEKLY");
    expect(result).toMatch(/pw/);
    expect(result).toContain("300");
  });

  it("returns £0 suffix for null price", () => {
    const result = formatRentalPrice(null, "MONTHLY");
    expect(result).toContain("£0");
  });
});

describe("isStep3Valid", () => {
  it("is valid for sale with price and priceType", () => {
    expect(isStep3Valid({ price: 300000, saleListing: { priceType: "FIXED" }, rentalListing: null }, "sale")).toBe(true);
  });

  it("is invalid for sale when price is 0", () => {
    expect(isStep3Valid({ price: 0, saleListing: { priceType: "FIXED" }, rentalListing: null }, "sale")).toBe(false);
  });

  it("is invalid for sale when price is null", () => {
    expect(isStep3Valid({ price: null, saleListing: { priceType: "FIXED" }, rentalListing: null }, "sale")).toBe(false);
  });

  it("is invalid for sale when priceType is missing", () => {
    expect(isStep3Valid({ price: 500000, saleListing: {}, rentalListing: null } as any, "sale")).toBe(false);
  });

  it("is valid for rent with price and rentFrequency", () => {
    expect(isStep3Valid({ price: 1500, saleListing: null, rentalListing: { rentFrequency: "MONTHLY" } }, "rent")).toBe(true);
  });

  it("is invalid for rent when price is 0", () => {
    expect(isStep3Valid({ price: 0, saleListing: null, rentalListing: { rentFrequency: "MONTHLY" } }, "rent")).toBe(false);
  });
});

describe("getStep3AlertDescription", () => {
  it("returns sale description for sale type", () => {
    const result = getStep3AlertDescription("sale");
    expect(result.toLowerCase()).toContain("price");
  });

  it("returns rental description for rent type", () => {
    const result = getStep3AlertDescription("rent");
    expect(result.toLowerCase()).toMatch(/rental|rental price/i);
  });
});
