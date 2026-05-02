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
  const { getFetchBody } = useGlobalSearchState()

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
    const { locationName, radius, state } = useGlobalSearchState()

    // Save searched location, radius
    setSearchedLocation(locationName.value || undefined)
    setSearchedRadius(radius.value)

    // Fetch results
    return useFetch<{ results?: ListingCardType[], hashKey?: string, queryAnalysis?: QueryAnalysis }>('/api/search/', {
      method: 'POST',
      body: fetchBody
    }).then(({ data }) => {
      const { results = [], hashKey, queryAnalysis } = data.value ?? {}

      setResults(results)
      setResultsHash(hashKey)

      // Traditional search has no server-side queryAnalysis — build it from form data
      const analysis = state.value.type === 'traditional' && state.value.traditional
        ? buildQueryAnalysisFromFormData(state.value.traditional as TraditionalSearchData)
        : queryAnalysis

      setQueryAnalysis(analysis)

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

    // Allow updating the hash from the returned results
    const { setLocation, setRadius, locationName } = useGlobalSearchState()
    const { setLocationText } = useLocationInput()

    /**
     *  Fetch results
     *
     *  @TODO
     *  Using useFetch would fail to fetch properly, probably because of
     *  they way the key is generated for the endpoint. We should 
     *  probably look into why this is and fix properly so the hash and
     *  search endpoints are more consistent
     */
    return await $fetch<{ results?: ListingCardType[], hashKey?: string, queryAnalysis?: QueryAnalysis, location?: unknown, radius?: unknown }>('/api/search/hash', {
      method: 'POST',
      body: JSON.stringify({ hash })
    }).then((data) => {
      const { results = [], hashKey, queryAnalysis, location, radius } = data ?? {}

      // Save results
      setResults(results)
      setResultsHash(hashKey)
      setQueryAnalysis(queryAnalysis)

      // Save search location
      if (location) {
        setLocation(location as GeocodingFeature)
        setSearchedLocation(locationName.value)
        setLocationText(locationName.value)
      }

      // Save search radius
      if (isNumber(radius)) {
        setRadius(radius)
        setSearchedRadius(radius)
      }
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