import type { TrackListingViewBody } from "~~/shared/types/analytics";
import { recordListingView } from "~~/layers/database/server/utils/analytics";
import * as z from "zod";

const trackListingViewSchema = z.object({
  listingId: z.string().min(1, "listingId is required"),
  sessionId: z.string().optional(),
});
/**
 * Handler for POST /api/analytics/listing/track-view
 * Tracks a listing view event
 */
export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  try {
    const { listingId, sessionId } = await readValidatedBody(event, trackListingViewSchema.parse);
    let userId = null;
    userId = user?.id || null;
    
    // Record the view in the database using the utility function
    await recordListingView(listingId, userId, sessionId?.toString() || null);

    // SendBeacon doesn't process responses, but we return something anyway
    return { success: true };
  } catch (error) {
    // Log the error server-side but don't block anything
    console.error("Error tracking listing view:", error);
    return { success: false };
  }
});
