/**
 * Rounds a float to a specified number of decimal places.
 * 
 * @param value Float
 * @param decimalPlaces number
 * @returns number
 */
export function roundFloat(value: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}