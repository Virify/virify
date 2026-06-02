import { describe, it, expect } from "vitest";
import {
  createEmptyMediaAssignment,
  groupImagesByRoom,
  generateAccordionItems,
  formatMediaForSubmission,
  generateRoomOptions,
  parseRoomAssignment,
  getSelectedRoom,
} from "../app/utils/step9";
import {
  createInitialStep9Values,
  step9Validation,
} from "../../../shared/utils/listing-step9-schema";

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

const emptyRooms = {
  bedrooms: [],
  bathrooms: [],
  kitchens: [],
  receptions: [],
  otherRooms: [],
  gardens: [],
  yards: [],
  lands: [],
};

function makeGeneral(id: string): any {
  return { ...createEmptyMediaAssignment(id, `${id}.jpg`) };
}

function makeRoomImage(id: string, bedroomId: number): any {
  return {
    ...createEmptyMediaAssignment(id, `${id}.jpg`),
    bedroomId,
    isGeneral: false,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// createEmptyMediaAssignment
// ──────────────────────────────────────────────────────────────────────────────

describe("createEmptyMediaAssignment", () => {
  it("creates assignment with correct cloudflareId and filename", () => {
    const result = createEmptyMediaAssignment("abc-123", "photo.jpg");
    expect(result.cloudflareId).toBe("abc-123");
    expect(result.filename).toBe("photo.jpg");
  });

  it("all room IDs are null", () => {
    const result = createEmptyMediaAssignment("abc-123", "photo.jpg");
    expect(result.bedroomId).toBeNull();
    expect(result.bathroomId).toBeNull();
    expect(result.kitchenId).toBeNull();
    expect(result.receptionId).toBeNull();
    expect(result.otherRoomId).toBeNull();
    expect(result.gardenId).toBeNull();
    expect(result.yardId).toBeNull();
    expect(result.landId).toBeNull();
  });

  it("isGeneral defaults to true", () => {
    const result = createEmptyMediaAssignment("abc-123", "photo.jpg");
    expect(result.isGeneral).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// groupImagesByRoom
// ──────────────────────────────────────────────────────────────────────────────

describe("groupImagesByRoom", () => {
  it("places general images in a 'general' group", () => {
    const groups = groupImagesByRoom([makeGeneral("img1")], emptyRooms);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.key).toBe("general");
    expect(groups[0]!.images).toHaveLength(1);
  });

  it("general group appears first when mixed with room images", () => {
    const images = [makeRoomImage("img2", 1), makeGeneral("img1")];
    const groups = groupImagesByRoom(images, {
      ...emptyRooms,
      bedrooms: [{ id: 1, name: "Master Bedroom" }],
    });
    expect(groups[0]!.key).toBe("general");
  });

  it("groups room images under the correct key", () => {
    const images = [makeRoomImage("img1", 5)];
    const groups = groupImagesByRoom(images, {
      ...emptyRooms,
      bedrooms: [{ id: 5, name: "Guest Room" }],
    });
    expect(groups.some((g) => g.key === "bedroom-5")).toBe(true);
  });

  it("returns empty array for empty images input", () => {
    expect(groupImagesByRoom([], emptyRooms)).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// generateAccordionItems
// ──────────────────────────────────────────────────────────────────────────────

describe("generateAccordionItems", () => {
  it("maps each group to an accordion item with count", () => {
    const groups = groupImagesByRoom(
      [makeGeneral("img1"), makeGeneral("img2")],
      emptyRooms,
    );
    const items = generateAccordionItems(groups);
    expect(items).toHaveLength(1);
    expect(items[0]!.count).toBe(2);
    expect(items[0]!.value).toBe("general");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// formatMediaForSubmission
// ──────────────────────────────────────────────────────────────────────────────

describe("formatMediaForSubmission", () => {
  it("places general images first", () => {
    const media = [makeRoomImage("room", 1), makeGeneral("gen")];
    const result = formatMediaForSubmission(media);
    expect(result[0]!.isGeneral).toBe(true);
  });

  it("does not mutate the original array", () => {
    const media = [makeRoomImage("room", 1), makeGeneral("gen")];
    const original = [...media];
    formatMediaForSubmission(media);
    expect(media[0]!.cloudflareId).toBe(original[0]!.cloudflareId);
  });

  it("sets outdoorSpaceId to null", () => {
    const result = formatMediaForSubmission([makeGeneral("gen")]);
    expect(result[0]!.outdoorSpaceId).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// generateRoomOptions
// ──────────────────────────────────────────────────────────────────────────────

describe("generateRoomOptions", () => {
  it("always includes a General option first", () => {
    const opts = generateRoomOptions(emptyRooms);
    expect(opts[0]!.value).toBe("general");
  });

  it("includes bedroom options", () => {
    const opts = generateRoomOptions({
      ...emptyRooms,
      bedrooms: [{ id: 1, name: "Master" }],
    });
    expect(opts.some((o) => o.value === "bedroom-1")).toBe(true);
  });

  it("includes bathroom options", () => {
    const opts = generateRoomOptions({
      ...emptyRooms,
      bathrooms: [{ id: 2, name: "En Suite" }],
    });
    expect(opts.some((o) => o.value === "bathroom-2")).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// parseRoomAssignment
// ──────────────────────────────────────────────────────────────────────────────

describe("parseRoomAssignment", () => {
  it("returns isGeneral:true for 'general'", () => {
    const result = parseRoomAssignment("general");
    expect(result.isGeneral).toBe(true);
    expect(result.bedroomId).toBeNull();
  });

  it("parses bedroom-1 correctly", () => {
    const result = parseRoomAssignment("bedroom-1");
    expect(result.bedroomId).toBe(1);
    expect(result.isGeneral).toBe(false);
  });

  it("parses bathroom-3 correctly", () => {
    const result = parseRoomAssignment("bathroom-3");
    expect(result.bathroomId).toBe(3);
    expect(result.bedroomId).toBeNull();
  });

  it("parses otherRoom-7 correctly", () => {
    const result = parseRoomAssignment("otherRoom-7");
    expect(result.otherRoomId).toBe(7);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getSelectedRoom
// ──────────────────────────────────────────────────────────────────────────────

describe("getSelectedRoom", () => {
  it("returns 'general' for a general assignment", () => {
    expect(getSelectedRoom(makeGeneral("img"))).toBe("general");
  });

  it("returns 'bedroom-N' for a bedroom assignment", () => {
    expect(getSelectedRoom(makeRoomImage("img", 5))).toBe("bedroom-5");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// createInitialStep9Values
// ──────────────────────────────────────────────────────────────────────────────

describe("createInitialStep9Values", () => {
  it("description starts empty when no draft data provided", () => {
    const state = createInitialStep9Values();
    expect(state.property.description).toBe("");
  });

  it("description is populated from draft data", () => {
    const state = createInitialStep9Values({
      property: { description: "A lovely property.", media: [] },
    });
    expect(state.property.description).toBe("A lovely property.");
  });

  it("media starts empty when no draft data provided", () => {
    const state = createInitialStep9Values();
    expect(state.property.media).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// step9Validation.isStep9Valid
// ──────────────────────────────────────────────────────────────────────────────

describe("isStep9Valid", () => {
  const validState = {
    property: {
      description: "A lovely property in the city centre area.",
      media: [],
    },
  };

  it("returns true for a valid description", () => {
    expect(step9Validation.isStep9Valid(validState)).toBe(true);
  });

  it("returns false when description is empty", () => {
    expect(
      step9Validation.isStep9Valid({
        property: { ...validState.property, description: "" },
      }),
    ).toBe(false);
  });

  it("returns false when description is too short (< 10 chars)", () => {
    expect(
      step9Validation.isStep9Valid({
        property: { ...validState.property, description: "Too short" },
      }),
    ).toBe(false);
  });
});
