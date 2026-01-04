import * as z from "zod";
import { trackSearch } from "~~/layers/database/server/utils/analytics";

const trackSearchSchema = z.object({
  listingType: z.enum(['sale', 'rent', 'all']),
  query: z.string().min(1, "Query is required"),
  radius: z.number().int().min(0),
  resultCount: z.number().int().min(0),
  userId: z.number().int().optional(),
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
 * Handler for POST /api/analytics/search
 * Tracks a search event with location, query, radius, and results
 */
export default defineEventHandler(async (event) => {
  try {
    const data = await readValidatedBody(event, trackSearchSchema.parse);
    await trackSearch(data);
    return { success: true };
  } catch (error) {
    console.error("Error tracking search:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
});
