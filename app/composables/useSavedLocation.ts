import { createSharedComposable } from "@vueuse/core";
import type { UserSavedLocation } from "~~/shared/types/userLocation";
import { useStorage } from "@vueuse/core";
import { ViewsDialogLogin, ViewsDialogUserLocation } from "#components";

export const useSavedLocation = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showDialog } = useDialog();

  /**
   * State Management
   */
  const locationHistory = useStorage<GeocodingFeature[]>("searchLocationHistory", []);
  const { data: userSavedLocations, refresh: refreshUserLocations } = useAsyncData<UserSavedLocation[]>(
    "userSavedLocations",
    async () => {
      if (!loggedIn.value) return [];
      return await useRequestFetch()<UserSavedLocation[]>("/api/user/locations/");
    },
    {
      default: () => [],
      watch: [loggedIn],
    }
  );

  /**
   * Adds a user saved location to the database
   *
   * @param location The location to add to saved locations
   * @returns void
   */
  async function updateUserSavedLocation(location: GeocodingFeature, name: string, id?: number) {
    console.log("Adding user saved location", location, name, id);
    const UserSavedLocation = {
      id: id || undefined,
      name: name,
      geocodingFeature: location,
      lat: location.geometry.coordinates[1],
      lon: location.geometry.coordinates[0],
      location: location.place_name_en,
    } as UserSavedLocation;

    await $fetch(`/api/user/locations/${location.id}`, {
      method: "POST",
      body: UserSavedLocation,
    });

    // Refresh the user saved locations after adding a new one
    await refreshUserLocations();
  }

  /**
   * Checks if a location is saved
   *
   * @param location The location to check if it is saved
   * @returns boolean
   */
  function isSavedLocation(location: any) {
    return userSavedLocations.value?.some((loc) => loc.geocodingFeature?.id === location.id);
  }

  /**
   * Shows a dialog to save a location
   *
   * @param location The location to show in the dialog
   * Opens a dialog to save the location if the user is logged in
   * If the user is not logged in, it shows the login dialog
   * @returns void
   */
  function showLocationDialog(location: GeocodingFeature) {
    if (!loggedIn.value) {
      showDialog({ component: ViewsDialogLogin });
      return;
    }

    // if location.place_name_en matches a saved location, pass the usrSavedLocation
    const existingLocation = userSavedLocations.value.find((loc) => loc.location === location.place_name_en);
    showDialog({
      component: ViewsDialogUserLocation,
      props: { geocodingLocation: location, userSavedLocation: existingLocation },
    });
  }

  /**
   *
   * @param location The location to add to history
   * Adds a location to the search history if it doesn't already exist
   * @returns void
   */
  function addLocationToHistory(location: GeocodingFeature) {
    if (locationHistory.value.length >= 5) {
      // If we have 5 locations, remove the oldest one
      locationHistory.value.shift();
    }
    const exists = locationHistory.value.some((loc) => loc.id === location.id || loc.place_name_en === location.place_name_en);

    if (!exists) {
      locationHistory.value.push(location);
    }
  }

  /**
   * Remove a location from the search history
   *
   * @param location The location to remove from history
   * Removes a location from the search history if it exists
   * @returns void
   */
  function removeFromLocationHistory(location: GeocodingFeature) {
    locationHistory.value = locationHistory.value.filter((loc) => loc.id !== location.id && loc.place_name_en !== location.place_name_en);
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
      console.log("User saved locations fetched on mount:", userSavedLocations.value);
    }
  });

  return {
    userSavedLocations,
    locationHistory,
    refreshUserLocations,
    addLocationToHistory,
    clearLocationHistory,
    removeFromLocationHistory,
    updateUserSavedLocation,
    showLocationDialog,
    isSavedLocation,
  };
});
