
type CurrencyString = `£${string}`

/**
 * Format Price for GBP
 * 
 * @param {Number} value
 * @param {Boolean} value* - false
 * @returns string
 */
export function numberToCurrency(value: number, isFloor = false): string {
  if (!Number.isFinite(value)) return '£-'

  // Conditionally round down, if we want no decimal places
  value = isFloor ? Math.floor(value) : value

  // Format as currency, then return
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