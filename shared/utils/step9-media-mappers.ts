import type { FloorPlanAssignment, MediaAssignment } from "../types/step9-media";

interface MediaRecordLike {
  id?: number | null;
  image?: string | null;
  videoTour?: string | null;
  floorPlan?: string | null;
  metadata?: string | null;
  bedroomId?: number | null;
  bathroomId?: number | null;
  kitchenId?: number | null;
  receptionId?: number | null;
  otherRoomId?: number | null;
  gardenId?: number | null;
  yardId?: number | null;
  landId?: number | null;
  outdoorSpaceId?: number | null;
}

function parseMediaMetadata(metadata: string | null | undefined): Record<string, any> {
  if (!metadata) return {};
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

export function parseVideoTourFromMediaRecords(records: MediaRecordLike[]): string {
  return (
    records.find((m) => typeof m.videoTour === "string" && m.videoTour.trim())
      ?.videoTour ?? ""
  );
}

export function parseFloorPlansFromMediaRecords(
  records: MediaRecordLike[],
): FloorPlanAssignment[] {
  return records
    .filter((m) => !!m.floorPlan)
    .map((m) => {
      const metadata = parseMediaMetadata(m.metadata);
      return {
        id: m.id ?? undefined,
        cloudflareId: m.floorPlan || "",
        filename: metadata.filename || m.floorPlan || "",
      };
    });
}

export function parseImageMediaFromMediaRecords(
  records: MediaRecordLike[],
): MediaAssignment[] {
  return records
    .filter((m) => !!m.image)
    .map((m) => {
      const metadata = parseMediaMetadata(m.metadata);
      const isGeneral =
        !m.bedroomId &&
        !m.bathroomId &&
        !m.kitchenId &&
        !m.receptionId &&
        !m.otherRoomId &&
        !m.gardenId &&
        !m.yardId &&
        !m.landId;

      return {
        id: m.id ?? undefined,
        cloudflareId: m.image || "",
        filename: metadata.cloudflareImageId || m.image || "",
        description: (metadata.description ?? metadata.alt ?? "").substring(0, 100),
        bedroomId: m.bedroomId || null,
        bathroomId: m.bathroomId || null,
        kitchenId: m.kitchenId || null,
        receptionId: m.receptionId || null,
        otherRoomId: m.otherRoomId || null,
        gardenId: m.gardenId || null,
        yardId: m.yardId || null,
        landId: m.landId || null,
        outdoorSpaceId: m.outdoorSpaceId || null,
        isGeneral,
      };
    });
}

export interface PropertyImageSubmissionItem {
  id?: number;
  cloudflareId: string;
  filename: string | null;
  description: string | null;
  bedroomId: number | null;
  bathroomId: number | null;
  kitchenId: number | null;
  receptionId: number | null;
  otherRoomId: number | null;
  gardenId: number | null;
  yardId: number | null;
  landId: number | null;
  outdoorSpaceId: null;
  isGeneral: boolean;
}

export function mapPropertyImagesForSubmission(
  images: MediaAssignment[],
): PropertyImageSubmissionItem[] {
  const sorted = [...images].sort((a, b) => {
    const aGeneral = a.isGeneral === true;
    const bGeneral = b.isGeneral === true;
    if (aGeneral && !bGeneral) return -1;
    if (!aGeneral && bGeneral) return 1;
    return 0;
  });

  return sorted.map((img) => ({
    id: img.id,
    cloudflareId: img.cloudflareId,
    filename: img.filename || null,
    description: img.description || null,
    bedroomId: img.bedroomId || null,
    bathroomId: img.bathroomId || null,
    kitchenId: img.kitchenId || null,
    receptionId: img.receptionId || null,
    otherRoomId: img.otherRoomId || null,
    gardenId: img.gardenId || null,
    yardId: img.yardId || null,
    landId: img.landId || null,
    outdoorSpaceId: null,
    isGeneral: img.isGeneral ?? true,
  }));
}
