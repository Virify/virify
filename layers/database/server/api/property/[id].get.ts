import type { Fullproperty } from "~~/shared/types/property";
import { getFullPropertyById } from "../../utils/property";

export default defineEventHandler(async (event): Promise<Fullproperty> => {
  const id = getRouterParam(event, "id");

  try {
    const property = await getFullPropertyById(Number(id));

    if (!property) {
      throw createError({
        statusCode: 404,
        statusMessage: "Property not found",
      });
    }

    return property
  } catch (error) {
    throw error;
  }
});
