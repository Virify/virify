import { createSharedComposable } from "@vueuse/core";

/**
 * Shared Global State for User Favourites
 * Keeps valid list of all listing IDs the user has favourited.
 */
export const useFavouriteLookups = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  const { data: favouriteLookups, refresh: refreshFavourites } = useAsyncData<number[]>(
    "favouriteLookups",
    () => {
      if (!loggedIn.value) return Promise.resolve([]);
      return requestFetch<number[]>("/api/user/favourites/all/lookups");
    },
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  return {
    favouriteLookups,
    refreshFavourites,
  };
});
