/**
 * Test endpoint to return first 10 rows from PPD database
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const ppdData = await ppdPrisma.pricePaid.findMany({
      take: 10,
      orderBy: {
        transfer_date: 'desc'
      }
    });
    
    return ppdData;
  } catch (error) {
    console.error("Error fetching PPD test data:", error);
    return errorResponse(error, event);
  }
});