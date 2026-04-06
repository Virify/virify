import { describe, it, expect } from "vitest";
import {
  parkingFeatureOptions,
  accessibilityFeatureOptions,
  securityFeatureOptions,
  storageFeatureOptions,
  utilityFeatureOptions,
  buildingFeatureOptions,
  petFriendlyOptions,
} from "../app/utils/step7";

describe("parkingFeatureOptions", () => {
  it("is non-empty", () => {
    expect(parkingFeatureOptions.length).toBeGreaterThan(0);
  });

  it("contains expected parking features", () => {
    const values = parkingFeatureOptions.map((o) => o.value);
    expect(values).toContain("GARAGE");
    expect(values).toContain("DRIVEWAY");
    expect(values).toContain("EV_CHARGING");
    expect(values).toContain("NO_PARKING");
  });

  it("each item has value and label", () => {
    for (const option of parkingFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("label");
    }
  });

  it("formats multi-word labels correctly (EV_CHARGING → Ev Charging)", () => {
    const ev = parkingFeatureOptions.find((o) => o.value === "EV_CHARGING");
    expect(ev?.label).toBe("Ev Charging");
  });

  it("has 8 items", () => {
    expect(parkingFeatureOptions).toHaveLength(8);
  });
});

describe("accessibilityFeatureOptions", () => {
  it("is non-empty", () => {
    expect(accessibilityFeatureOptions.length).toBeGreaterThan(0);
  });

  it("contains expected accessibility features", () => {
    const values = accessibilityFeatureOptions.map((o) => o.value);
    expect(values).toContain("WHEELCHAIR_FRIENDLY");
    expect(values).toContain("STEP_FREE_ACCESS");
    expect(values).toContain("ELEVATOR");
    expect(values).toContain("ACCESSIBLE_PARKING");
  });

  it("each item has value and label", () => {
    for (const option of accessibilityFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("label");
    }
  });

  it("formats labels correctly (WHEELCHAIR_FRIENDLY → Wheelchair Friendly)", () => {
    const wc = accessibilityFeatureOptions.find((o) => o.value === "WHEELCHAIR_FRIENDLY");
    expect(wc?.label).toBe("Wheelchair Friendly");
  });

  it("has 8 items", () => {
    expect(accessibilityFeatureOptions).toHaveLength(8);
  });
});

describe("securityFeatureOptions", () => {
  it("is non-empty", () => {
    expect(securityFeatureOptions.length).toBeGreaterThan(0);
  });

  it("contains expected security features", () => {
    const values = securityFeatureOptions.map((o) => o.value);
    expect(values).toContain("CCTV");
    expect(values).toContain("ALARM_SYSTEM");
    expect(values).toContain("GATED_COMMUNITY");
    expect(values).toContain("INTERCOM_SYSTEM");
  });

  it("each item has value and label", () => {
    for (const option of securityFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("label");
    }
  });

  it("formats labels correctly (ALARM_SYSTEM → Alarm System)", () => {
    const alarm = securityFeatureOptions.find((o) => o.value === "ALARM_SYSTEM");
    expect(alarm?.label).toBe("Alarm System");
  });

  it("has 7 items", () => {
    expect(securityFeatureOptions).toHaveLength(7);
  });
});

describe("storageFeatureOptions", () => {
  it("contains expected storage features", () => {
    const values = storageFeatureOptions.map((o) => o.value);
    expect(values).toContain("ATTIC");
    expect(values).toContain("BASEMENT");
    expect(values).toContain("UNDER_STAIRS_STORAGE");
  });

  it("each item has value and label", () => {
    for (const option of storageFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("label");
    }
  });

  it("has 4 items", () => {
    expect(storageFeatureOptions).toHaveLength(4);
  });

  it("formats labels correctly (UNDER_STAIRS_STORAGE → Under Stairs Storage)", () => {
    const item = storageFeatureOptions.find((o) => o.value === "UNDER_STAIRS_STORAGE");
    expect(item?.label).toBe("Under Stairs Storage");
  });
});

describe("utilityFeatureOptions", () => {
  it("contains STORAGE, SINK, PLUMBING", () => {
    const values = utilityFeatureOptions.map((o) => o.value);
    expect(values).toContain("STORAGE");
    expect(values).toContain("SINK");
    expect(values).toContain("PLUMBING");
  });

  it("has 3 items", () => {
    expect(utilityFeatureOptions).toHaveLength(3);
  });

  it("each item has value and label", () => {
    for (const option of utilityFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("label");
    }
  });
});

describe("buildingFeatureOptions", () => {
  it("contains expected building features", () => {
    const values = buildingFeatureOptions.map((o) => o.value);
    expect(values).toContain("POOL");
    expect(values).toContain("GYM");
    expect(values).toContain("CONCIERGE");
    expect(values).toContain("INTERNET");
    expect(values).toContain("SHOP");
  });

  it("has 5 items", () => {
    expect(buildingFeatureOptions).toHaveLength(5);
  });

  it("each item has value and label", () => {
    for (const option of buildingFeatureOptions) {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("label");
    }
  });
});

describe("petFriendlyOptions", () => {
  it("has exactly 2 items", () => {
    expect(petFriendlyOptions).toHaveLength(2);
  });

  it("first option is Yes (true)", () => {
    expect(petFriendlyOptions[0].value).toBe(true);
    expect(petFriendlyOptions[0].label).toBe("Yes");
  });

  it("second option is No (false)", () => {
    expect(petFriendlyOptions[1].value).toBe(false);
    expect(petFriendlyOptions[1].label).toBe("No");
  });
});
