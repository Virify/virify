import { describe, it, expect } from "vitest";
import { isGeneralImage, getMainImage, getMainImageUrl } from "../utils/main-image";

const roomImage = { image: "img-room", bedroomId: 1 };
const generalItem = { image: "img-general" };
const generalItemNoImage = {};
const kitchenImage = { image: "img-kitchen", kitchenId: 2 };
const bathroomImage = { image: "img-bath", bathroomId: 3 };

describe("isGeneralImage", () => {
  it("returns true when no room IDs are set", () => {
    expect(isGeneralImage({ image: "abc" })).toBe(true);
  });

  it("returns false when bedroomId is set", () => {
    expect(isGeneralImage(roomImage)).toBe(false);
  });

  it("returns false when kitchenId is set", () => {
    expect(isGeneralImage(kitchenImage)).toBe(false);
  });

  it("returns false when bathroomId is set", () => {
    expect(isGeneralImage(bathroomImage)).toBe(false);
  });

  it("returns true for completely empty media item", () => {
    expect(isGeneralImage({})).toBe(true);
  });

  it("returns false when multiple room IDs are set", () => {
    expect(isGeneralImage({ bedroomId: 1, kitchenId: 2 })).toBe(false);
  });
});

describe("getMainImage", () => {
  it("returns null for null property", () => {
    expect(getMainImage(null)).toBeNull();
  });

  it("returns null for undefined property", () => {
    expect(getMainImage(undefined)).toBeNull();
  });

  it("returns null when media is null", () => {
    expect(getMainImage({ media: null })).toBeNull();
  });

  it("returns null when media is empty array", () => {
    expect(getMainImage({ media: [] })).toBeNull();
  });

  it("returns the image ID of the first general image", () => {
    expect(getMainImage({ media: [generalItem] })).toBe("img-general");
  });

  it("returns first general image even if room images exist first", () => {
    expect(getMainImage({ media: [roomImage, generalItem] })).toBe("img-general");
  });

  it("falls back to first image when no general images exist", () => {
    expect(getMainImage({ media: [roomImage, kitchenImage] })).toBe("img-room");
  });

  it("skips media items without an image field", () => {
    expect(getMainImage({ media: [generalItemNoImage, generalItem] })).toBe("img-general");
  });

  it("returns null when all items have no image field", () => {
    expect(getMainImage({ media: [generalItemNoImage] })).toBeNull();
  });
});

describe("getMainImageUrl", () => {
  const cfHash = "abc123";

  it("returns null for null property", () => {
    expect(getMainImageUrl(null, cfHash)).toBeNull();
  });

  it("returns null when no images exist", () => {
    expect(getMainImageUrl({ media: [] }, cfHash)).toBeNull();
  });

  it("builds correct Cloudflare URL with default variant", () => {
    expect(getMainImageUrl({ media: [generalItem] }, cfHash)).toBe(
      "https://imagedelivery.net/abc123/img-general/thumbnail"
    );
  });

  it("builds correct Cloudflare URL with custom variant", () => {
    expect(getMainImageUrl({ media: [generalItem] }, cfHash, "public")).toBe(
      "https://imagedelivery.net/abc123/img-general/public"
    );
  });
});
