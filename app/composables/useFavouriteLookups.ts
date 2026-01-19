/**
 * Shared Global State for User Favourites
 * Keeps valid list of all listing IDs the user has favourited.
 * Note: useAsyncData caches by key, so this is already shared across components
 */
export const useFavouriteLookups = () => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  const { data: favouriteLookups, refresh: refreshFavourites, pending: favouriteLookupsPending } = useAsyncData<number[]>(
    "favouriteLookups",
    () => requestFetch<number[]>("/api/user/favourites/all/lookups"),
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  return {
    favouriteLookups,
    refreshFavourites,
    favouriteLookupsPending,
  };
};
