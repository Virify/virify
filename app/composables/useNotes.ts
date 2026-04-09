import { ViewsDialogLogin, ViewsDialogNotes } from "#components";
import { performMultiOptimisticUpdate, performPendingRemoval } from "~/utils/optimistic-update";

// Track items pending removal (for visual feedback) - Share across instances
const pendingRemoval = ref<Set<number>>(new Set());

/**
 * Notes Composable
 *
 * Manages user's property notes with optimistic updates for seamless UX.
 * Uses lightweight lookups for efficient hasNote/getNote checks across the app.
 */
export const useNotes = () => {
  const { loggedIn, user } = useUserSession();
  const { showDialog } = useDialog();
  const toast = useToast();
  const requestFetch = useRequestFetch();

  // Use Shared Global Lookups
  const { noteLookups, refreshUserNotes } = useNoteLookups();
  // Use Shared Recent Items
  const { recentUserNotes, refreshRecentNotes, recentNotesStatus } = useDashboardRecentItems();

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
    const lookup = noteLookups.value.find((note) => note.listingId === listingId);

    return {
      note: lookup?.note,
      createdAt: undefined,
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
          optimisticChange: (current) => (isUpdating ? current.map((n: NoteLookup) => (n.listingId === listingId ? { ...n, note } : n)) : [...current, { listingId, note }]),
        },
      ],
      operation: async () => {
        await requestFetch(`/api/user/notes/${listingId}/`, {
          method: "POST",
          body: { listingId, note },
        });
      },
      onSuccess: () => {
        refreshUserNotes();
        toast.add({ title: successMessage, color: "success", icon: "i-lucide-notebook-pen" });
      },
      onError: (error) => {
        console.error("Error updating note:", error);
        toast.add({ title: "Error", description: errorMessage, color: "error", icon: "i-lucide-circle-x" });
      },
    });
  };

  /**
   * Delete a note for a specific listing
   */
  const deleteNote = async (listingId: number) => {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }

    await performPendingRemoval({
      pendingSet: pendingRemoval,
      id: listingId,
      operation: async () => {
        await requestFetch(`/api/user/notes/${listingId}/`, {
          method: "DELETE",
          body: { listingId },
        });
      },
      onSuccess: async () => {
        await refreshUserNotes();
        toast.add({ title: "Note deleted", color: "success", icon: "i-lucide-notebook" });
      },
      onError: (error) => {
        console.error("Error deleting note:", error);
        toast.add({ title: "Error", description: "Failed to delete note", color: "error", icon: "i-lucide-circle-x" });
      },
    });
  };

  function isNotePendingRemoval(listingId: number): boolean {
    return pendingRemoval.value.has(listingId);
  }

  watch(loggedIn, (isLoggedIn) => {
    if (!isLoggedIn) {
      pendingRemoval.value = new Set();
    }
  });

  const showNoteDialog = (listingId: number) => {
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
    isNotePendingRemoval,
    showNoteDialog,
    recentUserNotes,
    refreshRecentNotes,
    refreshUserNotes,
    isLoading: computed(() => recentNotesStatus.value === "pending"),
  };
};
