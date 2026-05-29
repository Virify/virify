import { deleteOpenHouseSession } from "~~/layers/database/server/utils/open-house";

/** Owner-only: delete an open house session by ID */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const id = Number(getRouterParam(event, "id"));
    if (!id || isNaN(id))
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid session ID",
      });

    const deleted = await deleteOpenHouseSession(id, user.id as number);
    if (!deleted)
      throw createError({
        statusCode: 403,
        statusMessage: "Session not found or unauthorized",
      });

    return { success: true };
  } catch (error) {
    return errorResponse(error, event);
  }
});
