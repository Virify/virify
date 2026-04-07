import type { UserHiddenListingCard } from "~~/shared/types/user-hidden-listing";
import { listingCardFields } from "~~/shared/types/listing";

/**
 * Get all hidden listing IDs for a user (lightweight lookups)
 * Used for checking if listings are hidden across the app.
 *
 * @param userId - The ID of the user
 * @returns Array of listingIds the user has hidden
 */
export async function getUserHiddenListingLookups(userId: number): Promise<number[]> {
  const results = await prisma.hiddenListing.findMany({
    where: {
      hidden: true,
      userPreferences: {
        userId,
      },
    },
    select: {
      listingId: true,
    },
  });

  return results.map((r) => r.listingId);
}

/**
 * Hide a listing for a user (upsert — updates reason if already hidden)
 *
 * @param userId - The ID of the user
 * @param listingId - The ID of the listing to hide
 * @param reason - Optional reason for hiding
 */
export async function hideListingForUser(
  userId: number,
  listingId: number,
  reason?: string
): Promise<void> {
  const { id: userPreferencesId } = await prisma.userPreferences.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  await prisma.hiddenListing.upsert({
    where: {
      userPreferencesId_listingId: {
        userPreferencesId,
        listingId,
      },
    },
    create: {
      userPreferencesId,
      listingId,
      reason: reason ?? null,
      hidden: true,
    },
    update: {
      hidden: true,
      reason: reason ?? null,
      hiddenAt: new Date(),
    },
  });
}

/**
 * Unhide a listing for a user
 *
 * @param userId - The ID of the user
 * @param listingId - The ID of the listing to unhide
 */
export async function unhideListingForUser(
  userId: number,
  listingId: number
): Promise<void> {
  await prisma.hiddenListing.updateMany({
    where: {
      listingId,
      hidden: true,
      userPreferences: {
        userId,
      },
    },
    data: {
      hidden: false,
    },
  });
}

/**
 * Get all hidden listings for a user with full listing data (paginated)
 *
 * @param userId - The ID of the user
 * @param options - Pagination, sorting and filtering options
 * @returns List of hidden listings with total count
 */
export async function getAllUserHiddenListings(
  userId: number,
  options?: {
    skip?: number;
    take?: number;
    sort?: "newest" | "oldest";
    filter?: "all" | "sale" | "rent";
  }
): Promise<{ hiddenListings: UserHiddenListingCard[]; total: number }> {
  const { skip, take, sort = "newest", filter = "all" } = options || {};

  const whereClause: any = {
    hidden: true,
    userPreferences: {
      userId,
    },
  };

  if (filter === "sale") {
    whereClause.listing = { saleListing: { isNot: null } };
  } else if (filter === "rent") {
    whereClause.listing = { rentalListing: { isNot: null } };
  }

  const orderBy = sort === "oldest" ? { hiddenAt: "asc" } : { hiddenAt: "desc" };

  const [hiddenListings, total] = await Promise.all([
    prisma.hiddenListing.findMany({
      where: whereClause,
      select: {
        id: true,
        hiddenAt: true,
        reason: true,
        userPreferencesId: true,
        listing: {
          select: listingCardFields,
        },
      },
      skip,
      take,
      orderBy: orderBy as any,
    }),
    prisma.hiddenListing.count({ where: whereClause }),
  ]);

  return { hiddenListings, total };
}
