import type { NoteResponse } from "~~/shared/types/note";

/**
 * Get all notes for a user
 *
 * @param userId - The ID of the user
 * @returns Array of notes with propertyId and note text
 */
export async function getAllUserNotes(userId: number): Promise<NoteData[]> {
  const userNotes = await prisma.userNote.findMany({
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

  // Map the notes to the expected format
  return userNotes.map((note) => ({
    propertyId: note.listingId,
    note: note.note,
  }));
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
 * Create or update a user's note for a listing
 *
 * @param userId - The ID of the user
 * @param listingId - The ID of the listing
 * @param note - The note text
 * @returns Success status
 */
export async function updateUserNote(userId: number, listingId: number, note: string) {
  await prisma.userNote.upsert({
    where: {
      userPreferencesId_listingId: {
        userPreferencesId: userId,
        listingId,
      },
    },
    create: {
      userPreferences: {
        connectOrCreate: {
          where: { userId },
          create: { userId },
        },
      },
      listingId,
      note,
    },
    update: {
      note,
    },
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
