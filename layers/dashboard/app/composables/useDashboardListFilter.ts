import { refDebounced } from "@vueuse/core";

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
    dateKey?: keyof T;
    /** Current user ID for 'My Enquiries' filtering */
    userId?: string | Ref<string | undefined>;
    /** Key to use for cookie persistence. If provided, sort and filters will be saved */
    persistenceKey?: string;
    /** Whether to include enquiries-specific options */
    enquiries?: boolean;
    /** Whether to hide the Listing sort option */
    hideListingSort?: boolean;
    /** Whether to include listing date sort options (Listing: Newest / Listing: Oldest) */
    listingDateSort?: boolean;
    /** Whether to show the admin owner filter (Your Listings / Other Listings). Admin-only. */
    adminOwnerFilter?: boolean;
  } = {},
) => {
  const {
    dateKey = "createdAt",
    userId,
    persistenceKey,
    enquiries = false,
    hideListingSort = false,
    listingDateSort = false,
    adminOwnerFilter = false,
  } = options;
  const route = useRoute();
  const router = useRouter();

  /**
   * State
   */
  const searchQuery = ref("");
  const debouncedSearchQuery = refDebounced(searchQuery, 300);

  // Use cookies if persistenceKey is provided, otherwise use standard refs
  const sortOrderValue =
    persistenceKey ?
      useCookie<DashboardSortOrder>(`${persistenceKey}-sort`, {
        default: () => "newest",
        maxAge: 60 * 60 * 24 * 365,
      })
    : ref<DashboardSortOrder>("newest");

  const saleRentFilter =
    persistenceKey ?
      useCookie<DashboardSaleRentFilter>(`${persistenceKey}-filter`, {
        default: () => "all",
        maxAge: 60 * 60 * 24 * 365,
      })
    : ref<DashboardSaleRentFilter>("all");

  const availabilityFilter =
    persistenceKey ?
      useCookie<DashboardAvailabilityFilter>(`${persistenceKey}-availability`, {
        default: () => "all",
        maxAge: 60 * 60 * 24 * 365,
      })
    : ref<DashboardAvailabilityFilter>("all");

  const enquiriesFilter =
    persistenceKey ?
      useCookie<DashboardEnquiriesFilter>(`${persistenceKey}-enquiries`, {
        default: () => "all",
        maxAge: 60 * 60 * 24 * 365,
      })
    : ref<DashboardEnquiriesFilter>("all");

  const activeTab =
    persistenceKey ?
      useCookie<DashboardConversationFilter>(`${persistenceKey}-tab`, {
        default: () => "all",
        maxAge: 60 * 60 * 24 * 365,
      })
    : ref<DashboardConversationFilter>("all");

  const activeView =
    persistenceKey ?
      useCookie<DashboardViewType>(`${persistenceKey}-view`, {
        default: () => "grid",
        maxAge: 60 * 60 * 24 * 365,
      })
    : ref<DashboardViewType>("grid");

  const ownerFilter =
    adminOwnerFilter && persistenceKey ?
      useCookie<DashboardOwnerFilter>(`${persistenceKey}-owner`, {
        default: () => "all" as DashboardOwnerFilter,
        maxAge: 60 * 60 * 24 * 365,
      })
    : ref<DashboardOwnerFilter>("all");

  const ownerFilterOptions = [
    { label: "All", value: "all", icon: "i-lucide-users" },
    { label: "Yours", value: "own", icon: "i-lucide-user" },
    { label: "Others", value: "other", icon: "i-lucide-user-x" },
  ];

  /**
   * Apply URL query parameters on mount
   */
  if (process.client) {
    const sort = route.query.sort as DashboardSortOrder | undefined;
    const direction = route.query.direction as DashboardEnquiriesFilter | undefined;
    const filter = route.query.filter as DashboardConversationFilter | undefined;
    const category = route.query.category as DashboardSaleRentFilter | undefined;
    const view = route.query.view as DashboardViewType | undefined;

    if (sort) sortOrderValue.value = sort;
    if (direction) enquiriesFilter.value = direction;
    if (filter) activeTab.value = filter;
    if (category) saleRentFilter.value = category;
    if (view) activeView.value = view;

    // Watch for route changes to sync query params
    watch(
      () => route.query,
      (newQuery) => {
        if (newQuery.sort) sortOrderValue.value = newQuery.sort as DashboardSortOrder;
        if (newQuery.direction)
          enquiriesFilter.value = newQuery.direction as DashboardEnquiriesFilter;
        if (newQuery.filter)
          activeTab.value = newQuery.filter as DashboardConversationFilter;
        if (newQuery.category)
          saleRentFilter.value = newQuery.category as DashboardSaleRentFilter;
        if (newQuery.view) activeView.value = newQuery.view as DashboardViewType;
      },
    );
  }

  /**
   * Options configuration
   */
  const sortOrder = computed(() => {
    const options = [
      {
        label: "Newest",
        value: "newest",
        icon: "i-lucide-calendar-arrow-up",
      },
      {
        label: "Oldest",
        value: "oldest",
        icon: "i-lucide-calendar-arrow-down",
      },
    ];

    if (enquiries && !hideListingSort) {
      options.push({
        label: "Listing",
        value: "listing",
        icon: "i-lucide-list-tree",
      });
    }

    if (listingDateSort) {
      options.push(
        {
          label: "Listing: Newest",
          value: "listing-newest",
          icon: "i-lucide-building-2",
        },
        { label: "Listing: Oldest", value: "listing-oldest", icon: "i-lucide-building" },
      );
    }

    return options;
  });

  /**
   * Sale/Rent filter options
   */
  const saleRentOptions = [
    { label: "All", value: "all", icon: "i-lucide-home" },
    { label: "Sale", value: "sale", icon: "i-lucide-tag" },
    { label: "Rent", value: "rent", icon: "i-lucide-key" },
  ];

  /**
   * Availability filter options
   * UNDER_OFFER maps to UNDER_OFFER (sale) / LET_AGREED (rental)
   * SOLD maps to SOLD (sale) / LET (rental)
   */
  const availabilityOptions = [
    { label: "All", value: "all", icon: "i-lucide-circle-dot" },
    { label: "Available", value: "AVAILABLE", icon: "i-lucide-circle-check" },
    { label: "Under Offer / Let Agreed", value: "UNDER_OFFER", icon: "i-lucide-clock" },
    { label: "Sold / Let", value: "SOLD", icon: "i-lucide-circle-x" },
  ];

  /**
   * Direction filter options (Sent/Received)
   */
  const directionOptions = [
    { label: "All Enquiries", value: "all", icon: "i-lucide-inbox" },
    { label: "Sent Enquiries", value: "sent", icon: "i-lucide-send" },
    { label: "Received Enquiries", value: "received", icon: "i-lucide-mail" },
  ];

  /**
   * Tab Items (All/Unread)
   */
  const tabItems = [
    { label: "All", value: "all", icon: "i-lucide-inbox" },
    { label: "Unread", value: "unread", icon: "i-lucide-mail" },
  ];

  /**
   * View Options (Grid/List)
   */
  const viewOptions = [
    { label: "", icon: "i-lucide-layout-grid", value: "grid" },
    { label: "", icon: "i-lucide-list", value: "list" },
  ];

  /**
   * Computed list of filtered items (client-side search only)
   * Sort and category filters are now handled by backend API
   */
  const filteredItems = computed(() => {
    const query = debouncedSearchQuery.value.toLowerCase();

    // If no search query, return items as-is (already sorted/filtered by backend)
    if (!query) return items.value;

    // Client-side search filtering only
    return items.value.filter((item) => {
      const listing = item.listing;
      if (!listing) return false;

      // Address search
      const address = listing.property?.address;
      const addressMatch =
        address ?
          (typeof address.fullAddress === "string" &&
            address.fullAddress.toLowerCase().includes(query)) ||
          Object.values(address).some(
            (val) => typeof val === "string" && val.toLowerCase().includes(query),
          )
        : false;

      // Price search
      const price = listing.saleListing?.price || listing.rentalListing?.price;
      const priceMatch = price?.toString().includes(query);

      // Price Type / Frequency search
      const priceType =
        listing.saleListing?.priceType || listing.rentalListing?.rentFrequency;
      const typeMatch = priceType?.toLowerCase().includes(query);

      // Note search
      const noteContent = (item as any).note;
      const noteMatch =
        typeof noteContent === "string" ?
          noteContent.toLowerCase().includes(query)
        : noteContent?.note?.toLowerCase().includes(query);

      return addressMatch || priceMatch || typeMatch || noteMatch;
    });
  });

  return {
    searchQuery,
    sortOrderValue,
    saleRentFilter,
    availabilityFilter,
    enquiriesFilter,
    directionOptions,
    tabItems,
    viewOptions,
    sortOrder,
    saleRentOptions,
    availabilityOptions,
    filteredItems,
    activeTab,
    activeView,
    ownerFilter,
    ownerFilterOptions,
  };
};
