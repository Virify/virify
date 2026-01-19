import { getUserNoteLookups } from "~~/layers/database/server/utils/user-note";

/**
 * Get lightweight notes lookups (listing IDs and note content only)
 * Used for checking if listings have notes and displaying note content without fetching full listing data
 * 
 * GET /api/user/notes/all/lookups
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    return await getUserNoteLookups(userId as number);
  } catch (error) {
    console.error("Error fetching note lookups:", error);
    return errorResponse(error, event);
  }
});
