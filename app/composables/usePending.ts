/**
 *  Perform async function whilst showing a pending state
 *
 */
export function usePending() {
  const isPending = ref(false)

  async function setPendingWhile<T>(fn: () => Promise<T>) {
    isPending.value = true

    let returnValue: T | undefined = undefined

    try {
      if (!isFunction(fn)) {
        throw new TypeError('Argument is not a function')
      }

      returnValue = await fn()
    } catch (err) {
      console.error(err)
    }

    isPending.value = false

    return returnValue
  }

  return {
    isPending,
    setPendingWhile
  };
}