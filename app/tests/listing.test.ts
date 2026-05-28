import { describe, it, expect } from "vitest";
import { getFloorText, getRoomType } from "../utils/listing/room";
import {
  getClassificationIcon,
  getPropertyTypeIcon,
  getRoomTypeIcon,
  getGardenTypeIcon,
  getFeatureTypeIcon,
} from "../utils/listing/icon-map";
import {
  getTierFeatures,
  getTierFeaturesMap,
  getMaxImagesForTier,
} from "../utils/listing/tier-features";

// ============================================================================
// getFloorText
// ============================================================================

describe("getFloorText", () => {
  it("returns 'Unknown Floor' for null", () => {
    expect(getFloorText(null)).toBe("Unknown Floor");
  });

  it("returns 'Ground Floor' for 0", () => {
    expect(getFloorText(0)).toBe("Ground Floor");
  });

  it("appends 'st' for 1st floor", () => {
    expect(getFloorText(1)).toBe("1st Floor");
  });

  it("appends 'nd' for 2nd floor", () => {
    expect(getFloorText(2)).toBe("2nd Floor");
  });

  it("appends 'rd' for 3rd floor", () => {
    expect(getFloorText(3)).toBe("3rd Floor");
  });

  it("appends 'th' for 4th floor", () => {
    expect(getFloorText(4)).toBe("4th Floor");
  });

  it("appends 'th' for 11th (special case)", () => {
    expect(getFloorText(11)).toBe("11th Floor");
  });

  it("appends 'th' for 12th (special case)", () => {
    expect(getFloorText(12)).toBe("12th Floor");
  });

  it("appends 'th' for 13th (special case)", () => {
    expect(getFloorText(13)).toBe("13th Floor");
  });

  it("appends 'st' for 21st floor", () => {
    expect(getFloorText(21)).toBe("21st Floor");
  });

  it("appends 'nd' for 22nd floor", () => {
    expect(getFloorText(22)).toBe("22nd Floor");
  });

  it("appends 'rd' for 23rd floor", () => {
    expect(getFloorText(23)).toBe("23rd Floor");
  });
});

// ============================================================================
// getRoomType
// ============================================================================

describe("getRoomType", () => {
  it("returns 'Kitchen' if roomNumber is null", () => {
    expect(getRoomType({ roomNumber: null, name: "Main Kitchen" })).toBe(
      "Kitchen",
    );
  });

  it("returns room name converted for type 'other'", () => {
    // convertEnumToString is auto-imported; LIVING_ROOM → "Living Room"
    const room = { type: "other", name: "LIBRARY" };
    expect(getRoomType(room)).toContain("Library"); // enum-to-string converts it
  });

  it("returns converted enum type for known types", () => {
    const room = { type: "LIVING_ROOM" };
    expect(getRoomType(room)).toBe("Living Room");
  });

  it("falls back to room name when no type", () => {
    const room = { name: "Snug" };
    expect(getRoomType(room)).toBe("Snug");
  });

  it("returns 'Room' when no type or name", () => {
    expect(getRoomType({})).toBe("Room");
  });
});

// ============================================================================
// getClassificationIcon
// ============================================================================

describe("getClassificationIcon", () => {
  it("maps 'Terraced' to property/terraced", () => {
    expect(getClassificationIcon("Terraced")).toBe("property/terraced");
  });

  it("maps 'Detached' to property/detatched", () => {
    expect(getClassificationIcon("Detached")).toBe("property/detatched");
  });

  it("maps 'Land' to property/land", () => {
    expect(getClassificationIcon("Land")).toBe("property/land");
  });

  it("maps 'House' to property/house", () => {
    expect(getClassificationIcon("House")).toBe("property/house");
  });

  it("returns 'property/other' for unknown classification", () => {
    expect(getClassificationIcon("Unknown")).toBe("property/other");
  });

  it("returns 'property/other' for undefined", () => {
    expect(getClassificationIcon(undefined)).toBe("property/other");
  });
});

// ============================================================================
// getPropertyTypeIcon
// ============================================================================

describe("getPropertyTypeIcon", () => {
  it("maps 'House' to property/house", () => {
    expect(getPropertyTypeIcon("House")).toBe("property/house");
  });

  it("maps 'Flat' to property/flat", () => {
    expect(getPropertyTypeIcon("Flat")).toBe("property/flat");
  });

  it("maps 'Bungalow' to property/bungalow", () => {
    expect(getPropertyTypeIcon("Bungalow")).toBe("property/bungalow");
  });

  it("returns 'property/other' for unknown type", () => {
    expect(getPropertyTypeIcon("Treehouse")).toBe("property/other");
  });

  it("returns 'property/other' for undefined", () => {
    expect(getPropertyTypeIcon(undefined)).toBe("property/other");
  });
});

