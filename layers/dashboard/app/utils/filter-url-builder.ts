export interface FilterUrlParams {
  /** Sort order: newest, oldest, listing */
  sort?: DashboardSortOrder
  /** Tab filter: all, unread */
  filter?: DashboardConversationFilter
  /** Direction filter for enquiries: all, sent, received */
  direction?: DashboardEnquiriesFilter
  /** Category filter for listings: all, sale, rent */
  category?: DashboardSaleRentFilter
  /** View type: grid, list */
  view?: DashboardViewType
  /** Any additional query parameters */
  [key: string]: string | undefined
}

/**
 * Builds a URL with filter query parameters
 * 
 * @param basePath - The base path (e.g., '/dashboard/enquiries')
 * @param params - Object containing filter parameters
 * @returns Complete URL with query string
 * 
 * @example
 * buildFilterUrl('/dashboard/enquiries', { direction: 'sent', sort: 'newest' })
 * // Returns: '/dashboard/enquiries?direction=sent&sort=newest'
 * 
 * @example
 * buildFilterUrl('/dashboard/listings', { category: 'sale', filter: 'unread' })
 * // Returns: '/dashboard/listings?category=sale&filter=unread'
 */
export function buildFilterUrl(basePath: string, params: FilterUrlParams = {}): string {
  const query = new URLSearchParams()
  
  // Add each parameter if it exists and is not 'all' (which is the default)
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== 'all') {
      query.append(key, value)
    }
  })
  
  const queryString = query.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Builds enquiries page URL with filters
 * 
 * @example
 * buildEnquiriesUrl({ direction: 'sent', sort: 'newest' })
 * // Returns: '/dashboard/enquiries?direction=sent&sort=newest'
 */
export function buildEnquiriesUrl(params: FilterUrlParams = {}): string {
  return buildFilterUrl('/dashboard/enquiries', params)
}

/**
 * Builds listings page URL with filters
 * 
 * @example
 * buildListingsUrl({ category: 'sale', sort: 'newest' })
 * // Returns: '/dashboard/listings?category=sale&sort=newest'
 */
export function buildNotesUrl(params: FilterUrlParams = {}): string {
  return buildFilterUrl('/dashboard/notes', params)
}

/**
 * Builds listings page URL with filters
 * 
 * @example
 * buildListingsUrl({ category: 'sale', sort: 'newest' })
 * // Returns: '/dashboard/listings?category=sale&sort=newest'
 */
export function buildFavouritesUrl(params: FilterUrlParams = {}): string {
  return buildFilterUrl('/dashboard/favourites', params)
}

/**
 * Builds listings page URL with filters
 * 
 * @example
 * buildListingsUrl({ category: 'sale', sort: 'newest' })
 * // Returns: '/dashboard/listings?category=sale&sort=newest'
 */
export function buildListingsUrl(params: FilterUrlParams = {}): string {
  return buildFilterUrl('/dashboard/listings', params)
}
