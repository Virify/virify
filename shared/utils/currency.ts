
type CurrencyString = `£${string}`

/**
 * Format Price for GBP
 * 
 * @param value string
 * @returns string
 */
export function numberToCurrency(value: number): string {
  if (!Number.isFinite(value)) return '£-'

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Parses a currency input string to a number
 * 
 * @param input string
 * @returns number
 */
export function currencyToNumber(input: string): number {
  return parseInt(input.replace(/[^\d]/g, ""), 10) || 0;
}