// ============================================================================
// getRoomTypeIcon
// ============================================================================

describe("getRoomTypeIcon", () => {
  it("returns bedrooms icon for Bedroom roomType", () => {
    expect(getRoomTypeIcon({}, "Bedroom")).toBe("property/bedrooms");
  });

  it("returns bedrooms icon when room has bedSize property", () => {
    expect(getRoomTypeIcon({ bedSize: "DOUBLE" }, "Other")).toBe(
      "property/bedrooms",
    );
  });

  it("returns bathrooms icon for Bathroom roomType", () => {
    expect(getRoomTypeIcon({}, "Bathroom")).toBe("property/bathrooms");
  });

  it("returns kitchen icon for Kitchen roomType", () => {
    expect(getRoomTypeIcon({}, "Kitchen")).toBe("property/kitchen");
  });

  it("returns kitchen icon when room has island property", () => {
    expect(getRoomTypeIcon({ island: true }, "Other")).toBe("property/kitchen");
  });

  it("returns work icon for office room type", () => {
    expect(getRoomTypeIcon({ type: "office" }, "Room")).toBe("property/work");
  });

  it("returns gym icon for gym room type", () => {
    expect(getRoomTypeIcon({ type: "gym" }, "Room")).toBe("property/gym");
  });

  it("returns other-room icon for unknown room type", () => {
    expect(getRoomTypeIcon({ type: "spa" }, "Room")).toBe(
      "property/other-room",
    );
  });
});

// ============================================================================
// getGardenTypeIcon
// ============================================================================

describe("getGardenTypeIcon", () => {
  it("returns front-garden for 'front'", () => {
    expect(getGardenTypeIcon("front")).toBe("property/front-garden");
  });

  it("returns rear-garden for 'rear'", () => {
    expect(getGardenTypeIcon("rear")).toBe("property/rear-garden");
  });
});

// ============================================================================
// getFeatureTypeIcon
// ============================================================================

describe("getFeatureTypeIcon", () => {
  it("returns parking icon", () => {
    expect(getFeatureTypeIcon("parking")).toBe("property/parking");
  });

  it("returns security icon", () => {
    expect(getFeatureTypeIcon("security")).toBe("property/security");
  });

  it("returns default feature icon for unknown key", () => {
    expect(getFeatureTypeIcon("unknown")).toBe("property/feature");
  });
});

// ============================================================================
// getTierFeatures / getTierFeaturesMap / getMaxImagesForTier
// ============================================================================

describe("getTierFeatures", () => {
  it("returns non-empty array for basic", () => {
    expect(getTierFeatures("BASIC").length).toBeGreaterThan(0);
  });

  it("returns non-empty array for featured", () => {
    expect(getTierFeatures("FEATURED").length).toBeGreaterThan(0);
  });

  it("returns non-empty array for premium", () => {
    expect(getTierFeatures("PREMIUM").length).toBeGreaterThan(0);
  });
});

describe("getTierFeaturesMap", () => {
  it("returns map with all three tiers", () => {
    const map = getTierFeaturesMap();
    expect(map).toHaveProperty("BASIC");
    expect(map).toHaveProperty("FEATURED");
    expect(map).toHaveProperty("PREMIUM");
  });

  it("each tier has at least one feature", () => {
    const map = getTierFeaturesMap();
    expect(map["BASIC"]?.length).toBeGreaterThan(0);
    expect(map["FEATURED"]?.length).toBeGreaterThan(0);
    expect(map["PREMIUM"]?.length).toBeGreaterThan(0);
  });
});

describe("getMaxImagesForTier", () => {
  it("returns 50 for PREMIUM", () => {
    expect(getMaxImagesForTier("PREMIUM")).toBe(50);
  });

  it("returns 30 for FEATURED", () => {
    expect(getMaxImagesForTier("FEATURED")).toBe(30);
  });

  it("returns 20 for BASIC", () => {
    expect(getMaxImagesForTier("BASIC")).toBe(20);
  });

  it("returns 5 (default) for null", () => {
    expect(getMaxImagesForTier(null)).toBe(5);
  });

  it("returns 5 (default) for undefined", () => {
    expect(getMaxImagesForTier(undefined)).toBe(5);
  });
});
