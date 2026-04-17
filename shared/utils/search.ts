export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc'

/**
 * Maps a sort key to a Prisma-compatible order-by object.
 * Returns undefined for 'relevance' (uses Prisma default ordering).
 */
export function buildListingOrderBy(sortBy: SortBy | string): { price: 'asc' | 'desc' } | { publishedAt: 'asc' | 'desc' } | undefined {
  switch (sortBy) {
    case 'price-asc':  return { price: 'asc' }
    case 'price-desc': return { price: 'desc' }
    case 'date-desc':  return { publishedAt: 'desc' }
    case 'date-asc':   return { publishedAt: 'asc' }
    default:           return undefined
  }
}
