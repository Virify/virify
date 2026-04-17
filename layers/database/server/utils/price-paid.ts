/**
 * Get price paid data for a property by address
 */
export async function getPricePaidByAddress(postcode: string, street: string, city: string, number: string, flat?: string | null): Promise<PricePaidSale[]> {
  const whereConditions: any = {
    postcode: postcode.toUpperCase(),
    street: street.toUpperCase(),
    town_city: city.toUpperCase(),
    paon: number.toUpperCase(),
  };

  if (flat) {
    whereConditions.saon = flat.toUpperCase();
  }

  return await ppdPrisma.pricePaid.findMany({
    where: whereConditions,
    orderBy: {
      transfer_date: "desc",
    },
  });
}

/**
 * Get all price paid data for a postcode, optionally narrowed to a street.
 * Used for street-level market context in the listing editor.
 */
export async function getPricePaidByPostcodeAndStreet(postcode: string, street?: string | null): Promise<PricePaidSale[]> {
  return await ppdPrisma.pricePaid.findMany({
    where: {
      postcode: postcode.toUpperCase(),
      ...(street ? { street: street.toUpperCase() } : {}),
    },
    orderBy: { transfer_date: "desc" },
  });
}

/**
 * Calculate market context for a property
 *
 * This function provides analytics to help understand how a property's sale price compares to the local market.
 *
 * Analytics returned:
 * - reference_year: The year used for all calculations (the most recent sale year or current year)
 * - area_average: The average sale price for all properties in the same city (excluding the subject property) in the reference year
 * - property_type_average: The average sale price for the same property type in the same city (excluding the subject property) in the reference year
 * - percentile: The percentage of sales in the area that were below the subject property's latest sale price (e.g. 80 = top 20%)
 * - yearly_trend: The percentage change in average price for the area compared to the previous year
 * - sample_size: The number of sales in the area used for the area_average
 * - property_type_sample_size: The number of sales in the area for the same property type
 */
export async function calculateMarketContext(city: string, postcode: string, number: string, flat: string | null | undefined, propertyType: string | null, latestPrice: number, sortedSales: PricePaidSale[]): Promise<MarketContext> {
  const currentYear = new Date().getFullYear();
  // If it's early in the year (Jan-March), use previous year as reference to ensure we have data
  const effectiveCurrentYear = new Date().getMonth() < 3 ? currentYear - 1 : currentYear;
  
  const mostRecentSaleYear = sortedSales.length > 0 && sortedSales[0] ? new Date(sortedSales[0].transfer_date).getFullYear() : effectiveCurrentYear;
  const referenceYear = Math.max(effectiveCurrentYear, mostRecentSaleYear);
  const yearStart = new Date(`${referenceYear}-01-01`);
  const yearEnd = new Date(`${referenceYear}-12-31`);
  const [areaStats, propertyTypeStats, allAreaPrices] = await Promise.all([

    ppdPrisma.pricePaid.aggregate({
      where: {
        town_city: city.toUpperCase(),
        transfer_date: {
          gte: yearStart,
          lte: yearEnd,
        },
        NOT: {
          postcode: postcode.toUpperCase(),
          paon: number.toUpperCase(),
          ...(flat ? { saon: flat.toUpperCase() } : {}),
        },
      },
      _avg: { price: true },
      _count: { price: true },
    }),

    ppdPrisma.pricePaid.aggregate({
      where: {
        town_city: city.toUpperCase(),
        property_type: propertyType,
        transfer_date: {
          gte: yearStart,
          lte: yearEnd,
        },
        NOT: {
          postcode: postcode.toUpperCase(),
          paon: number.toUpperCase(),
          ...(flat ? { saon: flat.toUpperCase() } : {}),
        },
      },
      _avg: { price: true },
      _count: { price: true },
    }),

    ppdPrisma.pricePaid.findMany({
      where: {
        town_city: city.toUpperCase(),
        transfer_date: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
      select: { price: true },
      orderBy: { price: "asc" },
    }),

  ]);

  const previousYear = referenceYear - 1;

  const previousYearStats = await ppdPrisma.pricePaid.aggregate({
    where: {
      town_city: city.toUpperCase(),
      transfer_date: {
        gte: new Date(`${previousYear}-01-01`),
        lte: new Date(`${previousYear}-12-31`),
      },
    },
    _avg: { price: true },
  });

  const areaAverage = areaStats._avg.price ? Math.round(areaStats._avg.price) : null;

  const propertyTypeAverage = propertyTypeStats._avg.price ? Math.round(propertyTypeStats._avg.price) : null;

  let percentile: number | null = null;

  if (allAreaPrices.length > 0) {
    const belowCount = allAreaPrices.filter((p: { price: number }) => p.price < latestPrice).length;
    percentile = Math.round((belowCount / allAreaPrices.length) * 100);
  }

  let yearlyTrend: number | null = null;

  if (areaAverage && previousYearStats._avg.price) {
    const previousAvg = previousYearStats._avg.price;
    yearlyTrend = Math.round(((areaAverage - previousAvg) / previousAvg) * 100 * 100) / 100;
  }
  
  return {
    reference_year: referenceYear,
    area_average: areaAverage,
    property_type_average: propertyTypeAverage,
    percentile: percentile,
    yearly_trend: yearlyTrend,
    sample_size: areaStats._count.price || 0,
    property_type_sample_size: propertyTypeStats._count.price || 0,
  };
}

/**
 * Calculate percentage change between sales
 */
/**
 * Calculate the percentage change between two sale prices
 * @param currentPrice The more recent sale price
 * @param previousPrice The previous sale price
 * @returns Percentage change, rounded to 2 decimal places (e.g. 10.25 = +10.25%)
 */
export function calculatePercentageChange(currentPrice: number, previousPrice: number): number {
  const priceDiff = currentPrice - previousPrice;
  return Math.round((priceDiff / previousPrice) * 100 * 100) / 100;
}

/**
 * Process raw PPD sales data into a format with percentage changes between sales
 *
 * For each sale, calculates the percentage change from the previous sale (if available).
 * The first sale in the array will have percentage_change = null.
 *
 * @param sortedSales Array of sales, sorted from most recent to oldest
 * @returns Array of processed sales with percentage_change field
 */
export function processPricePaidSales(sortedSales: PricePaidSale[]): ProcessedPricePaidSale[] {
  return sortedSales.map((item, index) => {
    let percentageChange: number | null = null;
    if (index < sortedSales.length - 1) {
      const previousSale = sortedSales[index + 1];
      if (previousSale && previousSale.price) {
        percentageChange = calculatePercentageChange(item.price, previousSale.price);
      }
    }
    return {
      price: item.price,
      transfer_date: item.transfer_date.toISOString(),
      transaction_id: item.transaction_id,
      old_new: item.old_new,
      duration: item.duration,
      property_type: item.property_type,
      percentage_change: percentageChange,
    };
  });
}
