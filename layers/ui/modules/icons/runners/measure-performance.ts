/**
 *  Run a function whilst measuring its performance
 *
 */
export function measurePerformance(fn: Function): number {
  const t1 = performance.now()

  if (fn instanceof Function) fn()

  const t2 = performance.now()

  return Math.ceil(t2 - t1)
}