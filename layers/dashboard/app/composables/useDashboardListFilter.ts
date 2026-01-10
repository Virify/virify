import { refDebounced } from "@vueuse/core"

/**
 * Filter and sort a list of items for the dashboard
 * 
 * Includes support for:
 * - Text search (fuzzy matching on searchable fields)
 * - Date sorting (Newest/Oldest)
 * - Category filtering (Sale/Rent)
 * - Enquiry status/type filtering (Sent/Received/My Enquiries)
 * 
 * @param items List of items to filter
 * @param options Configuration options
 */
export const useDashboardListFilter = <T extends Record<string, any>>(
  items: Ref<T[]>,
  options: {
    /** Key to use for date sorting. Defaults to 'createdAt' */
    dateKey?: keyof T
    /** Current user ID for 'My Enquiries' filtering */
    userId?: string | Ref<string | undefined>
  } = {}
) => {
  const { dateKey = 'createdAt', userId } = options

  /**
   * State
   */
  const searchQuery = ref('')
  const debouncedSearchQuery = refDebounced(searchQuery, 300)
  const sortOrderValue = ref('newest')
  const saleRentFilter = ref('all')
  const enquiriesFilter = ref('all')

  /**
   * Options configuration
   */
  const sortOrder = [
    {
      label: 'Newest',
      value: 'newest',
      icon: 'i-lucide-calendar-arrow-up'
    },
    {
      label: 'Oldest',
      value: 'oldest',
      icon: 'i-lucide-calendar-arrow-down'
    } 
  ]
  
  /**
   * Sale/Rent filter options
   */
  const saleRentOptions = [
    { label: 'All', value: 'all', icon: 'i-lucide-home' },
    { label: 'Sale', value: 'sale', icon: 'i-lucide-tag' },
    { label: 'Rent', value: 'rent', icon: 'i-lucide-key' }
  ]

  /**
   * Direction filter options (Sent/Received)
   */
  const directionOptions = [
    { label: 'All Enquiries', value: 'all', icon: 'i-lucide-inbox' },
    { label: 'Sent Enquiries', value: 'sent', icon: 'i-lucide-send' },
    { label: 'Received Enquiries', value: 'received', icon: 'i-lucide-mail' }
  ]

  /**
   * Tab Items (All/Unread)
   */
  const tabItems = [
    { label: 'All', value: 'all', icon: 'i-lucide-inbox' },
    { label: 'Unread', value: 'unread', icon: 'i-lucide-mail' }
  ]

  /**
   * View Options (Grid/List)
   */
  const viewOptions = [
    { label: '', icon: 'i-lucide-layout-grid', value: 'grid' },
    { label: '', icon: 'i-lucide-list', value: 'list' }
  ]

  /**
   * Computed list of filtered items
   */
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
      if (filterVal === 'sale' && !item.listing?.saleListing) return false
      if (filterVal === 'rent' && !item.listing?.rentalListing) return false

      // 3. Enquiries Role Filter
      if (curUserId && enquiryVal !== 'all') {
        const senderId = item.senderId || item.sender?.id
        const receiverId = item.receiverId || item.receiver?.id
        
        if (enquiryVal === 'sent' && String(senderId) !== String(curUserId)) return false
        if (enquiryVal === 'received' && String(receiverId) !== String(curUserId)) return false
      }

      return true
    })

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a[dateKey]).getTime()
      const dateB = new Date(b[dateKey]).getTime()

      return sortVal === 'newest'
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
    directionOptions,
    tabItems,
    viewOptions,
    sortOrder,
    saleRentOptions,
    filteredItems,
  }
}
