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
    /** Key to use for cookie persistence. If provided, sort and filters will be saved */
    persistenceKey?: string
    /** Whether to include enquiries-specific options */
    enquiries?: boolean
    /** Whether to hide the Listing sort option */
    hideListingSort?: boolean
  } = {}
) => {
  const { dateKey = 'createdAt', userId, persistenceKey, enquiries = false, hideListingSort = false } = options

  /**
   * State
   */
  const searchQuery = ref('')
  const debouncedSearchQuery = refDebounced(searchQuery, 300)
  
  // Use cookies if persistenceKey is provided, otherwise use standard refs
  const sortOrderValue = persistenceKey 
    ? useCookie<DashboardSortOrder>(`${persistenceKey}-sort`, { default: () => 'newest', maxAge: 60 * 60 * 24 * 365 })
    : ref<DashboardSortOrder>('newest')

  const saleRentFilter = persistenceKey
    ? useCookie<DashboardSaleRentFilter>(`${persistenceKey}-filter`, { default: () => 'all', maxAge: 60 * 60 * 24 * 365 })
    : ref<DashboardSaleRentFilter>('all')

  const enquiriesFilter = persistenceKey
    ? useCookie<DashboardEnquiriesFilter>(`${persistenceKey}-enquiries`, { default: () => 'all', maxAge: 60 * 60 * 24 * 365 })
    : ref<DashboardEnquiriesFilter>('all')

  const activeTab = persistenceKey
    ? useCookie<DashboardConversationFilter>(`${persistenceKey}-tab`, { default: () => 'all', maxAge: 60 * 60 * 24 * 365 })
    : ref<DashboardConversationFilter>('all')

  const activeView = persistenceKey
    ? useCookie<DashboardViewType>(`${persistenceKey}-view`, { default: () => 'grid', maxAge: 60 * 60 * 24 * 365 })
    : ref<DashboardViewType>('grid')

  /**
   * Options configuration
   */
  const sortOrder = computed(() => {
    const options = [
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

    if (enquiries && !hideListingSort) {
      options.push({
        label: 'Listing',
        value: 'listing',
        icon: 'i-lucide-list-tree'
      })
    }

    return options
  })
  
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
   * Computed list of filtered items (client-side search only)
   * Sort and category filters are now handled by backend API
   */
  const filteredItems = computed(() => {
    const query = debouncedSearchQuery.value.toLowerCase()
    
    // If no search query, return items as-is (already sorted/filtered by backend)
    if (!query) return items.value

    // Client-side search filtering only
    return items.value.filter((item) => {
      const listing = item.listing
      if (!listing) return false

      // Address search
      const address = listing.property?.address
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

      return addressMatch || priceMatch || typeMatch || noteMatch
    })
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
    activeTab,
    activeView,
  }
}
