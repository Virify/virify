import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client"

/**
 * Get listings owned by the provided user with lightweight analytics counts
 */
export async function getUserOwnedListingsWithAnalytics(
  userId: number,
  opts?: { 
    status?: "all" | "active" | "inactive" | "draft"
    search?: string
    take?: number
    skip?: number
    sort?: "new" | "old" | "premium" | "featured" | "basic" 
  }
): Promise<OwnedListingWithAnalytics[]> {
  const { status = "all", search = "", take = 50, skip = 0, sort = "new" } = opts || {}

  const where: Prisma.ListingWhereInput = { userId }

  // Apply status filters
  switch (status) {
    case "active":
      where.published = true
      break
    case "inactive":
      where.AND = [{ published: false }, { NOT: { publishedAt: null } }]
      break
    case "draft":
      where.published = false
      where.publishedAt = null
      break
  }

  // Apply search filters
  const searchTerm = search.trim()
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { property: { address: { fullAddress: { contains: searchTerm, mode: "insensitive" } } } },
    ]
    
    const numericSearch = Number(searchTerm)
    if (!Number.isNaN(numericSearch)) {
      (where.OR as Prisma.ListingWhereInput[]).push({ price: numericSearch })
    }
  }

  // Fetch listings
  const listings = await prisma.listing.findMany({
    where,
    select: {
      ...listingCardFields,
      id: true,
      published: true,
      publishedAt: true,
      updatedAt: true,
    },
    take,
    skip,
    orderBy: { updatedAt: sort === 'old' ? 'asc' : 'desc' },
  }) as (ListingCardType & { published: boolean; publishedAt: Date | null })[]

  if (listings.length === 0) return []

  const listingIds = listings.map(listing => listing.id)

  // Fetch analytics data in parallel
  const [viewsData, favouritesData, enquiriesData] = await Promise.all([
    prisma.listingView.groupBy({
      by: ["listingId"],
      where: { listingId: { in: listingIds } },
      _count: { listingId: true },
    }),
    prisma.userFavouriteListing.groupBy({
      by: ["listingId"],
      where: {
        listingId: { in: listingIds },
        userPreferences: { userId: { not: userId } },
      },
      _count: { listingId: true },
    }),
    prisma.conversation.groupBy({
      by: ["listingId"],
      where: { listingId: { in: listingIds } },
      _count: { listingId: true },
    }),
  ])

  // Create lookup maps for analytics
  const viewsMap = new Map(viewsData.map(v => [v.listingId!, v._count.listingId]))
  const favouritesMap = new Map(favouritesData.map(v => [v.listingId!, v._count.listingId]))
  const enquiriesMap = new Map(enquiriesData.map(v => [v.listingId!, v._count.listingId]))

  // Apply tier-based sorting if requested
  const sortedListings = applyTierSorting(listings, sort)

  return sortedListings.map((listing) => ({
    ...listing,
    analytics: {
      viewsCount: viewsMap.get(listing.id) ?? 0,
      favouritesCount: favouritesMap.get(listing.id) ?? 0,
      enquiriesCount: enquiriesMap.get(listing.id) ?? 0,
    },
    published: listing.published,
    isDraft: !listing.published && !listing.publishedAt,
  }))
}

function applyTierSorting(listings: any[], sort: string) {
  if (!['premium', 'featured', 'basic'].includes(sort)) {
    return listings
  }

  const targetTier = sort.toUpperCase()
  const preferred = listings.filter((listing: any) => 
    (listing.listingTier || '').toUpperCase() === targetTier
  )
  const others = listings.filter((listing: any) => 
    (listing.listingTier || '').toUpperCase() !== targetTier
  )
  
  return [...preferred, ...others]
}

export async function toggleListingPublished(userId: number, listingId: number, published: boolean) {
  const listing = await prisma.listing.findFirst({ 
    where: { id: listingId, userId } 
  })
  
  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: "Listing not found" })
  }

  const result = await prisma.listing.update({
    where: { id: listingId },
    data: {
      published,
      publishedAt: published ? new Date() : listing.publishedAt,
    },
    select: {
      id: true,
      published: true,
      publishedAt: true,
    },
  })

  // Send websocket update for listings count change (if this changes draft status)
  const wasDraft = !listing.published && !listing.publishedAt
  const isDraft = !result.published && !result.publishedAt
  
  // If draft status changed, send aggregate update
  if (wasDraft !== isDraft) {
    const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer()
    const aggregateMessage = createAggregateUpdateMessage("listings", "update", userId)
    sendMessage(aggregateMessage)
  }

  return result
}
