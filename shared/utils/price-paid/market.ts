/**
 * Pick the market context reference year from sale history and current date.
 */
export function getPricePaidReferenceYear(sortedSales: PricePaidSale[]): number {
  const currentYear = new Date().getFullYear();
  const effectiveCurrentYear = new Date().getMonth() < 3 ? currentYear - 1 : currentYear;
  const mostRecentSaleYear = sortedSales.length > 0 && sortedSales[0]
    ? new Date(sortedSales[0].transfer_date).getFullYear()
    : effectiveCurrentYear;

  return Math.max(effectiveCurrentYear, mostRecentSaleYear);
}

/**
 * Create an inclusive calendar-year date range for PPD aggregate queries.
 */
export function createPricePaidYearRange(year: number): { start: Date; end: Date } {
  return {
    start: new Date(`${year}-01-01`),
    end: new Date(`${year}-12-31`),
  };
}

/**
 * Convert PPD aggregate query results into listing market context.
 */
export function createMarketContext(input: {
  referenceYear: number;
  latestPrice: number;
  stats: PricePaidMarketStats;
}): MarketContext {
  const areaAverage = input.stats.areaStats._avg.price ? Math.round(input.stats.areaStats._avg.price) : null;
  const propertyTypeAverage = input.stats.propertyTypeStats._avg.price ? Math.round(input.stats.propertyTypeStats._avg.price) : null;

  let percentile: number | null = null;

  if (input.stats.allAreaPrices.length > 0) {
    const belowCount = input.stats.allAreaPrices.filter((p) => p.price < input.latestPrice).length;
    percentile = Math.round((belowCount / input.stats.allAreaPrices.length) * 100);
  }

  let yearlyTrend: number | null = null;

  if (areaAverage && input.stats.previousYearStats._avg.price) {
    const previousAvg = input.stats.previousYearStats._avg.price;
    yearlyTrend = Math.round(((areaAverage - previousAvg) / previousAvg) * 100 * 100) / 100;
  }

  return {
    reference_year: input.referenceYear,
    area_average: areaAverage,
    property_type_average: propertyTypeAverage,
    percentile,
    yearly_trend: yearlyTrend,
    sample_size: input.stats.areaStats._count.price || 0,
    property_type_sample_size: input.stats.propertyTypeStats._count.price || 0,
  };
}
