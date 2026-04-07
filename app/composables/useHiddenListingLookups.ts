import { createSharedComposable } from '@vueuse/core'

/**
 * Shared Global State for User Hidden Listings
 * Keeps a valid list of all listing IDs the user has hidden.
 * createSharedComposable ensures a single instance (and single watcher) across the app.
 */
export const useHiddenListingLookups = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  const { data: hiddenListingLookups, refresh: refreshHiddenListings, pending: hiddenListingsPending } = useAsyncData<number[]>(
    "hiddenListingLookups",
    () => loggedIn.value
      ? requestFetch<number[]>("/api/user/hidden-listings/all/lookups")
      : Promise.resolve([]),
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  return {
    hiddenListingLookups,
    refreshHiddenListings,
    hiddenListingsPending,
  };
});

