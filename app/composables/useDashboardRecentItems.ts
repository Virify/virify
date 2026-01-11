import { createSharedComposable } from "@vueuse/core";
import type { NoteData } from "~~/shared/types/note";

/**
 * Shared Global State for Dashboard "Recent" Widgets
 * Fetches recent favourites and notes.
 * Used to avoid re-fetching heavy objects when instantiating lightweight composables.
 */
export const useDashboardRecentItems = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const requestFetch = useRequestFetch();

  /**
   * Recent Favourites
   */
  const { data: recentFavourites, refresh: refreshRecentFavourites, status: recentFavouritesStatus } = useAsyncData<UserFavouriteListingCard[]>(
    "recentFavourites",
    () => {
      if (!loggedIn.value) return Promise.resolve([]);
      return requestFetch<UserFavouriteListingCard[]>("/api/user/favourites/all/recent");
    },
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  /**
   * Recent Notes
   */
  const { data: recentUserNotes, refresh: refreshRecentNotes, status: recentNotesStatus } = useAsyncData<NoteData[]>(
    "recentUserNotes",
    () => {
      if (!loggedIn.value) return Promise.resolve([]);
      return requestFetch<NoteData[]>("/api/user/notes/all/recent");
    },
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  return {
    recentFavourites,
    refreshRecentFavourites,
    recentFavouritesStatus,
    recentUserNotes,
    refreshRecentNotes,
    recentNotesStatus
  };
});
