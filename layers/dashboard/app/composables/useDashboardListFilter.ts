export const useDashboardListFilter = <T extends Record<string, any>>(
  items: Ref<T[]>,
  options: {
    dateKey?: keyof T
  } = {}
) => {
  const { dateKey = 'createdAt' } = options

  const searchQuery = ref('')
  const sortOrderValue = ref('Newest')
  const saleRentFilter = ref('All')

  const sortOrder = [
    {
      label: 'Newest',
      value: 'Newest',
      icon: 'i-lucide-calendar-arrow-up'
    },
    {
      label: 'Oldest',
      value: 'Oldest',
      icon: 'i-lucide-calendar-arrow-down'
    } 
  ]
  const saleRentOptions = [
    { label: 'All', value: 'All', icon: 'i-lucide-home' },
    { label: 'Sale', value: 'Sale', icon: 'i-lucide-tag' },
    { label: 'Rent', value: 'Rent', icon: 'i-lucide-key' }
  ]

  const filteredItems = computed(() => {
    // Start with a copy to avoid mutating the original array
    let filtered = [...items.value]

    // Filter by Search Query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter((item) => {
        const listing = item.listing
        if (!listing) return false

        // Address search (checking common address fields)
        const address = listing.property?.address
        const addressMatch = address ? Object.values(address).some(val => 
          typeof val === 'string' && val.toLowerCase().includes(query)
        ) : false

        // Price search
        const price = listing.saleListing?.price || listing.rentalListing?.price
        const priceMatch = price?.toString().includes(query)

        // Price Type / Frequency search
        const priceType = listing.saleListing?.priceType || listing.rentalListing?.rentFrequency
        const typeMatch = priceType?.toLowerCase().includes(query)

        // Note search
        // Check both direct string and object.note pattern
        const noteContent = (item as any).note
        const noteMatch = typeof noteContent === 'string' 
          ? noteContent.toLowerCase().includes(query)
          : noteContent?.note?.toLowerCase().includes(query)

        return addressMatch || priceMatch || typeMatch || noteMatch
      })
    }

    // Filter by Sale/Rent
    if (saleRentFilter.value === 'Sale') {
      filtered = filtered.filter((item) => item.listing?.saleListing)
    }
    else if (saleRentFilter.value === 'Rent') {
      filtered = filtered.filter((item) => item.listing?.rentalListing)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a[dateKey]).getTime()
      const dateB = new Date(b[dateKey]).getTime()

      return sortOrderValue.value === 'Newest'
        ? dateB - dateA
        : dateA - dateB
    })

    return filtered
  })

  return {
    searchQuery,
    sortOrderValue,
    saleRentFilter,
    sortOrder,
    saleRentOptions,
    filteredItems,
  }
}
