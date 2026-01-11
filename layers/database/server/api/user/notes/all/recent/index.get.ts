/**
 * Get recent user notes (last 7 days, limited to 8 items)
 * Used for dashboard homepage
 * 
 * GET /api/user/notes/all/recent
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const notes = await getRecentUserNotes(userId as number, 8);

    return notes;
  } catch (error) {
    console.error("Error fetching recent notes:", error);
    return errorResponse(error, event);
  }
});
