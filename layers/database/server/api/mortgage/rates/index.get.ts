/**
 * GET /api/mortgage/rates
 * Returns the latest UK mortgage rates from the database
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  const buyerType = query.buyerType as string | undefined
  const rateType = query.rateType as string | undefined
  const ltvBracket = query.ltvBracket as string | undefined

  try {
    const whereClause: any = {
      validUntil: null, // Only get current/latest rates
    }

    if (buyerType) {
      whereClause.buyerType = buyerType
    }

    if (rateType) {
      whereClause.rateType = rateType
    }

    if (ltvBracket) {
      whereClause.ltvBracket = ltvBracket
    }

    const rates = await prisma.mortgageRate.findMany({
      where: whereClause,
      orderBy: [
        { buyerType: 'asc' },
        { rateType: 'asc' },
        { ltvBracket: 'asc' },
      ],
    })

    // If no rates found, return empty array with a message
    if (rates.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No rates found. Run the mortgage:fetch-rates task to populate rates.',
      }
    }

    return {
      success: true,
      data: rates,
      count: rates.length,
    }
  } catch (error: any) {
    console.error('Error fetching mortgage rates:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch mortgage rates',
    })
  }
})
