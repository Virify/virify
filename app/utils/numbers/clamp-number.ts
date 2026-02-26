interface Range {
  min: number
  max: number
}

/**
 *  Clamp a number between a given range
 *
 */
export function clampNumber(num: number, range: Range): number {
  let { min, max } = asObject(range) as unknown as Record<string, number>

  // Ensure max/min values are valid
  if (!min || !Number.isFinite(min)) min = 0;
  if (!max || !Number.isFinite(max)) max = Infinity;

  // If num is not a number, return min value
  if (!Number.isFinite(num)) return min

  // Sort min/max values
  const realMin = Math.min(min, max);
  const realMax = Math.max(min, max);

  // Return number within bounds
  return Math.max(Math.min(num, realMax), realMin)
}