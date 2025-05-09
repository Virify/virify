import type { UserFavourites } from "@prisma/client";
import type { UserFavouritesListingType } from "~~/shared/types/user-favourites";

/**
 * Get user favourites by ID
 *
 * @param id number
 * @returns user
 */
export async function getUserFavourites(id: number): Promise<UserFavouritesListingType | null> {
  return prisma.userFavourites.findUnique({
    where: { userId: id },
    include: {
      listings: {
        select: listingCardFields,
      },
    },
  });
}

/**
 * Add a listing to the user's favourites from the UserFavourites table
 *
 * @param userId number (User ID)
 * @param favouriteId number (Listing ID to be added to favourites)
 * @returns UserFavourites
 */
export async function addFavouriteFromUserFavourites(userId: number, favouriteId: number): Promise<Number[]> {
  const userFavourites = await prisma.userFavourites.upsert({
    where: { userId },
    create: {
      userId,
      listings: {
        connect: { id: favouriteId },
      },
    },
    update: {
      listings: {
        connect: { id: favouriteId },
      },
    },
    include: {
      listings: {
        select: { id: true },
      },
    },
  });
  return userFavourites.listings.map((listing) => listing.id);
}

/**
 * Remove a listing from the user's favourites from the UserFavourites table
 *
 * @param userId number (User ID)
 * @param favouriteId number (Listing ID to be removed from favourites)
 * @returns UserFavourites
 */
export async function deleteFavouriteFromUserFavourites(userId: number, favouriteId: number): Promise<Number[]> {
  const userFavourites = await prisma.userFavourites.update({
    where: { userId },
    data: {
      listings: {
        disconnect: { id: favouriteId },
      },
    },
    include: {
      listings: {
        select: { id: true },
      },
    },
  });
  return userFavourites.listings.map((listing) => listing.id);
}

/**
 * Delete all listings from user favourites
 *
 * @param userId number (User ID)
 * @returns UserFavourites
 */
export async function deleteAllFavouritesFromUserFavourites(userId: number): Promise<UserFavourites> {
  return prisma.userFavourites.update({
    where: { userId },
    data: {
      listings: {
        disconnect: [],
      },
    },
  });
}

/**
 * Get all favourite listings IDs for a user
 *
 * @param userId number (User ID)
 * @param favouriteId number (Listing ID to be checked)
 * @returns Favourite Listings by ID
 */
export async function getFavouriteListingIds(userId: number): Promise<Number[]> {
  const userFavourites = await prisma.userFavourites.findUnique({
    where: { userId },
    select: {
      listings: {
        select: {
          id: true,
        },
      },
    },
  });

  return userFavourites?.listings.map((listing) => listing.id) || [];
}
