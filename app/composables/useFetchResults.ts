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
   *  Fetchers
   */
  const { getFetchBody } = useGlobalSearchState()

  async function fetchResults() {
    setPending(true)

    const response = await new Promise((resolve) => {
      console.log('FETCH', getFetchBody())

      setTimeout(() => {
        resolve(true)
      }, 2000)
    })

    setPending(false)

    return response
  }

  async function fetchHash(hash: string) {
    setPending(true)

    const response = await new Promise((resolve) => {
      console.log('FETCH', { hash })

      setTimeout(() => {
        resolve(true)
      }, 2000)
    })

    setPending(false)

    return response
  }

  /**
   *  Interface
   */
  return {
    pending,
    setPending,
    fetchResults,
    fetchHash
  }
})

export default useFetchResults