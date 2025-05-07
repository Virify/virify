import type { UserFavourites } from "@prisma/client";

/**
 * Get user favourites by ID
 * 
 * @param id number
 * @returns user
 */
export async function getUserFavourites(id: number): Promise<UserFavourites | null> {
  return prisma.userFavourites.findUnique({
    where: { userId: id },
    include: {
      listings: {
        include: {
          property: {
            include: {
              ...propertyInclude
            }
          }
        },
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
export async function addFavouriteFromUserFavourites(userId: number, favouriteId: number): Promise<UserFavourites> {
  return prisma.userFavourites.upsert({
    where: { userId },
    create: {
      userId,
      listings: {
        connect: { id: favouriteId }
      }
    },
    update: {
      listings: {
        connect: { id: favouriteId }
      }
    }
  });
}

/**
 * Remove a listing from the user's favourites from the UserFavourites table
 * 
 * @param userId number (User ID)
 * @param favouriteId number (Listing ID to be removed from favourites)
 * @returns UserFavourites
 */
export async function deleteFavouriteFromUserFavourites(userId: number, favouriteId: number): Promise<UserFavourites> {
  return prisma.userFavourites.update({
    where: { userId },
    data: {
      listings: {
        disconnect: { id: favouriteId }
      }
    }
  });
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
        disconnect: []
      }
    }
  });
}