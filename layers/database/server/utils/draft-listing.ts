import { prisma } from "./prisma-client";
import type { DraftListing, ListingTier } from "../database/prisma/generated/client";
import { propertyInclude } from "./property";
/**
 * Get a draft listing by its ID.
 * @param id DraftListing ID
 * @returns The draft listing or null if not found
 */
export async function getDraftListingById(id: number): Promise<DraftListingWithFullPayload | null> {
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
export async function getDraftListingsByUserId(userId: number): Promise<DraftListingWithFullPayload[]> {
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
export async function createDraftListing(userId: number, tier: ListingTier): Promise<DraftListing> {
  return await prisma.draftListing.create({
    data: {
      userId,
      listingTier: tier,
    },
  });
}