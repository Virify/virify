/**
 * Check that argument is a number
 * 
 * @param {Number} arg
 */
export function isNumber(arg: unknown): arg is number {
  return !!Number(arg) || Number(arg) === 0
}

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