// enum RentalPriceType {
//   WEEKLY
//   MONTHLY
// }

// enum SalePriceType {
//   FIXED
//   OFFERS_OVER
//   GUIDE_PRICE
// }

/**
 * Format and return a pretty price type enum
 * 
 * @param type Price Type enum
 * @returns string
 */
export function mapPriceType(type: string): string {
  return type.toLowerCase().replace("_", " ")
}