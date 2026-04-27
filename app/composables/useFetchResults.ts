import { createSharedComposable } from '@vueuse/core'

const useFetchResults = createSharedComposable(() => {
  const {
    setResults,
    setResultsHash,
    setSearchedLocation,
    setSearchedRadius,
    setQueryAnalysis
  } = useSearchResults()

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
  const { getFetchBody, location, radius } = useGlobalSearchState()

  async function fetchResults() {
    setPending(true)

    // Check if a fetch body exists
    const fetchBody = getFetchBody()

    // If not, return
    if (!fetchBody) {
      setPending(false)

      return
    }

    // Set location, radius used in the search
    const { locationName, radius } = useGlobalSearchState()

    // Save searched location, radius
    setSearchedLocation(locationName.value || undefined)
    setSearchedRadius(radius.value)

    // Fetch results
    return useFetch('/api/search/', {
      method: 'POST',
      body: fetchBody
    }).then(({ data }) => {
      const { results = [], hashKey, queryAnalysis } = asObject(data.value)

      // Save results
      setResults(results)
      setResultsHash(hashKey)
      setQueryAnalysis(queryAnalysis)

      // If hash exists, navigate to it
      if (isString(hashKey)) {
        navigateTo('/search/' + hashKey)
      }
    }).finally(() => {
      setPending(false)
    })
  }

  async function fetchHash(hash: string) {
    setPending(true)

    // Check if hash string exists
    if (!isString(hash)) {
      setPending(false)

      return
    }

    // Fetch results
    return useFetch('/api/search/hash', {
      method: 'POST',
      body: JSON.stringify({ hash })
    }).then(({ data }) => {
      console.log({ data: data.value })
    }).finally(() => {
      setPending(false)
    })
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