interface ListingMediaLike {
  id?: number | null;
  metadata?: string | Record<string, any> | null;
  videoTour?: string | null;
  floorPlan?: string | null;
}

export interface ListingFloorPlanItem {
  id?: number;
  cloudflareId: string;
  title: string;
}

function parseMetadata(metadata: ListingMediaLike["metadata"]): Record<string, any> {
  if (!metadata) return {};
  if (typeof metadata === "object") return metadata;

  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

export function getPropertyVideoTourUrl(
  media: ListingMediaLike[] | null | undefined,
): string {
  if (!Array.isArray(media)) return "";

  return (
    media.find((item) => typeof item.videoTour === "string" && item.videoTour.trim())
      ?.videoTour ?? ""
  );
}

export function extractYoutubeVideoId(value: string): string {
  const input = (value || "").trim();
  if (!input) return "";

  // Backend validation already constrains supported URLs; keep extraction lightweight.
  const directIdMatch = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (directIdMatch) return directIdMatch[0];

  const watchMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) return watchMatch[1];

  const shortOrEmbedMatch = input.match(
    /(?:youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/,
  );
  if (shortOrEmbedMatch?.[1]) return shortOrEmbedMatch[1];

  return "";
}

export function getListingFloorPlans(
  media: ListingMediaLike[] | null | undefined,
): ListingFloorPlanItem[] {
  if (!Array.isArray(media)) return [];

  return media
    .filter((item) => typeof item.floorPlan === "string" && item.floorPlan.trim())
    .map((item, index) => {
      const metadata = parseMetadata(item.metadata);

      return {
        id: item.id ?? undefined,
        cloudflareId: item.floorPlan as string,
        title:
          metadata?.filename ||
          metadata?.alt ||
          metadata?.description ||
          `Floor Plan ${index + 1}`,
      };
    });
}
