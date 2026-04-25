import { createSharedComposable } from '@vueuse/core'

const useFetchResults = createSharedComposable(() => {
  /**
   *  Externally track pending state
   */
  const pending = shallowRef(false)

  function setPending(newValue: boolean) {
    pending.value = !!newValue
  }

  /**
   *  Fetcher
   */
  const { getFetchBody } = useGlobalSearchState()

  async function fetchResults() {
    setPending(true)

    await new Promise((resolve) => {
      console.log('FETCH', getFetchBody())

      setTimeout(() => {
        resolve(true)
      }, 500)
    })

    setPending(false)
  }

  /**
   *  Interface
   */
  return {
    pending,
    setPending,
    fetchResults
  }
})

export default useFetchResults