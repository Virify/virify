export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const count = await waitingListPrisma.waitingList.count();
    return {
      totalWaitingList: count
    }
  } catch (error: any) {
    console.error("Error fetching waiting list count:", error);
    return errorResponse(error, event);
  }
});