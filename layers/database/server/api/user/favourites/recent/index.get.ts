import { getRecentFavourites } from "~~/layers/database/server/utils/user-favourite-listing";

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const result = await getRecentFavourites(user.id as number);

    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
