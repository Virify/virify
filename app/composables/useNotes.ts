import { ViewsDialogLogin, ViewsDialogNotes } from "#components";
import { createSharedComposable } from "@vueuse/core";
import type { NoteData } from "~~/shared/types/note";

/**
 * Notes Composable
 */
export const useNotes = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  // Local filtering state (mirrors favourites pattern)
  const searchTerm = ref("");
  const categoryFilter = ref<"all" | "sale" | "rental">("all");

  /**
   * State Management
   * Store notes as an array with listing relationship
   */
  const { data: userNotes, refresh: refreshUserNotes } = useAsyncData<NoteData[]>(
    "userNotes",
    () => {
      // Only make API call if user is logged in
      if (!loggedIn.value) {
        return Promise.resolve([]);
      }
      return useRequestFetch()<NoteData[]>("/api/user/notes/");
    },
    {
      default: () => [],
      watch: [loggedIn],
      server: false, // Prevent server-side execution
    }
  );

  const recentUserNotes = computed(() => {
    return userNotes.value
      .filter((item) => {
        const createdAt = new Date(item.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt >= sevenDaysAgo;
      })
      .slice(0, 6);
  });

  const saleNotes = computed(() => {
    return userNotes.value.filter((item) => item.listing?.saleListing);
  });

  const rentalNotes = computed(() => {
    return userNotes.value.filter((item) => item.listing?.rentalListing);
  });

  /**
   * Filtered notes based on search term and category
   * Uses shared search utility to match against listing fields + note content
   */
  const filteredUserNotes = computed(() => {
    const category = categoryFilter.value;
    let list = userNotes.value || [];
    if (category === "sale") list = list.filter((n) => n?.listing?.saleListing);
    else if (category === "rental") list = list.filter((n) => n?.listing?.rentalListing);
    return filterListingItems(list, searchTerm.value, true); // include notes content
  });

  /**
   * Check if a property has a note
   *
   * @param listingId - ID of the listing
   * @returns boolean indicating if the listing has a note
   */
  const hasNote = (listingId: number): boolean => {
    return userNotes.value.some((note) => note.listingId === listingId);
  };

  /**
   * Get note for a specific listing
   *
   * @param listingId - ID of the Listing
   * @returns note string or undefined
   */
  const getNote = (listingId: number): string | undefined => {
    const noteData = userNotes.value.find((note) => note.listingId === listingId);
    return noteData?.note;
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

    const isUpdating = hasNote(listingId);

    try {
      await $fetch(`/api/user/notes/${listingId}/`, {
        method: "POST",
        body: {
          listingId,
          note,
        },
      });

      // Update the state after successful API call
      const existingIndex = userNotes.value.findIndex((n) => n.listingId === listingId);
      if (existingIndex >= 0 && userNotes.value[existingIndex]) {
        userNotes.value[existingIndex].note = note;
      } else {
        // If note doesn't exist, we should refetch all notes to get the complete data
        refreshUserNotes();
      }

      // Show success toast
      showToast(isUpdating ? "Note updated" : "Note added", { type: "success" });
    } catch (error) {
      console.error("Error updating note:", error);
      // Show error toast
      showToast(isUpdating ? "Failed to update note" : "Failed to add note", { type: "error" });
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
      userNotes.value = userNotes.value.filter((note) => note.listingId !== listingId);

      // Show success toast
      showToast("Note deleted", { type: "success" });
    } catch (error) {
      console.error("Error deleting note:", error);
      // Show error toast
      showToast("Failed to delete note", { type: "error" });
      throw error;
    }
  };

  /**
   * Watch for changes in the loggedIn state
   * When the user logs out, clear cached notes state
   * When the user logs in, prefetch notes
   */
  watch(loggedIn, async (isLoggedIn) => {
    if (isLoggedIn) {
      await refreshUserNotes();
    } else {
      userNotes.value = [];
    }
  });

  /**
   * On mount, check if the user is logged in and fetch notes
   * This ensures we have all notes available at once, preventing individual API calls
   */
  onMounted(async () => {
    if (loggedIn.value) {
      await refreshUserNotes();
    }
  });

  /**
   * Show note dialog for a specific property
   *
   * @param listingId - ID of the listing
   */
  const showNoteDialog = (listingId: number) => {
    console.log("showNoteDialog", listingId);
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }
    showDialog({
      component: ViewsDialogNotes,
      props: { listingId },
    });
  };

  return {
    getNote,
    updateNote,
    deleteNote,
    hasNote,
    showNoteDialog,
    userNotes,
    filteredUserNotes,
    recentUserNotes,
    saleNotes,
    rentalNotes,
    // search filter state
    searchTerm,
    categoryFilter,
  };
});
