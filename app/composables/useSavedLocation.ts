import { createSharedComposable } from "@vueuse/core";
import type { UserSavedLocation } from "~~/shared/types/userLocation";
import { useStorage } from '@vueuse/core'


export const useSavedLocation = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();

  /**
   * State Management
   */
  const locationHistory = useStorage<GeocodingFeature[]>('searchLocationHistory', []);
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
   * 
   * @param location The location to add to history
   * Adds a location to the search history if it doesn't already exist
   * @returns void
   */
  function addLocationToHistory(location: GeocodingFeature) {
    if(locationHistory.value.length >= 5) {
      // If we have 5 locations, remove the oldest one
      locationHistory.value.shift();
    }
    const exists = locationHistory.value.some(
      (loc) => loc.id === location.id || loc.place_name_en === location.place_name_en
    );

    if (!exists) {
      locationHistory.value.push(location);
    }
  }

  function removeFromLocationHistory(location: GeocodingFeature) {
    locationHistory.value = locationHistory.value.filter(
      (loc) => loc.id !== location.id && loc.place_name_en !== location.place_name_en
    );
  }

  /**
   * Clear the location history
   */
  function clearLocationHistory() {
    locationHistory.value = [];
  }

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
    locationHistory,
    refreshUserLocations,
    addLocationToHistory,
    clearLocationHistory,
    removeFromLocationHistory,
  }
});
