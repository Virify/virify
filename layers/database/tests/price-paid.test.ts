import { describe, expect, it } from "vitest";
import { buildPricePaidAddressMatches, buildPricePaidDiagnosticMatches, resolvePricePaidAddressParts } from "../server/utils/price-paid";

describe("buildPricePaidAddressMatches", () => {
  it("builds Land Registry PAON/SAON candidates for apartments with named buildings", () => {
    const matches = buildPricePaidAddressMatches("10", "Apartment 1, Cubitt Building");

    expect(matches).toContainEqual({ paon: "10", saon: "APARTMENT 1, CUBITT BUILDING" });
    expect(matches).toContainEqual({ paon: "10", saon: "APARTMENT 1" });
    expect(matches).toContainEqual({ paon: "CUBITT BUILDING, 10", saon: "APARTMENT 1" });
    expect(matches).toContainEqual({ paon: "CUBITT BUILDING 10", saon: "APARTMENT 1" });
    expect(matches).toContainEqual({ paon: "CUBITT BUILDING, 10", saon: "FLAT 1" });
  });

  it("keeps simple houses as a PAON-only match", () => {
    expect(buildPricePaidAddressMatches("12", null)).toEqual([{ paon: "12" }]);
  });
});

describe("buildPricePaidDiagnosticMatches", () => {
  it("searches likely building PAON values for flat misses", () => {
    expect(buildPricePaidDiagnosticMatches("9", "FLAT B23, HERBAL HILL GARDENS")).toContainEqual({
      paon: { contains: "HERBAL HILL GARDENS, 9" },
    });
  });
});

describe("resolvePricePaidAddressParts", () => {
  it("infers flat and number from a full apartment address", () => {
    expect(resolvePricePaidAddressParts({
      number: null,
      flat: null,
      street: "Gatliff Road",
      fullAddress: "Apartment 1, Cubitt Building 10 Gatliff Road, London, Greater London, England, Sw1w 8ql",
    })).toEqual({
      number: "10",
      flat: "APARTMENT 1, CUBITT BUILDING",
    });
  });

  it("infers a missing flat without replacing an existing number", () => {
    expect(resolvePricePaidAddressParts({
      number: "10",
      flat: null,
      street: "Gatliff Road",
      fullAddress: "Apartment 1, Cubitt Building 10 Gatliff Road, London, Greater London, England, Sw1w 8ql",
    })).toEqual({
      number: "10",
      flat: "APARTMENT 1, CUBITT BUILDING",
    });
  });

  it("uses the richer full address flat when stored flat only has the building name", () => {
    expect(resolvePricePaidAddressParts({
      number: "9",
      flat: "Herbal Hill Gardens",
      street: "Herbal Hill",
      fullAddress: "Flat B23, Herbal Hill Gardens 9 Herbal Hill, London, Greater London, England, Ec1r 5xb",
    })).toEqual({
      number: "9",
      flat: "FLAT B23, HERBAL HILL GARDENS",
    });

    expect(buildPricePaidAddressMatches("9", "FLAT B23, HERBAL HILL GARDENS")).toContainEqual({
      paon: "HERBAL HILL GARDENS, 9",
      saon: "FLAT B23",
    });
  });
});
