import { describe, expect, it } from "vitest";
import { buildPricePaidAddressMatches, resolvePricePaidAddressParts } from "~~/shared/utils/price-paid";

describe("buildPricePaidAddressMatches", () => {
  it("builds a simple PAON-only match for houses", () => {
    expect(buildPricePaidAddressMatches("12", null)).toEqual([{ paon: "12" }]);
  });

  it("builds simple PAON/SAON matches for flats", () => {
    const matches = buildPricePaidAddressMatches("10", "Apartment 1");

    expect(matches).toContainEqual({ paon: "10", saon: "APARTMENT 1" });
    expect(matches).toContainEqual({ paon: "10", saon: "APT 1" });
    expect(matches).toContainEqual({ paon: "10", saon: "FLAT 1" });
  });
});

describe("resolvePricePaidAddressParts", () => {
  it("uses the structured address number and flat", () => {
    expect(resolvePricePaidAddressParts({
      number: "10",
      flat: "Apartment 1",
      street: "Gatliff Road",
      fullAddress: "Apartment 1, Cubitt Building 10 Gatliff Road, London, Greater London, England, Sw1w 8ql",
    })).toEqual({
      number: "10",
      flat: "APARTMENT 1",
    });
  });

  it("does not infer missing values from fullAddress", () => {
    expect(resolvePricePaidAddressParts({
      number: null,
      flat: null,
      street: "Gatliff Road",
      fullAddress: "Apartment 1, Cubitt Building 10 Gatliff Road, London, Greater London, England, Sw1w 8ql",
    })).toEqual({
      number: null,
      flat: null,
    });
  });
});
