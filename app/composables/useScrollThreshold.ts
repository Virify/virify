/**
 *  Trigger an action when a scroll threshold has been reached
 *
 */
export function useScrollThreshold(threshold: number = 10, fn: (response: boolean) => void) {
  if (!isNumber(threshold)) {
    throw new TypeError('threshold should be a number')
  }

  if (!isFunction(fn)) {
    throw new TypeError('fn should be a function')
  }

  // Track previous triggers to avoid duplicate calls
  let previousTrigger = false

  // Run function only when trigger is reached
  function setHitThreshold() {
    const trigger = window.scrollY > threshold

    // If tigger is unchanged, do nothing
    if (previousTrigger === trigger) return

    // Otherwise update previous trigger
    previousTrigger = trigger

    // And call function
    fn(trigger)
  }

  // Mount and unmount scroll listener
  onMounted(() => {
    window.addEventListener('scroll', setHitThreshold, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', setHitThreshold)
  })
}