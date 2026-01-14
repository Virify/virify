
/**
 * Calculates a new aggregate count based on an optimistic update
 */
export function calculateOptimisticCount(
  currentCount: number | undefined, 
  operation: 'add' | 'remove'
): number {
  const count = currentCount || 0;
  return operation === "add" ? count + 1 : Math.max(0, count - 1);
}
