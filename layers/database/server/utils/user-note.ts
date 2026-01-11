import type { NoteResponse, NoteData } from "~~/shared/types/note";
/**
 * Get all user note lookups (Ids and Content only)
 * used for checking existence and displaying small notes on cards
 * 
 * @param userId - The ID of the user
 * @returns Array of object with listingId and note
 */
export async function getUserNoteLookups(userId: number): Promise<{ listingId: number; note: string }[]> {
  return await prisma.userNote.findMany({
    where: {
      userPreferences: {
        userId: userId,
      },
    },
    select: {
      listingId: true,
      note: true,
    },
  });
}

/**
 * Get all notes for a user
 *
 * @param userId - The ID of the user
 * @param options - Pagination, sorting and filtering options
 * @returns Array of notes with propertyId and note text
 */
export async function getAllUserNotes(
  userId: number,
  options?: {
    skip?: number;
    take?: number;
    sort?: "newest" | "oldest";
    filter?: "all" | "sale" | "rent";
  }
): Promise<{ notes: NoteData[], total: number }> {
  const { skip, take, sort = "newest", filter = "all" } = options || {};

  const whereClause: any = {
    userPreferences: {
      userId: userId,
    },
  };

  // Add filter logic
  if (filter === "sale") {
    whereClause.listing = {
      saleListing: { isNot: null }
    };
  } else if (filter === "rent") {
    whereClause.listing = {
      rentalListing: { isNot: null }
    };
  }

  const orderBy = sort === "oldest" ? { updatedAt: "asc" } : { updatedAt: "desc" };

  const [notes, total] = await Promise.all([
    prisma.userNote.findMany({
      where: whereClause,
      select: {
        id: true,
        userPreferencesId: true,
        listing: {
          select: {
            ...listingCardFields,
          },
        },
        listingId: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
      orderBy: orderBy as any,
    }),
    prisma.userNote.count({
      where: whereClause,
    }),
  ]);

  return { notes, total };
}

/**
 * Get a user's note for a specific listing
 *
 * @param userId - The ID of the user
 * @param listingId - The ID of the listing
 * @returns The note text or null if no note exists
 */
export async function getUserNote(userId: number, listingId: number): Promise<NoteResponse> {
  const userNote = await prisma.userNote.findFirst({
    where: {
      userPreferences: {
        userId,
      },
      listingId,
    },
    select: {
      note: true,
    },
  });

  return userNote?.note || null;
}

/**
 * 
 * @param userId - The ID of the user
 * @description Fetch recent user notes created in the last 7 days
 * @returns Array of recent user notes
 */
export async function getRecentUserNotes(userId: number) {
  return await prisma.userNote.findMany({
    where: {
      userPreferences: {
        userId: userId,
      },
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
  });
}

/**
 * Create or update a user's note for a listing
 *
 * @param userId - The ID of the user
 * @param listingId - The ID of the listing
 * @param note - The note text
 * @returns Success status
 */
export async function updateUserNote(userId: number, listingId: number, note: string) {
  await prisma.$transaction(async (tx: any) => {
    const userPreferences = await tx.userPreferences.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    await tx.userNote.upsert({
      where: {
        userPreferencesId_listingId: {
          userPreferencesId: userPreferences.id,
          listingId,
        },
      },
      create: {
        userPreferencesId: userPreferences.id,
        listingId,
        note,
      },
      update: {
        note,
      },
    });
  });

  return { success: true };
}

/**
 * Delete a user's note for a listing
 *
 * @param userId - The ID of the user
 * @param listingId - The ID of the listing
 * @returns Success status
 */
export async function deleteUserNote(userId: number, listingId: number) {
  // Delete note in a single query using the relationship
  await prisma.userNote.deleteMany({
    where: {
      userPreferences: {
        userId,
      },
      listingId,
    },
  });

  return { success: true };
}
