import * as z from "zod";
import { trackAiSearch } from "~~/layers/database/server/utils/analytics";

const trackSearchSchema = z.object({
  aiQuery: z.string().min(1, "Query is required"),
  location: z.object({
    id: z.string(),
    type: z.string(),
    text: z.string(),
    place_name_en: z.string(),
    place_name: z.string(),
    geometry: z.object({
      type: z.string(),
      coordinates: z.tuple([z.number(), z.number()]),
    }),
    properties: z.record(z.any(), z.any()),
  }),
});
/**
 * Handler for POST /api/analytics/listing/track-view
 * Tracks a listing view event
 */
export default defineEventHandler(async (event) => {
  try {
    const { aiQuery, location } = await readValidatedBody(event, trackSearchSchema.parse);
    await trackAiSearch(aiQuery, location);
    return { success: true };
  } catch (error) {
    console.error("Error tracking search:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
});
