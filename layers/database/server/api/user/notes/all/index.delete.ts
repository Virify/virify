/**
 * Delete all notes for a user
 * 
 * DELETE /api/user/notes/all
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const result = await deleteAllUserNotes(userId as number);

    // Invalidate lookups cache so the next GET returns an empty set
    useStorage('cache').removeItem(`notes:lookups:${userId}`).catch(() => {});

    return result;
  } catch (error) {
    console.error("Error deleting all notes:", error);
    return errorResponse(error, event);
  }
});
