import { describe, it, expect } from "vitest";
import { parseAddress } from "../../app/utils/address";

const baseAddress = {
  buildingNumber: "10",
  buildingName: null,
  thoroughfareAndDescriptor: "High Street",
  postTown: "CARDIFF",
  dependentLocality: "roath",
  county: "south glamorgan",
  country: "wales",
  postCode: "CF24 1AA",
  envelopeAddress: { summaryLine: "10 HIGH STREET, CARDIFF" },
  latitude: "51.4816",
  longitude: "-3.1791",
};

describe("parseAddress", () => {
  it("parses a standard address object", () => {
    const result = parseAddress(baseAddress, "CF24 1AA");
    expect(result.number).toBe("10");
    expect(result.street).toBe("High Street");
    expect(result.postcode).toBe("CF24 1AA");
  });

  it("capitalizes city from postTown", () => {
    const result = parseAddress(baseAddress, "CF24 1AA");
    expect(result.city).toBe("Cardiff");
  });

  it("capitalizes locality", () => {
    const result = parseAddress(baseAddress, "CF24 1AA");
    expect(result.locality).toBe("Roath");
  });

  it("capitalizes county", () => {
    const result = parseAddress(baseAddress, "CF24 1AA");
    expect(result.county).toBe("South Glamorgan");
  });

  it("capitalizes country", () => {
    const result = parseAddress(baseAddress, "CF24 1AA");
    expect(result.country).toBe("Wales");
  });

  it("parses latitude and longitude as floats", () => {
    const result = parseAddress(baseAddress, "CF24 1AA");
    expect(result.lat).toBeCloseTo(51.4816);
    expect(result.lon).toBeCloseTo(-3.1791);
  });

  it("returns null lat/lon when not parseable", () => {
    const result = parseAddress({ ...baseAddress, latitude: "invalid", longitude: "" }, "CF24 1AA");
    expect(result.lat).toBeNull();
    expect(result.lon).toBeNull();
  });

  it("uses fallback postcode when postCode is not in address", () => {
    const addr = { ...baseAddress, postCode: undefined };
    const result = parseAddress(addr, "SW1A 1AA");
    expect(result.postcode).toBe("SW1A 1AA");
  });

  it("sets flat from buildingName", () => {
    const result = parseAddress({ ...baseAddress, buildingName: "Flat 3" }, "CF24 1AA");
    expect(result.flat).toBe("Flat 3");
    expect(result.name).toBe("Flat 3");
  });

  it("sets country to United Kingdom when country is null", () => {
    const result = parseAddress({ ...baseAddress, country: null }, "CF24 1AA");
    expect(result.country).toBe("United Kingdom");
  });

  it("formats fullAddress from summaryLine", () => {
    const result = parseAddress(baseAddress, "CF24 1AA");
    expect(result.fullAddress).toBe("10 High Street, Cardiff");
  });

  it("returns null fullAddress when summaryLine is missing", () => {
    const result = parseAddress({ ...baseAddress, envelopeAddress: null }, "CF24 1AA");
    expect(result.fullAddress).toBeNull();
  });
});
