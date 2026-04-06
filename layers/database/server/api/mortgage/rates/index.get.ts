/**
 * GET /api/mortgage/rates
 * Returns the latest UK mortgage rates from the database.
 * Reuses the shared `mortgage:rates` cache key populated by the monthly cron task
 * and /api/mortgage/calculate — avoids a redundant DB query when the cache is warm.
 * On cache miss, fetches all rates, warms the cache, then filters in JS.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const buyerType = query.buyerType as string | undefined
  const rateType = query.rateType as string | undefined
  const ltvBracket = query.ltvBracket as string | undefined

  try {
    const storage = useStorage('cache')
    let allRates = await storage.getItem<any[]>('mortgage:rates')

    if (!allRates) {
      allRates = await prisma.mortgageRate.findMany({
        where: { validUntil: null },
        orderBy: [
          { buyerType: 'asc' },
          { rateType: 'asc' },
          { ltvBracket: 'asc' },
        ],
      })
      // 4-week TTL matches the monthly cron refresh schedule
      storage.setItem('mortgage:rates', allRates, { ttl: 60 * 60 * 24 * 28 }).catch(() => {})
    }

    // Filter in JS — avoids a second DB round-trip when the cache is warm
    const rates = allRates.filter((r: any) => {
      if (buyerType && r.buyerType !== buyerType) return false
      if (rateType && r.rateType !== rateType) return false
      if (ltvBracket && r.ltvBracket !== ltvBracket) return false
      return true
    })

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
