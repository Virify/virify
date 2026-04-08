import { cancelViewing } from "~~/layers/database/server/utils/viewing";

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const id = Number(getRouterParam(event, "id"));
    if (!id) throw createError({ statusCode: 400, statusMessage: "Missing viewing ID" });

    const cancelled = await cancelViewing(id, user.id as number);

    return cancelled;
  } catch (error) {
    console.error("Error cancelling viewing:", error);
    return errorResponse(error, event);
  }
});
