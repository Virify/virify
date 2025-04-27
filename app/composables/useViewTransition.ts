/**
 *  Provide basic support for view transitions
 *
 */
export function useViewTransition(fn: typeof Function) {
  if (!isFunction(fn)) return

  // If view transitions are not supported, return immediately
  if (!document.startViewTransition) {
    fn()
  }

  // Else run as a view transition
  document.startViewTransition(() => {
    fn()
  })
}
