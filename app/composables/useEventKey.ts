/**
 *  Check for specific event keys
 *
 */
export function useEventKey() {
  /**
   *  Check if special keys are pressed
   */
  function isMetaKey(event: PointerEvent) {
    if (!isObject(event)) return false

    return !!event.metaKey
  }

  // Public methods
  return {
    isMetaKey
  }
}