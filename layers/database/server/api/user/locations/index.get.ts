import { getUserSavedLocations } from "~~/layers/database/server/utils/user-saved-location";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();
  try {
    if (!user.id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    return await getUserSavedLocations(user.id);
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
