import type { Prisma, RentalAvailabilityStatus, SaleAvailabilityStatus } from "~~/layers/database/server/database/prisma/generated/client"

/**
 * Count listings owned by the provided user matching filters
 */
export async function getUserOwnedListingsCountWithFilters(
  userId: number,
  opts?: { 
    status?: "all" | "active" | "inactive" | "draft" | "archived"
    search?: string
  }
): Promise<number> {
  const { status = "all", search = "" } = opts || {}

  const where: Prisma.ListingWhereInput = { userId }

  // Apply status filters
  switch (status) {
    case "active":
      where.published = true
      where.archived = false
      break
    case "inactive":
      where.AND = [{ published: false }, { NOT: { publishedAt: null } }, { archived: false }]
      break
    case "draft":
      where.published = false
      where.publishedAt = null
      where.archived = false
      break
    case "archived":
      where.archived = true
      break
    default:
      // "all" - show everything except archived
      where.archived = false
  }

  // Apply search filters
  const searchTerm = search.trim()
  if (searchTerm) {
    where.OR = [
      { property: { address: { fullAddress: { contains: searchTerm, mode: "insensitive" } } } },
    ]
    
    const numericSearch = Number(searchTerm)
    if (!Number.isNaN(numericSearch)) {
      (where.OR as Prisma.ListingWhereInput[]).push({ price: numericSearch })
    }
  }

  return prisma.listing.count({ where })
}

/**
 * Get listings owned by the provided user with lightweight analytics counts
 */
export async function getUserOwnedListingsWithAnalytics(
  userId: number,
  opts?: { 
    status?: "all" | "active" | "inactive" | "draft" | "archived"
    search?: string
    take?: number
    skip?: number
    sort?: "new" | "old" | "premium" | "featured" | "basic"
    saleRent?: "all" | "sale" | "rent"
  }
): Promise<{ listings: OwnedListingWithAnalytics[]; total: number }> {
  const { status = "all", search = "", take = 50, skip = 0, sort = "new", saleRent = "all" } = opts || {}

  const where: Prisma.ListingWhereInput = { userId }

  // Apply status filters
  switch (status) {
    case "active":
      where.published = true
      where.archived = false
      break
    case "inactive":
      where.AND = [{ published: false }, { NOT: { publishedAt: null } }, { archived: false }]
      break
    case "draft":
      where.published = false
      where.publishedAt = null
      where.archived = false
      break
    case "archived":
      where.archived = true
      break
    default:
      // "all" - show everything except archived
      where.archived = false
  }

  // Apply sale/rent filter
  if (saleRent === "sale") {
    where.saleListing = { isNot: null }
    where.rentalListing = null
  } else if (saleRent === "rent") {
    where.rentalListing = { isNot: null }
  }

  // Apply search filters
  const searchTerm = search.trim()
  if (searchTerm) {
    where.OR = [
      { property: { address: { fullAddress: { contains: searchTerm, mode: "insensitive" } } } },
    ]
    
    const numericSearch = Number(searchTerm)
    if (!Number.isNaN(numericSearch)) {
      (where.OR as Prisma.ListingWhereInput[]).push({ price: numericSearch })
    }
  }

  // Get total count for pagination
  const total = await prisma.listing.count({ where })

  // Fetch listings
  const listings = await prisma.listing.findMany({
    where,
    select: {
      ...listingCardFields,
      id: true,
      published: true,
      publishedAt: true,
      archived: true,
      updatedAt: true,
    },
    take,
    skip,
    orderBy: { updatedAt: sort === 'old' ? 'asc' : 'desc' },
  }) as (ListingCardType & { published: boolean; publishedAt: Date | null; archived: boolean })[]

  if (listings.length === 0) return { listings: [], total }

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

  const enrichedListings = sortedListings.map((listing) => ({
    ...listing,
    analytics: {
      viewsCount: viewsMap.get(listing.id) ?? 0,
      favouritesCount: favouritesMap.get(listing.id) ?? 0,
      enquiriesCount: enquiriesMap.get(listing.id) ?? 0,
    },
    published: listing.published,
    archived: listing.archived,
    isDraft: !listing.published && !listing.publishedAt,
  }))

  return { listings: enrichedListings, total }
}

function applyTierSorting(listings: any[], sort: string) {
  if (!['premium', 'featured', 'basic'].includes(sort)) {
    return listings
  }

  const targetTier = sort.toUpperCase()
  // Filter to show ONLY the selected tier
  return listings.filter((listing: any) => 
    (listing.listingTier || '').toUpperCase() === targetTier
  )
}

import { invalidateListingCache } from "./cache";

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

  // Invalidate cache after update
  await invalidateListingCache(listingId);

  // Send websocket update for listings count change (if this changes draft status)
  const wasDraft = !listing.published && !listing.publishedAt
  const isDraft = !result.published && !result.publishedAt
  
  return { result, wasDraft, isDraft }
}

export async function updateListingAvailabilityStatus(
  userId: number,
  listingId: number,
  availabilityStatus: SaleAvailabilityStatus | RentalAvailabilityStatus
) {
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, userId },
    select: {
      id: true,
      saleListing: { select: { id: true } },
      rentalListing: { select: { id: true } },
    },
  })

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
  }

  if (listing.saleListing) {
    await prisma.saleListing.update({
      where: { listingId },
      data: { availabilityStatus: availabilityStatus as SaleAvailabilityStatus },
    })
  } else if (listing.rentalListing) {
    await prisma.rentalListing.update({
      where: { listingId },
      data: { availabilityStatus: availabilityStatus as RentalAvailabilityStatus },
    })
  } else {
    throw createError({ statusCode: 422, statusMessage: 'Listing has no sale or rental type' })
  }

  await invalidateListingCache(listingId)
}

export async function archiveListing(userId: number, listingId: number) {
  console.log(`[archiveListing] Starting archive for listing ${listingId}, user ${userId}`)
  
  const listing = await prisma.listing.findFirst({ 
    where: { id: listingId, userId } 
  })
  
  if (!listing) {
    console.error(`[archiveListing] Listing ${listingId} not found for user ${userId}`)
    throw createError({ statusCode: 404, statusMessage: "Listing not found" })
  }

  console.log(`[archiveListing] Found listing ${listingId}, current state:`, {
    published: listing.published,
    archived: listing.archived,
  })

  const result = await prisma.listing.update({
    where: { id: listingId },
    data: {
      published: false,
      archived: true,
      archivedAt: new Date(),
    },
    select: {
      id: true,
      published: true,
      archived: true,
      archivedAt: true,
    },
  })

  // Invalidate cache after update
  await invalidateListingCache(listingId);

  console.log(`[archiveListing] Successfully updated listing ${listingId}:`, result)

  return result
}
