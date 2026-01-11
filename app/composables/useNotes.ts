import { ViewsDialogLogin, ViewsDialogNotes } from "#components";
import { createSharedComposable } from "@vueuse/core";
import type { NoteData } from "~~/shared/types/note";

/**
 * Notes Composable
 */
export const useNotes = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();
  const { showToast } = useToastNotification();
  const requestFetch = useRequestFetch();

  // Local filtering state (mirrors favourites pattern)
  const searchTerm = ref("");
  const categoryFilter = ref<"all" | "sale" | "rental">("all");

  // Pagination state for dashboard
  const total = ref(0);
  const loading = ref(false);

  /**
   * State Management
   * Store notes as an array with listing relationship
   */
  const { data: userNotes, refresh: refreshUserNotes, status } = useAsyncData<NoteData[]>(
    "userNotes",
    () => {
      // Only make API call if user is logged in
      if (!loggedIn.value) {
        return Promise.resolve([]);
      }
      return useRequestFetch()<{ notes: NoteData[], total: number }>("/api/user/notes/").then(res => {
        total.value = res.total || 0;
        return res.notes || [];
      });
    },
    {
      default: () => [],
      watch: [loggedIn],
      server: true,
    }
  );

  /**
   * Fetch notes with pagination, sort, and filter (for dashboard)
   */
  async function fetchNotes(
    filter: 'all' | 'sale' | 'rent' = 'all',
    page: number = 1,
    sort: 'newest' | 'oldest' = 'newest',
    limit: number = 20
  ) {
    loading.value = true;
    try {
      const data = await requestFetch<{ notes: NoteData[], total: number }>(
        `/api/user/notes/?filter=${filter}&sort=${sort}&page=${page}&limit=${limit}`
      );
      userNotes.value = data.notes || [];
      total.value = data.total || 0;
    } catch (error) {
      console.error('Error fetching notes:', error);
      userNotes.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  const recentUserNotes = computed(() => {
    return userNotes.value
      .filter((item) => {
        const createdAt = new Date(item.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt >= sevenDaysAgo;
      })
      .slice(0, 8);
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
   * Get the notes data object for a specific listing
   * 
   * @param listingId  - ID of the Listing
   * @returns NoteData object or undefined
   */
  const getNoteData = (listingId: number): { note?: string; createdAt?: any } => {
    return {
      note: userNotes.value.find((note) => note.listingId === listingId)?.note,
      createdAt: userNotes.value.find((note) => note.listingId === listingId)?.createdAt,
    };
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

      await refreshUserNotes();
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

      // Refetch to update list with correct pagination
      await refreshUserNotes();

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
    getNoteData,
    updateNote,
    deleteNote,
    hasNote,
    showNoteDialog,
    userNotes,
    filteredUserNotes,
    recentUserNotes,
    saleNotes,
    rentalNotes,
    refreshUserNotes,
    fetchNotes,
    total,
    loading,
    // search filter state
    searchTerm,
    categoryFilter,
    isLoading: computed(() => {
      // Show loading if idle (not started) or pending with no data
      // If we have data, we suppress the loading state to avoid UI flash during background refreshes
      return status.value === 'idle' || (status.value === 'pending' && !(userNotes.value && userNotes.value.length > 0));
    }),
  };
});
