import { describe, it, expect } from "vitest";
import {
  epcRatingOptions,
  heatingTypeOptions,
  boilerTypeOptions,
  hotWaterSourceOptions,
  renewableEnergyOptions,
  connectedUtilitiesOptions,
  councilTaxBandOptions,
} from "../app/utils/step8";

describe("epcRatingOptions", () => {
  it("has 7 items (A–G)", () => {
    expect(epcRatingOptions).toHaveLength(7);
  });

  it("each item has value and label in Rating X format", () => {
    for (const option of epcRatingOptions) {
      expect(option).toHaveProperty("value");
      expect(option.label).toMatch(/^Rating [A-G]$/);
    }
  });

  it("contains all standard EPC ratings", () => {
    const values = epcRatingOptions.map((o) => o.value);
    expect(values).toContain("A");
    expect(values).toContain("D");
    expect(values).toContain("G");
  });

  it("label matches Rating {value}", () => {
    const itemA = epcRatingOptions.find((o) => o.value === "A");
    expect(itemA?.label).toBe("Rating A");
    const itemG = epcRatingOptions.find((o) => o.value === "G");
    expect(itemG?.label).toBe("Rating G");
  });
});

describe("heatingTypeOptions", () => {
  it("is non-empty", () => {
    expect(heatingTypeOptions.length).toBeGreaterThan(0);
  });

  it("each item has value, key, info, and label", () => {
    for (const option of heatingTypeOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("key");
      expect(option).toHaveProperty("info");
      expect(option).toHaveProperty("label");
    }
  });

  it("contains expected heating types", () => {
    const values = heatingTypeOptions.map((o) => o.value);
    expect(values).toContain("GAS_CENTRAL");
    expect(values).toContain("ELECTRIC");
    expect(values).toContain("HEAT_PUMP");
    expect(values).toContain("UNDERFLOOR");
  });

  it("formats labels correctly (GAS_CENTRAL → Gas Central)", () => {
    const gas = heatingTypeOptions.find((o) => o.value === "GAS_CENTRAL");
    expect(gas?.label).toBe("Gas Central");
  });
});

describe("boilerTypeOptions", () => {
  it("first item is null (not applicable)", () => {
    expect(boilerTypeOptions[0].value).toBeNull();
    expect(boilerTypeOptions[0].label).toBe("Not applicable");
  });

  it("contains all BoilerType enum values after null item", () => {
    const values = boilerTypeOptions.slice(1).map((o) => o.value);
    expect(values).toContain("COMBI");
    expect(values).toContain("SYSTEM");
    expect(values).toContain("CONVENTIONAL");
    expect(values).toContain("BACK_BOILER");
  });

  it("has 5 items total (1 null + 4 enum values)", () => {
    expect(boilerTypeOptions).toHaveLength(5);
  });

  it("formats labels correctly (BACK_BOILER → Back Boiler)", () => {
    const bb = boilerTypeOptions.find((o) => o.value === "BACK_BOILER");
    expect(bb?.label).toBe("Back Boiler");
  });
});

describe("hotWaterSourceOptions", () => {
  it("first item is null (not applicable)", () => {
    expect(hotWaterSourceOptions[0].value).toBeNull();
    expect(hotWaterSourceOptions[0].label).toBe("Not applicable");
  });

  it("contains expected hot water source types", () => {
    const values = hotWaterSourceOptions.slice(1).map((o) => o.value);
    expect(values).toContain("BOILER");
    expect(values).toContain("IMMERSION_HEATER");
    expect(values).toContain("SOLAR_THERMAL");
    expect(values).toContain("HEAT_PUMP");
  });

  it("has 6 items total (1 null + 5 enum values)", () => {
    expect(hotWaterSourceOptions).toHaveLength(6);
  });
});

describe("renewableEnergyOptions", () => {
  it("is non-empty", () => {
    expect(renewableEnergyOptions.length).toBeGreaterThan(0);
  });

  it("each item has value, key, info, and label", () => {
    for (const option of renewableEnergyOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("key");
      expect(option).toHaveProperty("info");
      expect(option).toHaveProperty("label");
    }
  });

  it("contains expected renewable types", () => {
    const values = renewableEnergyOptions.map((o) => o.value);
    expect(values).toContain("SOLAR_PV");
    expect(values).toContain("BATTERY_STORAGE");
    expect(values).toContain("SMART_METER");
    expect(values).toContain("EV_CHARGING");
  });

  it("has 4 items", () => {
    expect(renewableEnergyOptions).toHaveLength(4);
  });
});

describe("connectedUtilitiesOptions", () => {
  it("is non-empty", () => {
    expect(connectedUtilitiesOptions.length).toBeGreaterThan(0);
  });

  it("each item has value, key, info, and label", () => {
    for (const option of connectedUtilitiesOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("key");
      expect(option).toHaveProperty("info");
      expect(option).toHaveProperty("label");
    }
  });

  it("info says 'Connected to ...'", () => {
    const gas = connectedUtilitiesOptions.find((o) => o.value === "GAS");
    expect(gas?.info).toBe("Connected to gas");
  });

  it("contains expected utility types", () => {
    const values = connectedUtilitiesOptions.map((o) => o.value);
    expect(values).toContain("GAS");
    expect(values).toContain("ELECTRICITY");
    expect(values).toContain("WATER");
    expect(values).toContain("SEWAGE");
    expect(values).toContain("SEPTIC_TANK");
  });

  it("has 8 items", () => {
    expect(connectedUtilitiesOptions).toHaveLength(8);
  });
});

describe("councilTaxBandOptions", () => {
  it("has 8 bands (A–H)", () => {
    expect(councilTaxBandOptions).toHaveLength(8);
  });

  it("first band is A, last is H", () => {
    expect(councilTaxBandOptions[0].value).toBe("A");
    expect(councilTaxBandOptions[7].value).toBe("H");
  });

  it("labels are in Band X format", () => {
    for (const option of councilTaxBandOptions) {
      expect(option.label).toMatch(/^Band [A-H]$/);
    }
  });

  it("label matches Band {value}", () => {
    const bandD = councilTaxBandOptions.find((o) => o.value === "D");
    expect(bandD?.label).toBe("Band D");
  });
});
