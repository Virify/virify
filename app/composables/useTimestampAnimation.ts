interface Settings {
  duration: number
}

interface Timestamp {
  start: number
  action: () => void
}

export function useTimestampAnimation(timestamp: Timestamp[], settings: Settings) {
  const { duration: ANIMATION_DURATION } = asObject(settings)

  let ANIMATION_RUNNING = true
  let startTime: number
  let clonedTimestamps: Timestamp[] = []

  /**
   *  Reset animation
   *
   */
  function __resetAnimation() {
    clonedTimestamps = [...timestamp]
    startTime = performance.now()
  }

  /**
   *  Get the elapsed time from a given start time
   */
  function __getElapsedTime(startTime: number) {
    return Math.ceil(performance.now() - startTime)
  }

  /**
   *  Find the first matching timestamp action
   *
   */
  function __getAction(current: number) {
    const match = clonedTimestamps.findIndex(({ start }) => start <= current)

    // If no matching timestamp action
    if (match === -1) return

    // Otherwise get the action from the timestamp
    const { action } = asObject(clonedTimestamps[match])

    // Then remove from the array
    clonedTimestamps.splice(match, 1)

    // Then return
    return action
  }

  /**
   *  Run a single step of the animation
   *
   */
  function __step() {
    if (!ANIMATION_RUNNING) return

    const elapsedTime = __getElapsedTime(startTime)
    const timestampAction = __getAction(elapsedTime)

    // If matching action is found, run it
    if (isFunction(timestampAction)) timestampAction()

    // If the elapsed time is greater than the duraction, restart time
    if (elapsedTime > ANIMATION_DURATION) {
      __resetAnimation()
    }

    // Get next frame
    requestAnimationFrame(__step)
  }

  /**
   *  Start the animation
   *
   */
  function start() {
    ANIMATION_RUNNING = true

    __resetAnimation()
    __step()
  }


  /**
   *  Stop the animation
   *
   */
  function stop() {
    ANIMATION_RUNNING = false
  }

  /**
   *  Automatically clean up before unmount
   */
  onBeforeUnmount(stop)

  return {
    start,
    stop
  }
}