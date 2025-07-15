import { useStorage } from "@vueuse/core";

export function useLocationHistory() {
  const locationHistory = useStorage<GeocodingFeature[]>("searchLocationHistory", []);

  /**
   * Removes a location from the search history if it exists
   *
   * @param location The location to remove from history
   * @returns void
   */
  function removeEntry(location: GeocodingFeature) {
    locationHistory.value = locationHistory.value.filter(({ id, place_name_en }) => {
      return id !== location.id && place_name_en !== location.place_name_en
    });
  }

  /**
   * Adds a location to the search history if it doesn't already exist
   * 
   * @param location The location to add to history
   * @returns void
   */
  function addEntry(location: GeocodingFeature) {
    const existingIndex = locationHistory.value.findIndex(({ id, place_name_en }) => {
      return id === location.id || place_name_en === location.place_name_en
    });

    if (existingIndex >= 0) {
      const existingLocation = locationHistory.value[existingIndex]

      locationHistory.value.splice(existingIndex, 1);
      locationHistory.value.unshift(existingLocation!);

      return
    }

    locationHistory.value.unshift(location);
    locationHistory.value.splice(5, 1);
  }

  /**
   * Clear the location history
   */
  function clearEntries() {
    locationHistory.value = [];
  }

  return {
    entries: locationHistory,
    addEntry,
    removeEntry,
    clearEntries
  }
}