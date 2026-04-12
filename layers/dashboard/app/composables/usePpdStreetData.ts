/**
 * Fetches PPD (Price Paid Data) street context for a given postcode + optional street.
 *
 * Uses watch + immediate instead of useAsyncData so it always re-fetches when
 * navigating to a step that uses it — useAsyncData deduplication would suppress
 * subsequent fetches with the same cache key.
 */

interface PpdSale {
  price: number
  transfer_date: Date | string
  transaction_id: string
}

interface PpdGroup {
  full_address: string
  sales: PpdSale[]
}

export interface PpdStreetSummary {
  avg: number
  min: number
  max: number
  recentCount: number
  period: string
  lastSales: Array<PpdSale & { formattedDate: string; full_address: string }>
}

export function usePpdStreetData(
  postcode: Ref<string | null | undefined>,
  street: Ref<string | null | undefined>,
) {
  const ppdGroups = ref<PpdGroup[] | null>(null)
  const loading = ref(false)

  watch(
    [postcode, street],
    async ([newPostcode, newStreet]) => {
      console.log('[usePpdStreetData] watch triggered — postcode:', newPostcode, 'street:', newStreet)
      if (!newPostcode) {
        console.log('[usePpdStreetData] no postcode, skipping fetch')
        ppdGroups.value = null
        return
      }
      loading.value = true
      try {
        console.log('[usePpdStreetData] fetching PPD for postcode:', newPostcode, 'street:', newStreet ?? '(none)')
        const res = await $fetch<{ data: PpdGroup[] }>('/api/price-paid/', {
          method: 'POST',
          body: { postcode: newPostcode, street: newStreet ?? undefined },
        })
        console.log('[usePpdStreetData] response — groups:', res.data?.length ?? 0)
        ppdGroups.value = res.data ?? null
      }
      catch (err) {
        console.error('[usePpdStreetData] fetch error:', err)
        ppdGroups.value = null
      }
      finally {
        loading.value = false
      }
    },
    { immediate: true },
  )

  const summary = computed<PpdStreetSummary | null>(() => {
    if (!ppdGroups.value?.length) return null

    const allSales = ppdGroups.value
      .flatMap(g => g.sales.map(s => ({ ...s, full_address: g.full_address })))
      .sort((a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime())

    if (!allSales.length) return null

    const cutoff = new Date()
    cutoff.setFullYear(cutoff.getFullYear() - 1)
    const recentSales = allSales.filter(s => new Date(s.transfer_date) >= cutoff)
    const statsBase = recentSales.length ? recentSales : allSales.slice(0, 20)
    const prices = statsBase.map(s => s.price)
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)

    return {
      avg,
      min: Math.min(...prices),
      max: Math.max(...prices),
      recentCount: recentSales.length || allSales.length,
      period: recentSales.length ? 'past 12 months' : 'all time',
      lastSales: allSales.slice(0, 5).map(s => ({
        ...s,
        formattedDate: new Date(s.transfer_date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      })),
    }
  })

  return { summary, loading }
}
