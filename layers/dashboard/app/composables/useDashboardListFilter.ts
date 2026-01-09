import { refDebounced } from "@vueuse/core"

export const useDashboardListFilter = <T extends Record<string, any>>(
  items: Ref<T[]>,
  options: {
    dateKey?: keyof T
    userId?: string | Ref<string | undefined>
  } = {}
) => {
  const { dateKey = 'createdAt', userId } = options

  const searchQuery = ref('')
  const debouncedSearchQuery = refDebounced(searchQuery, 300)
  const sortOrderValue = ref('Newest')
  const saleRentFilter = ref('All')
  const enquiriesFilter = ref('All')

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

  const enquiriesOptions = [
    { label: 'All', value: 'All', icon: 'i-lucide-message-circle' },
    { label: 'Sent', value: 'Sent', icon: 'i-lucide-check-circle' },
    { label: 'My Enquiries', value: 'My Enquiries', icon: 'i-lucide-mail' }
  ]

  const filteredItems = computed(() => {
    const query = debouncedSearchQuery.value.toLowerCase()
    const sortVal = sortOrderValue.value
    const filterVal = saleRentFilter.value
    const enquiryVal = enquiriesFilter.value
    const curUserId = unref(userId)
    
    // Single pass filtering
    const filtered = items.value.filter((item) => {
      // 1. Search Logic
      if (query) {
        const listing = item.listing
        if (!listing) return false

        // Address search (checking common address fields)
        const address = listing.property?.address
        // Optimization: check specific fields instead of Object.values which creates arrays
        const addressMatch = address ? (
          (typeof address.fullAddress === 'string' && address.fullAddress.toLowerCase().includes(query)) ||
          Object.values(address).some(val => 
            typeof val === 'string' && val.toLowerCase().includes(query)
          )
        ) : false

        // Price search
        const price = listing.saleListing?.price || listing.rentalListing?.price
        const priceMatch = price?.toString().includes(query)

        // Price Type / Frequency search
        const priceType = listing.saleListing?.priceType || listing.rentalListing?.rentFrequency
        const typeMatch = priceType?.toLowerCase().includes(query)

        // Note search
        const noteContent = (item as any).note
        const noteMatch = typeof noteContent === 'string' 
          ? noteContent.toLowerCase().includes(query)
          : noteContent?.note?.toLowerCase().includes(query)

        if (!(addressMatch || priceMatch || typeMatch || noteMatch)) return false
      }

      // 2. Sale/Rent Filter
      if (filterVal === 'Sale' && !item.listing?.saleListing) return false
      if (filterVal === 'Rent' && !item.listing?.rentalListing) return false

      // 3. Enquiries Role Filter
      if (curUserId && enquiryVal !== 'All') {
        const senderId = item.senderId || item.sender?.id
        const receiverId = item.receiverId || item.receiver?.id
        
        if (enquiryVal === 'Sent' && String(senderId) !== String(curUserId)) return false
        if (enquiryVal === 'My Enquiries' && String(receiverId) !== String(curUserId)) return false
      }

      return true
    })

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a[dateKey]).getTime()
      const dateB = new Date(b[dateKey]).getTime()

      return sortVal === 'Newest'
        ? dateB - dateA
        : dateA - dateB
    })

    return filtered
  })

  return {
    searchQuery,
    sortOrderValue,
    saleRentFilter,
    enquiriesFilter,
    enquiriesOptions,
    sortOrder,
    saleRentOptions,
    filteredItems,
  }
}
