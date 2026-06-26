/**
 * Get price paid data for a property by address
 */
export async function getPricePaidByAddress(postcode: string, street: string, city: string, number: string, flat?: string | null): Promise<PricePaidSale[]> {
  const baseWhere: any = {
    postcode: normalisePpdAddressPart(postcode),
    street: normalisePpdAddressPart(street),
    town_city: normalisePpdAddressPart(city),
  };

  const addressMatches = buildPricePaidAddressMatches(number, flat);

  return await ppdPrisma.pricePaid.findMany({
    where: {
      ...baseWhere,
      OR: addressMatches,
    },
    orderBy: {
      transfer_date: "desc",
    },
  });
}

export async function getPricePaidFlatMissDiagnostics(postcode: string, street: string, city: string, number: string, flat: string): Promise<Array<Pick<PricePaidSale, "price" | "transfer_date" | "paon" | "saon" | "property_type">>> {
  const diagnosticMatches = buildPricePaidDiagnosticMatches(number, flat);

  return await ppdPrisma.pricePaid.findMany({
    where: {
      postcode: normalisePpdAddressPart(postcode),
      street: normalisePpdAddressPart(street),
      town_city: normalisePpdAddressPart(city),
      ...(diagnosticMatches.length > 0 ? { OR: diagnosticMatches } : {}),
    },
    select: {
      price: true,
      transfer_date: true,
      paon: true,
      saon: true,
      property_type: true,
    },
    orderBy: {
      transfer_date: "desc",
    },
    take: 25,
  });
}

export function resolvePricePaidAddressParts(address: {
  number?: string | null;
  flat?: string | null;
  street: string;
  fullAddress?: string | null;
}): { number: string | null; flat: string | null } {
  const number = normaliseNullableAddressPart(address.number);
  const flat = normaliseNullableAddressPart(address.flat);

  if (!address.fullAddress) {
    return { number, flat };
  }

  const addressBeforeStreet = getAddressBeforeStreet(address.fullAddress, address.street);
  if (!addressBeforeStreet) {
    return { number, flat };
  }

  const match = addressBeforeStreet.match(/\b\d+[A-Z]?(?:\s*-\s*\d+[A-Z]?)?\b(?!.*\b\d+[A-Z]?(?:\s*-\s*\d+[A-Z]?)?\b)/i);
  if (!match) {
    return { number, flat };
  }

  const inferredNumber = normalisePpdAddressPart(match[0]);
  const inferredFlat = normaliseNullableAddressPart(
    `${addressBeforeStreet.slice(0, match.index)} ${addressBeforeStreet.slice((match.index ?? 0) + match[0].length)}`,
  );
  const resolvedFlat = inferredFlat && (!flat || inferredFlat.includes(flat)) ? inferredFlat : flat;

  return {
    number: number ?? inferredNumber,
    flat: resolvedFlat,
  };
}

export function buildPricePaidAddressMatches(number: string, flat?: string | null): Array<{ paon: string; saon?: string }> {
  const paonCandidates = [normalisePpdAddressPart(number)];
  const saonCandidates = flat ? buildSaonCandidates(flat) : [];
  const flatParts = flat ? splitPpdAddressParts(flat) : [];
  const buildingParts = flatParts.slice(1);

  for (const building of buildingParts) {
    paonCandidates.push(
      normalisePpdAddressPart(`${building}, ${number}`),
      normalisePpdAddressPart(`${building} ${number}`),
    );
  }

  const paons = uniquePopulated(paonCandidates);

  if (saonCandidates.length === 0) {
    return paons.map((paon) => ({ paon }));
  }

  return paons.flatMap((paon) => saonCandidates.map((saon) => ({ paon, saon })));
}

export function buildPricePaidDiagnosticMatches(number: string, flat?: string | null): Array<{ paon?: { contains: string }; saon?: { contains: string } }> {
  const candidates = buildPricePaidAddressMatches(number, flat);
  const parts = flat ? splitPpdAddressParts(flat) : [];
  const buildingParts = parts.slice(1);
  const searchableParts = uniquePopulated([
    ...buildingParts,
    ...candidates.map((candidate) => candidate.paon),
  ]).filter((value) => value !== normalisePpdAddressPart(number));

  return searchableParts.flatMap((part) => [
    { paon: { contains: part } },
    { saon: { contains: part } },
  ]);
}

function buildSaonCandidates(flat: string): string[] {
  const parts = splitPpdAddressParts(flat);
  const candidates = [
    normalisePpdAddressPart(flat),
    normalisePpdAddressPart(flat.replace(/,/g, " ")),
    ...parts,
  ];

  for (const part of parts) {
    candidates.push(...buildFlatSynonyms(part));
  }

  return uniquePopulated(candidates);
}

function buildFlatSynonyms(value: string): string[] {
  const match = value.match(/^(APARTMENT|APT|FLAT)\s+(.+)$/i);
  if (!match?.[2]) return [];

  return [
    normalisePpdAddressPart(`APARTMENT ${match[2]}`),
    normalisePpdAddressPart(`APT ${match[2]}`),
    normalisePpdAddressPart(`FLAT ${match[2]}`),
  ];
}

function splitPpdAddressParts(value: string): string[] {
  return value.split(",").map(normalisePpdAddressPart).filter(Boolean);
}

function normalisePpdAddressPart(value: string): string {
  return value.toUpperCase().replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ").trim();
}

function normaliseNullableAddressPart(value?: string | null): string | null {
  if (!value) return null;
  return normalisePpdAddressPart(value) || null;
}

function uniquePopulated(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function getAddressBeforeStreet(fullAddress: string, street: string): string | null {
  const normalisedFullAddress = normalisePpdAddressPart(fullAddress);
  const normalisedStreet = normalisePpdAddressPart(street);
  const streetIndex = normalisedFullAddress.lastIndexOf(normalisedStreet);

  if (streetIndex === -1) return null;

  return normalisedFullAddress.slice(0, streetIndex).replace(/[,\s]+$/g, "").trim() || null;
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
