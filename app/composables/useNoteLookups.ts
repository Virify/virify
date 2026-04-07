import { createSharedComposable } from '@vueuse/core'

interface NoteLookup {
  listingId: number;
  note: string;
}

/**
 * Shared Global State for User Notes
 * Keeps valid list of all listing IDs the user has added notes to.
 * createSharedComposable ensures a single instance (and single watcher) across the app.
 */
export const useNoteLookups = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  const { data: noteLookups, refresh: refreshUserNotes, pending: noteLookupsPending } = useAsyncData<NoteLookup[]>(
    "noteLookups",
    () => loggedIn.value
      ? requestFetch<NoteLookup[]>("/api/user/notes/all/lookups")
      : Promise.resolve([]),
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  return {
    noteLookups,
    refreshUserNotes,
    noteLookupsPending,
  };
});

