import { getUserSavedLocations } from "../../../utils/user-saved-location";

/**
 * Get user saved listings (favourites)
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const result = await getUserSavedLocations(userId as number);
    console.log("User saved locations:", result);
    return result;
  } catch (error) {
    console.log(error)
    errorResponse(error, event);
  }
});
