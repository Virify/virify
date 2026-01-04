export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event)
  try {
    if(!user) {
      return createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    const count = await waitingListPrisma.waitingList.count();
    return {
      totalWaitingList: count
    }
  } catch (error: any) {
    console.error("Error fetching waiting list count:", error);
    return errorResponse(error, event);
  }
});