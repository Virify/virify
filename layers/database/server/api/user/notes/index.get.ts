import { getAllUserNotes } from "~~/layers/database/server/utils/user-note";

/**
 * Get all of a user's notes
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    return await getAllUserNotes(userId);
  } catch (error) {
    console.error("Error fetching all notes:", error);
    return errorResponse(error, event);
  }
});
