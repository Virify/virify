import * as z from "zod";
import { trackSearch } from "~~/layers/database/server/utils/analytics";

const trackSearchSchema = z.object({
  searchType: z.enum(["ai", "traditional"]).default("ai"),
  listingType: z.enum(["sale", "rent", "all"]),
  query: z.string().min(1, "Query is required"),
  radius: z.number().min(0),
  resultCount: z.number().int().min(0),
  location: z.object({
    id: z.string(),
    placeName: z.string(),
    text: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  usedTerms: z.array(z.string()).optional().default([]),
  ignoredTerms: z.array(z.string()).optional().default([]),
});

/**
 * Handler for POST /api/analytics/search
 * Tracks a search event with location, query, radius, and results
 */
export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);

  try {
    const data = trackSearchSchema.parse(rawBody);

    // Derive userId from session only — never accept from request body
    const { user } = await getUserSession(event);

    // Reconstruct the GeocodingFeature shape expected by the trackSearch utility
    const { location, usedTerms, ignoredTerms, searchType, ...rest } = data;
    await trackSearch({
      ...rest,
      searchType,
      userId: user?.id,
      usedTerms,
      ignoredTerms,
      location: {
        id: location.id,
        place_name_en: location.placeName,
        place_name: location.placeName,
        text: location.text,
        geometry: {
          type: "Point",
          coordinates: [location.lon, location.lat] as [number, number],
        },
      } as Parameters<typeof trackSearch>[0]["location"],
    });
    return { success: true };
  } catch (error) {
    console.error("[analytics/search] ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});
