/**
 *  @TODO - remove and replace with search when search is ready to go
 *          live - this is a temporary composable for viewing all 
 *          listings, which can be used whilst the full search is not 
 *          enabled
 */
export function useViewAllListings() {
  const results = ref([])
  const isPending = ref(false)

  return {
    results,
    isPending
  }
}