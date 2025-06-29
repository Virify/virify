import { createSharedComposable } from "@vueuse/core";
import type { UserSavedLocation } from "~~/shared/types/userLocation";

export const useSavedLocation = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();

  /**
   * State Management
   */
  const { data: userSavedLocations, refresh: refreshUserLocations } = useAsyncData<UserSavedLocation[]>(
    "userSavedLocations",
    () => useRequestFetch()<UserSavedLocation[]>("/api/user/locations/"),
    {
      default: () => [],
      watch: [loggedIn],
      immediate: true,
    }
  );

  /**
   * Watch for changes in the loggedIn state
   * When the user logs out, clear cached notes state
   * When the user logs in, prefetch notes
   */
  watch(loggedIn, async (isLoggedIn) => {
    if (isLoggedIn) {
      await refreshUserLocations();
    } else {
      userSavedLocations.value = [];
    }
  });

  /**
   * On mount, check if the user is logged in and fetch notes
   * This ensures we have all notes available at once, preventing individual API calls
   */
  onMounted(async () => {
    if (loggedIn.value) {
      await refreshUserLocations();
    }
  });

  return {
    userSavedLocations,
    refreshUserLocations
  }
});
