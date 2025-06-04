import { ViewsDialogLogin, ViewsDialogNotes } from "#components";
import { createSharedComposable } from "@vueuse/core";
import type { NoteData } from "~~/shared/types/note";

/**
 * Notes Composable
 */
export const useNotes = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();

  /**
   * State Management
   * Store property IDs and their associated notes
   */
  const propertyNotes = useState<Map<number, string>>("propertyNotes", () => new Map());

  /**
   * Check if a property has a note
   *
   * @param propertyId - ID of the property
   * @returns boolean indicating if the property has a note
   */
  const hasNote = (propertyId: number): boolean => {
    return propertyNotes.value.has(propertyId) && !!propertyNotes.value.get(propertyId);
  };

  /**
   * Get note for a specific listing
   *
   * @param listingId - ID of the Listing
   * @returns note string or undefined
   */
  const getNote = (listingId: number): string | undefined => {
    // Just return from our local cache - should be populated from getAllNotes
    return propertyNotes.value.get(listingId);
  };

  /**
   * Update note for a specific listing
   *
   * @param listingId - ID of the Listing
   * @param note - The note to save
   */
  const updateNote = async (listingId: number, note: string) => {
    if (!loggedIn.value) {
      showDialog({
        component: ViewsDialogLogin,
      });
      return;
    }

    try {
      await $fetch(`/api/user/notes/${listingId}/`, {
        method: "POST",
        body: {
          listingId,
          note,
        },
      });

      // Update the state after successful API call
      propertyNotes.value.set(listingId, note);
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  /**
   * Delete note for a specific listing
   *
   * @param listingId - ID of the Listing
   */
  const deleteNote = async (listingId: number) => {
    if (!loggedIn.value) {
      showDialog({
        component: ViewsDialogLogin,
      });
      return;
    }

    try {
      await $fetch(`/api/user/notes/${listingId}/`, {
        method: "DELETE",
        body: { listingId },
      });

      // Remove from state after successful API call
      propertyNotes.value.delete(listingId);
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };

  /**
   * Fetch all notes for the user
   * This prefetches all notes and stores in local state
   */
  const getAllNotes = async () => {
    if (!loggedIn.value) return;

    try {
      const result = await $fetch<NoteData[]>("/api/user/notes/");
      propertyNotes.value.clear();

      if (result && Array.isArray(result)) {
        result.forEach((item) => {
          if (item && item.propertyId && item.note) {
            propertyNotes.value.set(item.propertyId, item.note);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching all notes:", error);
    }
  };

  /**
   * Watch for changes in the loggedIn state
   * When the user logs out, clear cached notes state
   * When the user logs in, prefetch notes
   */
  watch(loggedIn, async (isLoggedIn) => {
    if (isLoggedIn) {
      await getAllNotes();
    } else {
      propertyNotes.value.clear();
    }
  });

  /**
   * On mount, check if the user is logged in and fetch notes
   * This ensures we have all notes available at once, preventing individual API calls
   */
  onMounted(async () => {
    if (loggedIn.value) {
      await getAllNotes();
    }
  });

  /**
   * Show note dialog for a specific property
   *
   * @param propertyId - ID of the property
   */
  const showNoteDialog = (propertyId: number) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }
    showDialog({
      component: ViewsDialogNotes,
      props: { propertyId },
    });
  };

  return {
    getNote,
    updateNote,
    deleteNote,
    hasNote,
    getAllNotes,
    showNoteDialog,
  };
});
