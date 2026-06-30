/**
 * Format percentage change with + or - prefix.
 */
export function formatPercentageChange(change: number): string {
  return `${change > 0 ? "+" : ""}${change}%`;
}

/**
 * Format date string to UK locale.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB");
}

/**
 * Format property price vs average comparison.
 */
export function formatVsAverage(propertyPrice: number, average: number): string {
  const diff = propertyPrice - average;
  const percentage = Math.round((diff / average) * 100 * 100) / 100;
  const prefix = percentage > 0 ? "+" : "";
  const suffix = percentage > 0 ? " above avg" : " below avg";
  return `${prefix}${Math.abs(percentage)}%${suffix}`;
}

/**
 * Format property type code to readable name.
 */
export function formatPropertyTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    D: "Detached",
    S: "Semi-Detached",
    T: "Terraced",
    F: "Flat",
    O: "Other",
  };
  return typeMap[type] || type;
}

/**
 * Format yearly trend percentage.
 */
export function formatTrend(trend: number): string {
  const prefix = trend > 0 ? "+" : "";
  return `${prefix}${trend}% YoY`;
}
