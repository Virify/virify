import * as z from "zod";
import { updateUserSavedLocation } from "~~/layers/database/server/utils/user-saved-location";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const LocationSchema = z
  .object({
    id: z.number().optional(),
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
    location: z.string(),
    geocodingFeature: z.object({
      id: z.string(),
      text: z.string(),
      type: z.string(),
      place_name_en: z.string(),
      geometry: z.object({
        type: z.string(),
        coordinates: z.tuple([z.number(), z.number()]),
      }),
      properties: z.record(z.any()),
    }),
  })
  .optional();

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();
  const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();
  try {
    const newLocation = await readValidatedBody(event, LocationSchema.parse);

    if (!user.id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    // Create the user saved location in the database
    if (newLocation) {
      const { id, name, geocodingFeature, lat, lon, location } = newLocation;

      const savedLocation = await updateUserSavedLocation(id, user.id, {
        name,
        geocodingFeature,
        lat,
        lon,
        location,
      });
      // if updated location has no ID, it means it's a new location
      if (!newLocation?.id) {
        const aggregateMessage = createAggregateUpdateMessage("locations", "add", user.id);

        sendMessage(aggregateMessage);
      } else {
        const aggregateMessage = createAggregateUpdateMessage("locations", "update", user.id);
        sendMessage(aggregateMessage);
      }

      return savedLocation;
    }
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
