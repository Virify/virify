interface NoteLookup {
  listingId: number;
  note: string;
}

/**
 * Shared Global State for User Notes
 * Keeps valid list of all listing IDs the user has added notes to.
 * Note: useAsyncData caches by key, so this is already shared across components
 */
export const useNoteLookups = () => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  const { data: noteLookups, refresh: refreshUserNotes, pending: noteLookupsPending } = useAsyncData<NoteLookup[]>(
    "noteLookups",
    () => requestFetch<NoteLookup[]>("/api/user/notes/all/lookups"),
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
};
