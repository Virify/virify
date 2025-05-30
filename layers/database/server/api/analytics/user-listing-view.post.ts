import type { TrackListingViewBody } from "~~/shared/types/analytics";
import { recordListingView } from "../../utils/analytics";

export default defineEventHandler(async (event) => {
  try {
    const { listingId, sessionId } = await readBody<TrackListingViewBody>(event);

    if (!listingId) {
      console.error("Missing listingId in analytics tracking");
      return { success: false };
    }

    let userId = null;
    const { user } = await getUserSession(event);
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
