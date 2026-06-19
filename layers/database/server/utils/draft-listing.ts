import { prisma } from "./prisma-client";
import type { DraftListing, ListingTier } from "../database/prisma/generated/client";
import { propertyInclude } from "./property";
/**
 * Get a draft listing by its ID.
 * @param id DraftListing ID
 * @returns The draft listing or null if not found
 */
export async function getDraftListingById(
  id: number,
): Promise<DraftListingWithFullPayload | null> {
  return await prisma.draftListing.findUnique({
    where: { id },
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          avatar: true,
        },
      },
      sharedUsers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
}

/**
 * Get all draft listings for a user.
 * @param userId User ID
 * @returns A list of draft listings for the user
 */
export async function getDraftListingsByUserId(
  userId: number,
): Promise<DraftListingWithFullPayload[]> {
  return await prisma.draftListing.findMany({
    where: { userId },
    include: {
      rentalListing: true,
      saleListing: true,
      property: {
        include: {
          ...propertyInclude,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          avatar: true,
        },
      },
      sharedUsers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

/**
 * Create a new draft listing.
 * @param userId User ID
 * @param tier Listing tier
 * @param title Listing title
 * @returns The created draft listing
 */
/**
 * Get just the owner userId for a draft listing (lightweight ownership check).
 */
export async function getDraftListingOwner(
  id: number,
): Promise<{ userId: number } | null> {
  return prisma.draftListing.findUnique({
    where: { id },
    select: { userId: true },
  });
}

/**
 * Add a user to the sharedUsers of a draft listing.
 * Prisma's connect is idempotent — safe to call even if already connected.
 */
export async function addSharedUserToDraftListing(draftId: number, targetUserId: number) {
  return prisma.draftListing.update({
    where: { id: draftId },
    data: {
      sharedUsers: {
        connect: { id: targetUserId },
      },
    },
    select: {
      sharedUsers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
}

/**
 * Remove a user from the sharedUsers of a draft listing.
 */
export async function removeSharedUserFromDraftListing(
  draftId: number,
  targetUserId: number,
) {
  return prisma.draftListing.update({
    where: { id: draftId },
    data: {
      sharedUsers: {
        disconnect: { id: targetUserId },
      },
    },
    select: {
      sharedUsers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
}

export async function createDraftListing(
  userId: number,
  tier: ListingTier,
): Promise<DraftListing> {
  return await prisma.draftListing.create({
    data: {
      userId,
      listingTier: tier,
    },
  });
}
