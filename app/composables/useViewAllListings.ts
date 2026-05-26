/**
 *  @TODO - remove and replace with search when search is ready to go
 *          live - this is a temporary composable for viewing all 
 *          listings, which can be used whilst the full search is not 
 *          enabled
 */
export function useViewAllListings() {
  const { data, status } = useFetch<ListingCardData[]>('/api/listings')

  const results = computed<ListingCardData[]>(() => {
    if (!Array.isArray(data.value)) {
      return []
    }

    return data.value
  })

  const isPending = computed<boolean>(() => {
    return status.value === 'pending'
  })

  return {
    results,
    isPending
  }
}