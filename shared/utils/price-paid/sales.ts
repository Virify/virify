const PROPERTY_TYPE_MAP: Record<string, string> = {
  D: "Detached",
  S: "Semi-detached",
  T: "Terraced",
  F: "Flats/Maisonettes",
  O: "Other",
};

const DURATION_MAP: Record<string, string> = {
  F: "Freehold",
  L: "Leasehold",
};

/**
 * Group raw PPD sale rows by display address for postcode and street results.
 */
export function groupPricePaidSalesByAddress(sales: PricePaidSale[]): PricePaidGroup[] {
  const groupedData = sales.reduce(
    (acc, item) => {
      const fullAddress = createPricePaidFullAddress(item);
      if (!acc[fullAddress]) {
        acc[fullAddress] = {
          full_address: fullAddress,
          property_type_display: PROPERTY_TYPE_MAP[item.property_type || ""] || item.property_type,
          duration_display: DURATION_MAP[item.duration || ""] || item.duration,
          sales: [],
        };
      }

      acc[fullAddress].sales.push({
        price: item.price,
        transfer_date: item.transfer_date,
        transaction_id: item.transaction_id,
      });

      return acc;
    },
    {} as Record<string, PricePaidGroup>,
  );

  return Object.values(groupedData).map((group) => ({
    ...group,
    sales: sortPricePaidGroupedSales(group.sales),
  }));
}

/**
 * Map sorted PPD sales into API sale history with percentage movement.
 */
export function processPricePaidSales(sortedSales: PricePaidSale[]): ProcessedPricePaidSale[] {
  return sortedSales.map((item, index) => {
    let percentageChange: number | null = null;
    if (index < sortedSales.length - 1) {
      const previousSale = sortedSales[index + 1];
      if (previousSale?.price) {
        percentageChange = calculatePricePaidPercentageChange(item.price, previousSale.price);
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

/**
 * Calculate percentage movement between two sale prices.
 */
export function calculatePricePaidPercentageChange(currentPrice: number, previousPrice: number): number {
  const priceDiff = currentPrice - previousPrice;
  return Math.round((priceDiff / previousPrice) * 100 * 100) / 100;
}

/**
 * Create a compact street summary from grouped PPD sale rows.
 */
export function createPricePaidStreetSummary(groups: PricePaidGroup[] | null | undefined): PricePaidStreetSummary | null {
  if (!groups?.length) return null;

  const allSales = getPricePaidGroupedSales(groups);

  if (!allSales.length) return null;

  const recentSales = getRecentPricePaidGroupedSales(allSales);
  const statsBase = recentSales.length ? recentSales : allSales.slice(0, 20);
  const prices = statsBase.map((sale) => sale.price);

  return {
    avg: getAveragePrice(prices),
    min: Math.min(...prices),
    max: Math.max(...prices),
    recentCount: recentSales.length || allSales.length,
    period: recentSales.length ? "past 12 months" : "all time",
    lastSales: allSales.slice(0, 5).map((sale) => ({
      ...sale,
      formattedDate: new Date(sale.transfer_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    })),
  };
}

/**
 * Flatten grouped PPD sales and attach their display address.
 */
function getPricePaidGroupedSales(groups: PricePaidGroup[]): Array<PricePaidGroupedSale & { full_address: string }> {
  return groups
    .flatMap((group) => group.sales.map((sale) => ({ ...sale, full_address: group.full_address })))
    .sort((a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime());
}

/**
 * Filter grouped PPD sales to the past twelve months.
 */
function getRecentPricePaidGroupedSales(
  sales: Array<PricePaidGroupedSale & { full_address: string }>,
): Array<PricePaidGroupedSale & { full_address: string }> {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  return sales.filter((sale) => new Date(sale.transfer_date) >= cutoff);
}

/**
 * Calculate a rounded average from sale prices.
 */
function getAveragePrice(prices: number[]): number {
  return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
}

/**
 * Sort grouped sale rows newest first.
 */
function sortPricePaidGroupedSales(sales: PricePaidGroupedSale[]): PricePaidGroupedSale[] {
  return sales.sort((a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime());
}

/**
 * Create a compact display address from raw PPD address columns.
 */
function createPricePaidFullAddress(item: PricePaidSale): string {
  return [
    item.saon,
    item.paon,
    item.street,
    item.town_city,
    item.postcode,
  ].filter(Boolean).join(", ");
}
