/**
 *  Check whether transitions should be skipped
 */
function getSkipTransitions(forceTransition: boolean = false): boolean {
  if (forceTransition) return false

  // Check for reduced motion media query
  const { matches } = window.matchMedia('(prefers-reduced-motion)')

  // Return if matched
  return !!matches
}

/**
 *  Provide basic support for view transitions
 *
 */
export function useViewTransition(fn: () => void, forceTransition: boolean = false): void {

  if (import.meta.server || !isFunction(fn)) return

  // Check if transition should be skipped
  const skipTransition = getSkipTransitions(forceTransition)

  // If view transitions are not supported or should be skipped, simply
  // call the original function directly
  if (skipTransition || !document.startViewTransition) {
    fn()
  }

  // Else run as a view transition
  document.startViewTransition(() => {
    fn()
  })
}
