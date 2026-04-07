import { createSharedComposable } from '@vueuse/core'

/**
 * Shared Global State for User Favourites
 * Keeps valid list of all listing IDs the user has favourited.
 * createSharedComposable ensures a single instance (and single watcher) across the app.
 */
export const useFavouriteLookups = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  const { data: favouriteLookups, refresh: refreshFavourites, pending: favouriteLookupsPending } = useAsyncData<number[]>(
    "favouriteLookups",
    () => loggedIn.value
      ? requestFetch<number[]>("/api/user/favourites/all/lookups")
      : Promise.resolve([]),
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
});

