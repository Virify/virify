import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import * as z from "zod";

const BodySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(120)
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();
  try {
    if (!user.id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const { id, name } = await readValidatedBody(event, BodySchema.parse);

    const updated = await updateUserSavedLocationName(id, user.id, name);

    const aggregateMessage = createAggregateUpdateMessage("locations", "update", user.id);
    sendMessage(aggregateMessage);

    return updated;
  } catch (error) {
    return errorResponse(error, event);
  }
});