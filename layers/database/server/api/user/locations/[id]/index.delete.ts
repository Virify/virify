import { deleteUserSavedLocation } from "~~/layers/database/server/utils/user-saved-location";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();

  try {
    const { id } = getRouterParams(event);

    if (!user.id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const result = await deleteUserSavedLocation(Number(id), user.id);

    // Send a WebSocket message to update the user's locations count
    const aggregateMessage = createAggregateUpdateMessage("locations", "remove", user.id);
    sendMessage(aggregateMessage);

    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});