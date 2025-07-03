import type { User } from "@prisma/client";
import { createSharedComposable } from "@vueuse/core";

export const useSavedLocation = createSharedComposable(() => {
  const entries = useState<UserSavedLocation[]>("saved-locations", () => []);

  /**
   *  Get all entries (alias of addEntry, but with no arguments)
   */
  async function getEntries() {
    if (import.meta.server) return;

    await $fetch<UserSavedLocation>(`/api/user/locations/`).then((response) => {
      if (!Array.isArray(response)) {
        throw createError({
          status: 500,
          statusMessage: "Invalid response from server",
        });
      }

      entries.value = response;
    });
  }

  /**
   * Fetch location entries
   */
  const isPending = ref(false);

  async function addEntry(newLocation: UserSavedLocation) {
    if (isPending.value) return;

    // Ensure a location is provided
    if (!newLocation) {
      throw createError({
        status: 400,
        statusMessage: "No location provided",
      });
    }

    // Prevent multiple locations being saved at the same time
    isPending.value = true;

    // Post new location
    await $fetch<UserSavedLocation>(`/api/user/locations/`, {
      method: "POST",
      body: newLocation,
    })
      .then(() => {
        entries.value.push(newLocation);
      })
      .catch(() => {
        throw createError({
          status: 500,
          statusMessage: "Unable to save new location",
        });
      })
      .finally(() => {
        // Re-allow location saving
        isPending.value = false;
      });
  }

  /**
   * Update a location entry
   *
   * @param location UserSavedLocation
   * @param newName string
   * @param id number
   */
  async function updateEntry(entry: UserSavedLocation, newName: string) {
    const updatedLocation = {
      id: entry.id,
      name: newName,
      location: entry.location,
      geocodingFeature: entry.geocodingFeature,
      lat: entry.lat,
      lon: entry.lon,
    } as UserSavedLocation;

    await $fetch<UserSavedLocation>(`/api/user/locations/`, {
      method: "POST",
      body: updatedLocation,
    }).then(() => {
      const index = entries.value.findIndex((e) => e.id === entry.id);
      if (index !== -1) {
        entries.value[index] = updatedLocation;
      }
    });
  }

  /**
   * Check if an entry exists
   */
  function checkEntry(location: Partial<UserSavedLocation>) {
    const { place_name_en } = asObject(location);

    return entries.value.find((entry) => {
      return entry.location === place_name_en;
    });
  }

  /**
   *  Clear entries
   */
  function clearEntries() {
    entries.value = [];
  }

  /**
   * Remove a location entry
   */
  async function deleteEntry(entry: Partial<UserSavedLocation>) {
    await $fetch(`/api/user/locations/${entry.id}`, {
      method: "DELETE",
    })
      .then(() => {
        entries.value = entries.value.filter((e) => e.id !== entry.id);
      })
      .catch(() => {
        throw createError({
          status: 500,
          statusMessage: "Unable to delete location",
        });
      });
  }

  return {
    entries,
    getEntries,
    checkEntry,
    clearEntries,
    deleteEntry,
    addEntry,
    updateEntry,
  };
});
