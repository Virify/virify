import { createSharedComposable } from "@vueuse/core";

interface NoteLookup {
  listingId: number;
  note: string;
}

/**
 * Shared Global State for User Notes
 * Keeps valid list of all listing IDs the user has added notes to.
 */
export const useNoteLookups = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  const { data: noteLookups, refresh: refreshUserNotes } = useAsyncData<NoteLookup[]>(
    "noteLookups",
    () => {
      return requestFetch<NoteLookup[]>("/api/user/notes/all/lookups");
    },
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  return {
    noteLookups,
    refreshUserNotes,
  };
});
