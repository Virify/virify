import { getListingOpenHouseSessions } from "~~/layers/database/server/utils/open-house";

/** Public endpoint — no auth required. Returns upcoming sessions for a listing. */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const listingId = Number(getRouterParam(event, "id"));
    if (!listingId || isNaN(listingId))
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid listing ID",
      });

    const sessions = await getListingOpenHouseSessions(listingId);
    return sessions;
  } catch (error) {
    return errorResponse(error, event);
  }
});
