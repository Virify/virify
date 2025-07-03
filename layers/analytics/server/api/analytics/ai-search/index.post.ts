import * as z from "zod";

const trackSearchSchema = z.object({
  aiQuery: z.string().min(1, "Query is required"),
  location: z.object({
    id: z.string(),
    type: z.string(),
    place_name_en: z.string(),
    geometry: z.object({
      type: z.string(),
      coordinates: z.tuple([z.number(), z.number()]),
    }),
    properties: z.record(z.any()),
  }),
});
/**
 * Handler for POST /api/analytics/listing/track-view
 * Tracks a listing view event
 */
export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  try {
    const { aiQuery, location } = await readValidatedBody(event, trackSearchSchema.parse);
    let userId = null;
    userId = user?.id || null;

    await trackAiSearch(aiQuery, userId, location);

    return { success: true };
  } catch (error) {
    console.error("Error tracking listing view:", error);
    return { success: false };
  }
});
