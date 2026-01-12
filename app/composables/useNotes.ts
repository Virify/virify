import { ViewsDialogLogin, ViewsDialogNotes } from "#components";
import { performMultiOptimisticUpdate } from "~/utils/optimistic-update";

// Track items pending removal (for visual feedback) - Share across instances
const pendingRemoval = ref<Set<number>>(new Set());

/**
 * Notes Composable
 * 
 * Manages user's property notes with optimistic updates for seamless UX.
 * Uses lightweight lookups for efficient hasNote/getNote checks across the app.
 */
export const useNotes = () => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();
  const toast = useToast();
  const requestFetch = useRequestFetch();

  // Local filtering state (mirrors favourites pattern)
  const searchTerm = ref("");
  const categoryFilter = ref<"all" | "sale" | "rental">("all");

  // Pagination state for dashboard
  const total = ref(0);
  const loading = ref(false);

  // Use Shared Global Lookups
  const { noteLookups, refreshUserNotes } = useNoteLookups();
  // Use Shared Recent Items
  const { recentUserNotes, refreshRecentNotes, recentNotesStatus } = useDashboardRecentItems();

  /**
   * Full notes data (for dashboard pages with pagination)
   */
  const userNotes = ref<NoteData[]>([]);

  // Track current pagination state for refetching after add/remove
  const currentFilter = ref<'all' | 'sale' | 'rent'>('all');
  const currentPage = ref(1);
  const currentSort = ref<'newest' | 'oldest'>('newest');
  const currentLimit = ref(20);

  /**
   * Fetch notes with pagination, sort, and filter (for dashboard)
   */
  async function fetchNotes(
    filter: 'all' | 'sale' | 'rent' = 'all',
    page: number = 1,
    sort: 'newest' | 'oldest' = 'newest',
    limit: number = 20
  ) {
    // Store current pagination state
    currentFilter.value = filter;
    currentPage.value = page;
    currentSort.value = sort;
    currentLimit.value = limit;

    loading.value = true;
    try {
      const data = await requestFetch<{ notes: NoteData[], total: number }>(
        `/api/user/notes/all/full?filter=${filter}&sort=${sort}&page=${page}&limit=${limit}`
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

  /**
   * Refetch current page (used after add/remove when dashboard is active)
   */
  async function refetchCurrentPage() {
    if (userNotes.value.length > 0 || total.value > 0) {
      await fetchNotes(currentFilter.value, currentPage.value, currentSort.value, currentLimit.value);
    }
  }

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
   * Check if a property has a note (uses lightweight lookups)
   *
   * @param listingId - ID of the listing
   * @returns boolean indicating if the listing has a note
   */
  const hasNote = (listingId: number): boolean => {
    return noteLookups.value.some((note) => note.listingId === listingId);
  };

  /**
   * Get note for a specific listing (uses lightweight lookups)
   *
   * @param listingId - ID of the Listing
   * @returns note string or undefined
   */
  const getNote = (listingId: number): string | undefined => {
    const noteData = noteLookups.value.find((note) => note.listingId === listingId);
    return noteData?.note;
  };

  /**
   * Get the notes data object for a specific listing
   * Uses lightweight lookups first, falls back to full userNotes for createdAt
   * 
   * @param listingId  - ID of the Listing
   * @returns NoteData object or undefined
   */
  const getNoteData = (listingId: number): { note?: string; createdAt?: any } => {
    // First check lightweight lookups (available across all pages)
    const lookup = noteLookups.value.find((note) => note.listingId === listingId);
    // Fall back to full userNotes for createdAt (only available on notes dashboard)
    const fullNote = userNotes.value.find((note) => note.listingId === listingId);
    
    return {
      note: lookup?.note ?? fullNote?.note,
      createdAt: fullNote?.createdAt,
    };
  };

  /**
   * Update or create a note for a specific listing
   * 
   * Uses optimistic updates: the UI updates immediately while the API call
   * happens in the background. If the API call fails, the change is rolled back.
   *
   * @param listingId - ID of the Listing
   * @param note - The note content to save
   */
  const updateNote = async (listingId: number, note: string) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }

    const isUpdating = hasNote(listingId);
    const successMessage = isUpdating ? "Note updated" : "Note added";
    const errorMessage = isUpdating ? "Failed to update note" : "Failed to add note";

    await performMultiOptimisticUpdate({
      updates: [
        {
          ref: noteLookups,
          optimisticChange: (current) => 
            isUpdating
              ? current.map((n: NoteLookup) => n.listingId === listingId ? { ...n, note } : n)
              : [...current, { listingId, note }],
        },
        {
          ref: userNotes,
          optimisticChange: (current) =>
            current.map((n: NoteData) => n.listingId === listingId ? { ...n, note } : n),
        },
      ],
      operation: async () => {
        await $fetch(`/api/user/notes/${listingId}/`, {
          method: "POST",
          body: { listingId, note },
        });
      },
      onSuccess: () => {
        refreshUserNotes();
        refetchCurrentPage();
        toast.add({ title: 'Success', description: successMessage, color: 'success' });
      },
      onError: (error) => {
        console.error("Error updating note:", error);
        toast.add({ title: 'Error', description: errorMessage, color: 'error' });
      },
    });
  };

  /**
   * Delete a note for a specific listing
   * 
   * Uses optimistic updates: the note is removed from the UI immediately while
   * the API call happens in the background. If the API call fails, the note is restored.
   *
   * @param listingId - ID of the Listing
   */
  const deleteNote = async (listingId: number) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }

    await performMultiOptimisticUpdate({
      updates: [
        {
          ref: noteLookups,
          optimisticChange: (current) => current.filter((n: NoteLookup) => n.listingId !== listingId),
        },
        {
          ref: userNotes,
          optimisticChange: (current) => current.filter((n: NoteData) => n.listingId !== listingId),
        },
      ],
      operation: async () => {
        await $fetch(`/api/user/notes/${listingId}/`, {
          method: "DELETE",
          body: { listingId },
        });
      },
      onSuccess: () => {
        refreshUserNotes();
        refetchCurrentPage();
        toast.add({ title: 'Success', description: "Note deleted", color: 'success' });
      },
      onError: (error) => {
        console.error("Error deleting note:", error);
        toast.add({ title: 'Error', description: "Failed to delete note", color: 'error' });
      },
    });
  };

  /**
   * Watch for changes in the loggedIn state
   * When the user logs out, clear cached notes state
   */
  watch(loggedIn, (isLoggedIn) => {
    if (!isLoggedIn) {
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
    refreshRecentNotes,
    saleNotes,
    rentalNotes,
    refreshUserNotes,
    fetchNotes,
    total,
    loading,
    // search filter state
    searchTerm,
    categoryFilter,
    isLoading: computed(() => loading.value || recentNotesStatus.value === 'pending'),
  };
};
