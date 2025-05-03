/**
 *  Perform async function whilst showing a pending state
 *
 */
export function usePending() {
  const isPending = ref(false)

  async function setPendingWhile(fn: () => unknown) {
    isPending.value = true

    try {
      if (!isFunction(fn)) {
        throw new TypeError('Argument is not a function')
      }

      await fn()
    } catch (err) {
      console.error(err)
    }

    isPending.value = false
  }

  return {
    isPending,
    setPendingWhile
  };
}